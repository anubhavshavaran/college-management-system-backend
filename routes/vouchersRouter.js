import {Router} from "express";
import {
    createVoucher,
    deleteVoucher,
    getAllVouchers,
    getVoucher,
    updateVoucher
} from "../controllers/voucherController.js";

const router = Router();

router.route('/:organization')
    .get(getAllVouchers)
    .post(createVoucher);

router.route('/:organization/:id')
    .get(getVoucher)
    .patch(updateVoucher)
    .delete(deleteVoucher);

export default router;