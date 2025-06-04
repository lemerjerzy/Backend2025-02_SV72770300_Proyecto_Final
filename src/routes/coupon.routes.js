import { Router } from "express";
import {
    getAllCoupons,
    getOnlyCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon
} from "../controllers/coupon.controller.js";
import { validateAuthJwt, isAdmin, isModerator } from "../middleware/authJwt.js"
import { validateFields } from "../middleware/validateField.js"
import { check } from "express-validator";

const couponRoutes = Router();

couponRoutes.use(validateAuthJwt)

couponRoutes.get("/", getAllCoupons);
couponRoutes.get("/:couponId", getOnlyCoupon);
couponRoutes.post("/", [
    check("code", "Code es requerido").not().isEmpty(),
    check("discount", "Discount es requerido").not().isEmpty(),
    check("expirationDate", "ExpirationDate es requerido").not().isEmpty(),
], validateFields, isModerator, createCoupon);
couponRoutes.put("/:couponId", isModerator, updateCoupon);
couponRoutes.delete("/:couponId", isAdmin, deleteCoupon);

export default couponRoutes;