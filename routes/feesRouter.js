import {Router} from "express";
import {updateStudentsFee} from "../controllers/studentsController.js";

const router = Router();

router.route('/:organization')
    .patch(updateStudentsFee);

export default router;