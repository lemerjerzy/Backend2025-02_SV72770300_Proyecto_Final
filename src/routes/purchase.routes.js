import { Router } from "express";
import {
    getAllPurchase,
    getOnlyPurchase
} from "../controllers/purchase.controller.js";
import { validateAuthJwt } from "../middleware/authJwt.js"

const purchaseRoutes = Router();

purchaseRoutes.use(validateAuthJwt);

purchaseRoutes.get("/", getAllPurchase);
purchaseRoutes.get("/:purchaseId", getOnlyPurchase)

export default purchaseRoutes;