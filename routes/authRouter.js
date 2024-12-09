import {Router} from "express";
import {signin, signup} from "../controllers/authController.js";

const router = Router()

router.route('/signin').post(signin);
router.route('/signup').post(signup);

export default router;