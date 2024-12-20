import {Router} from "express";
import {createPayment, getPaymentsOfStudent, getPaymentStats} from "../controllers/paymentController.js";

const router = Router();

router.route("/stats/:organization/:year").get(getPaymentStats);

router.route("/:id")
    .get(getPaymentsOfStudent)
    .post(createPayment);


export default router;