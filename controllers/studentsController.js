import {createOne, deleteOne, getAll, getOne, updateOne} from "./handlerFactory.js";
import Student from "../models/studentModel.js";
import catchAsync from "../utils/CatchAsync.js";

const getStudent = getOne(Student);
const createOneStudent = createOne(Student);
const updateStudent = updateOne(Student);
const deleteStudent = deleteOne(Student);

const getStudents = catchAsync(async (req, res) => {
    const students = await Student.find({
        ...req.query,
        organization: req.params.organization.toUpperCase(),
    });

    res.status(200).json({
        status: 'success',
        length: students.length,
        data: {
            students
        }
    })
});

export {createOneStudent, updateStudent, getStudent, deleteStudent, getStudents};