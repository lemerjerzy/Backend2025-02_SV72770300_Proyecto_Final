import { Router } from "express";
import makePayment from "../controllers/payment.controller.js";
import { validateAuthJwt } from "../middleware/authJwt.js";

const paymentRoutes = Router();

paymentRoutes.post("/", validateAuthJwt, makePayment);

export default paymentRoutes;