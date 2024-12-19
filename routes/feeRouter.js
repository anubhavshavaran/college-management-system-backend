import {Router} from "express";
import {createFee} from "../controllers/feeController.js";

const router = Router();

router.route("/").post(createFee);

export default router;