import {Router} from "express";
import {
    createOneStudent,
    deleteStudent,
    getStudent,
    getStudents, searchStudents,
    updateStudent
} from "../controllers/studentsController.js";

const router = Router();

router.route('/:organization')
    .get(getStudents)
    .post(createOneStudent);

router.route('/:organization/search/:searchQuery')
    .get(searchStudents);

router.route('/:organization/:id')
    .get(getStudent)
    .patch(updateStudent)
    .delete(deleteStudent);

export default router;