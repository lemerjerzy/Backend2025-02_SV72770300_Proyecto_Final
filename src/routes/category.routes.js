import { Router } from "express";
import {
    getAllCategories,
    getOnlyCategory,
    createCategory,
    updateCategory,
    deleteCategory
} from "../controllers/category.controller.js";
import { validateAuthJwt, isAdmin, isModerator } from "../middleware/authJwt.js"
import { validateFields } from "../middleware/validateField.js"
import { check } from "express-validator";

const categoryRoutes = Router();

categoryRoutes.use(validateAuthJwt);

categoryRoutes.get("/", getAllCategories);
categoryRoutes.get("/:categoryId", getOnlyCategory);
categoryRoutes.post("/", [
    check("name", "Name es requerido").not().isEmpty(),
], validateFields, isModerator, createCategory);
categoryRoutes.put("/:categoryId", isModerator, updateCategory);
categoryRoutes.delete("/:categoryId", isAdmin, deleteCategory);

export default categoryRoutes;