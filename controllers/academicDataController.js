import catchAsync from "../utils/CatchAsync.js";
import AcademicData from "../models/academicDataModel.js";

const getAcademicData = catchAsync(async (req, res) => {
    const data = await AcademicData.findOne({
        organization: req.params.organization.toUpperCase(),
    });

    res.status(200).json({
        status: 'success',
        data
    });
});

const updateAcademicData = catchAsync(async (req, res) => {
    const data = await AcademicData.updateOne({
        organization: req.params.organization.toUpperCase(),
    }, {
        ...req.body,
    });

    res.status(200).json({
        status: 'success',
        data
    });
});

const createAcademicData = catchAsync(async (req, res) => {
    const data = await AcademicData.create({
        ...req.body,
        organization: req.params.organization.toUpperCase(),
    })

    res.status(201).json({
        status: 'success',
        data
    });
});

export {
    getAcademicData,
    updateAcademicData,
    createAcademicData
}