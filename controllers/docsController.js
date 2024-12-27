import {getAll, getOne} from "./handlerFactory.js";
import Docs from "../models/docsModel.js";
import catchAsync from "../utils/CatchAsync.js";
import AppError from "../utils/appError.js";
import {fileURLToPath} from "url";
import path from "path";
import * as fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getAllDocs = getAll(Docs);
const getDoc = getOne(Docs);

const deleteDoc = catchAsync(async (req, res, next) => {
    const doc = await Docs.findByIdAndDelete(req.params.id);

    if (!doc) {
        return next(new AppError('No document found with this ID', 404));
    }

    const filePath = path.join(__dirname, `../${doc.path}`);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return next(new AppError('Failed to delete file from the server', 500));
        }
    });

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

const createDoc = catchAsync(async (req, res, next) => {
    const {body: {title}, params: {organization}, file} = req;

    if (!file) {
        return next(new AppError('Please provide a file.', 400));
    }

    const fileName = file.originalname;
    const filePath = req.file.path;
    console.log(fileName, "///", filePath);

    const docs = await Docs.create({
        title,
        organization: organization.toUpperCase(),
        path: `/docs/${fileName}`,
    });

    res.status(201).json({
        status: "success",
        data: {
            docs
        },
    });
});

export {getAllDocs, createDoc, getDoc, deleteDoc}