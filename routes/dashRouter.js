import {Router} from "express";
import {getDashData} from "../controllers/dashController.js";

const router = Router();

router.route("/:organization").get(getDashData);

export default router;