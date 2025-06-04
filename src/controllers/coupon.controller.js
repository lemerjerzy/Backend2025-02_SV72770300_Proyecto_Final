import Coupon from "../models/coupon.model.js";

const getAllCoupons = (req, res) => {
    Coupon.find()
        .then(coupons => {
            res.status(200).json({
                message: "Cupones obtenidos con éxito",
                coupons: coupons
            })
        }).catch(error => {
            res.status(500).json({
                message: "Error al obtener los cupones",
                error: error.message
            })
        })
}


const getOnlyCoupon = (req, res) => {
    const { couponId } = req.params;
    Coupon.findById(couponId)
        .then(coupon => {
            if (!coupon) {
                res.status(404).json({
                    message: "El cupón no existe"
                })
            }

            return res.status(200).json({
                message: "Cupón obtenido con éxito",
                coupon: coupon
            })
        }).catch(error => {
            res.status(500).json({
                message: "Error al obtener el cupón",
                error: error.message
            })
        })
}


const createCoupon = (req, res) => {

    const { code, discount, expirationDate } = req.body;

    const coupon = new Coupon({
        code: code,
        discount: discount,
        expirationDate: expirationDate
    })

    coupon.save()
        .then(newCoupon => {
            res.status(200).json({
                message: "Cupón creado con éxito",
                coupon: newCoupon
            })
        }).catch(error => {
            res.status(500).json({
                message: "Error al crear el cupón",
                error: error.message
            })
        })

}

const updateCoupon = (res, req) => {
    const { couponId } = req.params;
    const updateData = req.body;

    Coupon.findByIdAndUpdate(couponId, updateData, { new: true })
        .then(updatedCoupon => {
            if (!updatedCoupon) {
                return res.status(404).json({
                    message: "El cupón no existe"
                });
            }
            res.status(200).json({
                message: "Cupón actualizado correctamente",
                coupon: updatedCoupon
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Error al actualizar cupón",
                error: error.message
            });
        });
}

const deleteCoupon = (req, res) => {
    const { couponId } = req.params;

    Coupon.findByIdAndUpdate(couponId, { active: false }, { new: true })
        .then(coupon => {
            if (!coupon) {
                return res.status(404).json({
                    message: "Cupón no encontrado"
                });
            }
            res.status(200).json({
                message: "Cupón marcado como inactivo",
                coupon: coupon
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Error al desactivar cupón",
                error: error.message
            });
        });
}

export {
    getAllCoupons,
    getOnlyCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon
}