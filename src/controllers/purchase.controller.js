import Sale from "../models/purchase.model.js";

const getAllPurchase = (req, res) => {

    const user = req.user;

    Sale.find(
        {
            user: user._id
        }
    )
        .populate("user")
        .populate("courses.course")
        .then(purchase => {
            const getPurchases = purchase.map(purchase => ({
                _id: purchase._id,
                user: {
                    _id: purchase.user._id,
                    name: purchase.user.username,
                    email: purchase.user.email
                },
                courses: purchase.courses.map(item => ({
                    _id: item.course._id,
                    name: item.course.name,
                    value: item.course.value,
                    quantity: item.quantity,
                    status: item.status

                })),
                status: purchase.status,
                totalAmount: purchase.totalAmount,
                currency: purchase.currency,
                paymentDate: purchase.paymentDate,
                paymentId: purchase.paymentId
            }));

            return res.status(200).json({
                message: "Compras obtenidas con éxito",
                purchase: getPurchases
            });
        }).catch(error => {
            return res.status(500).json({
                message: "Error al obtener las compras",
                error: error.message
            })
        })

}


const getOnlyPurchase = (req, res) => {

    const { purchaseId } = req.params;
    const user = req.user;

    Sale.findOne({
        _id: purchaseId,
        user: user._id
    })
        .populate("user")
        .populate("courses.course")
        .then(purchase => {
            if (!purchase) {
                return res.status(404).json({
                    message: "La compra no existe"
                })
            }

            const getPurchase = {
                _id: purchase._id,
                user: {
                    _id: purchase.user._id,
                    name: purchase.user.username,
                    email: purchase.user.email
                },
                courses: purchase.courses.map(item => ({
                    _id: item.course._id,
                    name: item.course.name,
                    value: item.course.value,
                    quantity: item.quantity

                })),
                status: purchase.status,
                totalAmount: purchase.totalAmount,
                currency: purchase.currency,
                paymentDate: purchase.paymentDate,
                paymentId: purchase.paymentId
            }

            return res.status(200).json({
                message: "Compra obtenida con éxito",
                purchase: getPurchase
            })
        }).catch(error => {
            res.status(500).json({
                message: "Error al obtener la compra",
                error: error.message
            })
        })
}

export {
    getAllPurchase,
    getOnlyPurchase
}