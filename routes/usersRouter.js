import {Router} from "express";
import {createUser, deleteUser, getAllUsers, getUser, updateUser} from "../controllers/usersController.js";

const router = Router();

router.route("/:organization")
    .get(getAllUsers)
    .post(createUser);

router.route("/:organization/:id")
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

export default router;