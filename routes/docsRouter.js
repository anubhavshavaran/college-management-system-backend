import {Router} from "express";
import {createDoc, deleteDoc, getAllDocs, getDoc} from "../controllers/docsController.js";

const router = Router();

router.route('/:organization')
    .get(getAllDocs)
    .post(createDoc);

router.route('/:organization/:id')
    .get(getDoc)
    .delete(deleteDoc);

export default router;