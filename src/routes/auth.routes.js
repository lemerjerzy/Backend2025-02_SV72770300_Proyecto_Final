import { Router } from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
import { validateFields } from "../middleware/validateField.js"
import { check } from "express-validator";
const authRoutes = Router();

authRoutes.post("/signup", [
    check("username", "Username es requerido").not().isEmpty(),
    check("email", "Email es requerido").not().isEmpty(),
    check("password", "Password es requerido").not().isEmpty(),
], validateFields, signup)
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);

export default authRoutes;
