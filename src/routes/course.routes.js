import { Router } from "express";
import {
    getAllCourses,
    getOnlyCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    filterCourses,
    filterCoursesPerCategory
} from "../controllers/course.controller.js";
import { validateAuthJwt, isAdmin, isModerator }from "../middleware/authJwt.js"
import { validateFields } from "../middleware/validateField.js"
import { check } from "express-validator";

const courseRoutes = Router();

courseRoutes.get("/", getAllCourses);
courseRoutes.post("/filter", [
    check("query", "Query es requerido").not().isEmpty(),
],validateFields, filterCourses);
courseRoutes.post("/filter/category", [
    check("query", "Query es requerido").not().isEmpty(),
],validateFields, filterCoursesPerCategory);
courseRoutes.get("/:courseId", getOnlyCourse);
courseRoutes.post("/", [
    check("name", "Name es requerido").not().isEmpty(),
    check("value", "Value es requerido").not().isEmpty(),
], validateFields, validateAuthJwt, isModerator, createCourse);
courseRoutes.put("/:courseId", validateAuthJwt, isModerator, updateCourse);
courseRoutes.delete("/:courseId", validateAuthJwt, isAdmin, deleteCourse);

export default courseRoutes;