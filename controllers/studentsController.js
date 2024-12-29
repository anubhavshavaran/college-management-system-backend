import {createOne, deleteOne, getOne, updateOne} from "./handlerFactory.js";
import Student from "../models/studentModel.js";
import catchAsync from "../utils/CatchAsync.js";

const getStudent = getOne(Student);
const createOneStudent = createOne(Student);
const updateStudent = updateOne(Student);
const deleteStudent = deleteOne(Student);

const getStudents = catchAsync(async (req, res) => {
    const { name, ...otherQueryParams } = req.query;
    const query = {
        ...otherQueryParams,
        organization: req.params.organization.toUpperCase(),
    };

    if (name) {
        query.name = { $regex: name, $options: "i" };
    }

    const students = await Student.find(query);

    let males = 0, females = 0;
    for (const student of students) {
        switch (student.gender) {
            case "male":
                males++;
                break;
            case "female":
                females++;
                break;
        }
    }

    res.status(200).json({
        status: 'success',
        length: students.length,
        data: {
            stats: {males, females},
            students
        }
    });
});

const updateStudentsFee = catchAsync(async (req, res) => {
    const {fixedFee} = req.body;
    const {organization} = req.params;

    await Student.updateMany({
        organization: organization.toUpperCase(),
        ...req.query
    }, {
        fixedFee: fixedFee
    });

    res.status(200).json({
        status: 'success',
    });
});

export {createOneStudent, updateStudent, getStudent, deleteStudent, getStudents, updateStudentsFee};