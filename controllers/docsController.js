import {createOne, deleteOne, getAll, getOne} from "./handlerFactory.js";
import Docs from "../models/docsModel.js";

const getAllDocs = getAll(Docs);
const getDoc = getOne(Docs);
const createDoc = createOne(Docs);
const deleteDoc = deleteOne(Docs);

export {getAllDocs, createDoc, getDoc, deleteDoc}