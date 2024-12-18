import {Router} from "express";
import {
    createOneStudent,
    deleteStudent,
    getStudent,
    getStudents,
    updateStudent
} from "../controllers/studentsController.js";

const router = Router();

router.route('/:organization')
    .get(getStudents)
    .post(createOneStudent);

router.route('/:organization/:id')
    .get(getStudent)
    .patch(updateStudent)
    .delete(deleteStudent);

export default router;