import Culqi from "culqi-node";
import Cart from "../models/cart.model.js";
import Purchase from "../models/purchase.model.js";
import Coupon from "../models/coupon.model.js";
import dotenv from "dotenv";

dotenv.config();

const culqi = new Culqi({
    publicKey: process.env.CULQI_PUBLIC_KEY,
    privateKey: process.env.CULQI_PRIVATE_KEY,
    pciCompliant: true
});

const makePayment = async (req, res) => {
    const user = req.user;
    const {
        card_number,
        cvv,
        expiration_month,
        expiration_year,
        currency_code,
        code_discount
    } = req.body;

    try {
        const cartItems = await Cart.aggregate([
            {
                $match: {
                    user: user._id
                }
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "course",
                    foreignField: "_id",
                    as: "courseDetails"
                }
            },
            { $unwind: "$courseDetails" },
            {
                $project: {
                    quantity: 1,
                    status: 1,
                    "courseDetails.value": 1,
                    "courseDetails._id": 1
                }
            }
        ]);

        if (!cartItems.length) {
            return res.status(400).json({
                message: "El carrito está vacío"
            });
        }

        let discount = 0;

        let totalAmount = cartItems.reduce((acc, item) => {
            return acc + (item.quantity * item.courseDetails.value);
        }, 0);

        if (code_discount) {
            const coupon = await Coupon.findOne({
                code: code_discount
            });
            if (!coupon) {
                return res.status(400).json({
                    message: "Cupón no encontrado"
                });
            }

            if (coupon.active === false) {
                return res.status(400).json({
                    message: "Cupón no activo"
                })
            }

            if (coupon.expirationDate && new Date(coupon.expirationDate) < new Date()) {
                return res.status(400).json({
                    message: "Cupón caducado"
                })
            }

            discount = totalAmount * (coupon.discount / 100);
            totalAmount -= discount;
        }

        const newAmount = Math.round(totalAmount * 100);

        if (newAmount > 9999900 || newAmount < 100) {
            return res.status(400).json({
                message: "El monto total excede o es mínimo a lo permitido para el pago"
            });
        }

        const token = await culqi.tokens.createToken({
            card_number: card_number,
            cvv: cvv,
            expiration_month: expiration_month,
            expiration_year: expiration_year,
            email: user.email
        });

        const charge = await culqi.charges.createCharge({
            amount: newAmount,
            currency_code: currency_code || "PEN",
            email: user.email,
            source_id: token.id
        });

        await Cart.updateMany(
            {
                user: user._id,
                status: "Pendiente"
            },
            {
                $set: {
                    status: "Comprado"
                }
            }
        );

        const newPurchase = new Purchase({
            user: user._id,
            currency: currency_code || "PEN",
            courses: cartItems.map(item => ({
                course: item.courseDetails?._id,
                quantity: item.quantity,
                status: "Comprado"
            })),
            totalAmount: totalAmount,
            paymentId: charge.id,
            status: "Pagado",
            discount: discount,
            coupon: code_discount || null
        });

        const savedPurchase = await newPurchase.save();

        await Cart.deleteMany({ user: user._id });

        res.status(200).json({
            message: "Pago realizado satisfactoriamente y carrito vaciado",
            payment: charge,
            purchase: savedPurchase
        });

    } catch (error) {
        console.error("Error en el pago:", error);
        res.status(500).json({
            message: "Error al realizar el pago",
            error: error.message || error.merchant_message
        });
    }
};

export default makePayment;