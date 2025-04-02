import {Router} from "express";
import {
    createOneStudent,
    deleteStudent,
    getStudent,
    getStudents, getStudentsYears, promoteStudents, searchStudents,
    updateStudent
} from "../controllers/studentsController.js";

const router = Router();

router.route('/:organization')
    .get(getStudents)
    .post(createOneStudent);

router.route('/:organization/year')
    .get(getStudentsYears);

router.route('/:organization/promote')
    .post(promoteStudents);

router.route('/:organization/search/:searchQuery')
    .get(searchStudents);

router.route('/:organization/:id')
    .get(getStudent)
    .patch(updateStudent)
    .delete(deleteStudent);

export default router;