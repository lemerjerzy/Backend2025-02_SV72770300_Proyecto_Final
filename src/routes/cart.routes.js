import { Router } from "express";
import {
    addCard,
    loadCart,
    // updateQuantityCart,
    deleteItem
} from "../controllers/cart.controller.js";
import { validateAuthJwt } from "../middleware/authJwt.js"
import { validateFields } from "../middleware/validateField.js"
import { check } from "express-validator";

const cartRoutes = Router();

cartRoutes.use(validateAuthJwt)

cartRoutes.get("/", loadCart);
cartRoutes.post("/", [
    check("course", "Course es requerido").not().isEmpty(),
], validateFields, addCard);
// cartRoutes.put("/:cartId", updateQuantityCart);
cartRoutes.delete("/:cartId", deleteItem);

export default cartRoutes;