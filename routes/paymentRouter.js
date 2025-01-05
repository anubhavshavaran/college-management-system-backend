import {Router} from "express";
import {
    createPayment,
    deletePayment,
    getPayment,
    getPaymentsOfStudent,
    getPaymentStats
} from "../controllers/paymentController.js";

const router = Router();

router.route("/stats/:organization/:year").get(getPaymentStats);

router.route("/receipt/:id").get(getPayment);

router.route("/:id")
    .get(getPaymentsOfStudent)
    .post(createPayment)
    .delete(deletePayment);

export default router;