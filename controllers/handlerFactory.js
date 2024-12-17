import catchAsync from "../utils/CatchAsync.js";
import AppError from "../utils/appError.js";

const createOne = Model => catchAsync(async (req, res, next) => {
    const newDoc = await Model.create({
        ...req.body,
        organization: req.params.organization.toUpperCase(),
    });

    res.status(201).json({
        status: "success",
        data: {newDoc}
    });
});

const getAll = Model => catchAsync(async (req, res, next) => {
    const docs = await Model.find({
        organization: req.params.organization.toUpperCase(),
    });

    res.status(200).json({
        status: 'success',
        length: docs.length,
        data: {docs},
    });
});

const getOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
        return next(new AppError('No data found!', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {doc}
    });
});

const updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );

    res.status(200).json({
        status: 'success',
        data: {doc}
    });
});

const deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
        return next(new AppError("No document found with this ID", 404));
    }

    res.status(204).json({
        status: "success",
        data: null
    });
})

export {getOne, getAll, createOne, updateOne, deleteOne};