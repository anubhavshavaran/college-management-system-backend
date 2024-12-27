import {Router} from "express";
import {createDoc, deleteDoc, getAllDocs, getDoc} from "../controllers/docsController.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../docs'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

router.route('/:organization')
    .get(getAllDocs);

router.route('/:organization').post(
    upload.single("file"),
    createDoc
);

router.route('/:organization/:id')
    .get(getDoc)
    .delete(deleteDoc);

export default router;