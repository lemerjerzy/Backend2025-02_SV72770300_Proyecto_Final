import { Router } from "express";
import {
    getAllUsers,
    getOnlyUser,
    createUser,
    updateUser,
    deleteUser
} from "../controllers/user.controller.js";
import { validateAuthJwt, isAdmin, isModerator } from "../middleware/authJwt.js"
import { validateFields } from "../middleware/validateField.js"
import { check } from "express-validator";

const userRoutes = Router();

userRoutes.use(validateAuthJwt);

userRoutes.get("/", getAllUsers);
userRoutes.get("/:userId", getOnlyUser);
userRoutes.post("/", [
    check("username", "Username es requerido").not().isEmpty(),
    check("email", "Email es requerido").not().isEmpty(),
    check("password", "Password es requerido").not().isEmpty(),
], validateFields, isModerator, createUser);
userRoutes.put("/:userId", isModerator, updateUser);
userRoutes.delete("/:userId", isAdmin, deleteUser);

export default userRoutes;
