import { Router } from "express";
import {
    getAllCourses,
    getOnlyCourse,
    createCourse,
    updateCourse,
    deleteCourse
} from "../controllers/course.controller.js";
import { validateAuthJwt, isAdmin, isModerator }from "../middleware/authJwt.js"
import { validateFields } from "../middleware/validateField.js"
import { check } from "express-validator";

const courseRoutes = Router();

courseRoutes.get("/", getAllCourses);
courseRoutes.get("/:courseId", getOnlyCourse);
courseRoutes.post("/", [
    check("name", "Name es requerido").not().isEmpty(),
    check("value", "Value es requerido").not().isEmpty(),
], validateFields, validateAuthJwt, isModerator, createCourse);
courseRoutes.put("/:courseId", isModerator, validateAuthJwt, updateCourse);
courseRoutes.delete("/:courseId", validateAuthJwt, isAdmin, deleteCourse);

export default courseRoutes;