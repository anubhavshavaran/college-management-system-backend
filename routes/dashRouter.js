import {Router} from "express";
import {getDashData} from "../controllers/dashController.js";
import {createAcademicData, getAcademicData, updateAcademicData} from "../controllers/academicDataController.js";

const router = Router();

router.route("/:organization").get(getDashData);

router.route("/:organization/stats")
    .get(getAcademicData)
    .post(createAcademicData)
    .patch(updateAcademicData);

export default router;