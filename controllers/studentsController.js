import {deleteOne, getOne, updateOne} from "./handlerFactory.js";
import Student from "../models/studentModel.js";
import catchAsync from "../utils/CatchAsync.js";
import AppError from "../utils/appError.js";

const getStudent = getOne(Student);
const updateStudent = updateOne(Student);
const deleteStudent = deleteOne(Student);

const createOneStudent = catchAsync(async (req, res, next) => {
    const {organization} = req.params;
    const {registrationNumber, satsNumber} = req.body;

    let query;
    if (organization === 'college') {
        query = {
            registrationNumber
        }
    } else {
        query = {
            satsNumber
        }
    }

    const user = await Student.findOne(query);

    if (user) {
        return res.status(500).json({
            error: 'duplicate',
            message: 'A student with this Registration/SATS number already exists!',
        });
    }

    const newDoc = await Student.create({
        ...req.body,
        organization: organization.toUpperCase(),
    });

    res.status(201).json({
        status: "success",
        data: {newDoc}
    });
});

const getStudents = catchAsync(async (req, res) => {
    const {name, ...otherQueryParams} = req.query;
    const query = {
        ...otherQueryParams,
        organization: req.params.organization.toUpperCase(),
    };

    if (name) {
        query.name = {$regex: name, $options: "i"};
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

const searchStudents = catchAsync(async (req, res) => {
    const {organization, searchQuery} = req.params;
    const {course, year} = req.query;

    if (!organization || !searchQuery) {
        return res.status(400).json({
            status: 'error',
            message: 'Organization and search query are required',
        });
    }
    if (!['college', 'school'].includes(organization.toLowerCase())) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid organization type. Must be "college" or "school"',
        });
    }

    const query = [
        {name: {$regex: searchQuery, $options: "i"}},
        {gender: {$regex: searchQuery, $options: "i"}},
        {phoneNumber: {$regex: searchQuery, $options: "i"}},
        {phoneNumber2: {$regex: searchQuery, $options: "i"}},
    ];

    let organizationParams;
    if (organization === 'college') {
        organizationParams = [
            {course: {$regex: searchQuery, $options: "i"}},
            {registrationNumber: {$regex: searchQuery, $options: "i"}}
        ];
    } else {
        organizationParams = [
            {class: {$regex: searchQuery, $options: "i"}},
            {satsNumber: {$regex: searchQuery, $options: "i"}}
        ];
    }

    query.push(...organizationParams);

    const andQuery = [
        {organization: organization.toUpperCase()},
        {
            $or: query
        }
    ];

    if (course) {
        if (organization === 'college') {
            andQuery.push({course});
        } else {
            andQuery.push({class: course});
        }
    }

    if (year) andQuery.push({year});

    const students = await Student.find({
        $and: andQuery
    });


    res.status(200).json({
        status: 'success',
        length: students.length,
        data: {
            students
        }
    });
});

const getStudentsYears = catchAsync(async (req, res) => {
    const {organization} = req.params;

    const years = await Student.find({...req.query, organization: organization}).select('expectedYearOfPassing');

    res.status(200).json({
        status: 'success',
        data: {
            years
        }
    });
});

export {createOneStudent, updateStudent, getStudent, deleteStudent, getStudents, updateStudentsFee, searchStudents, getStudentsYears};