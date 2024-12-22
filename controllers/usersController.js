import {createOne, deleteOne, getOne, updateOne} from "./handlerFactory.js";
import User from "../models/userModel.js";
import catchAsync from "../utils/CatchAsync.js";

const getUser = getOne(User);
const createUser = createOne(User);
const updateUser = updateOne(User);
const getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find({
        $or: [
            {
                organization: req.params.organization.toUpperCase(),
            },
            {
                organization: 'UNIVERSAL',
            }
        ]
    });
    const stats = await User.aggregate([
        {
            $match: {
                $or: [
                    {
                        organization: req.params.organization.toUpperCase(),
                    },
                    {
                        organization: 'UNIVERSAL',
                    }
                ]
            }
        },
        {
            $group: {
                _id: "$role",
                count: {$sum: 1},
            }
        },
        {
            $project: {
                _id: 0,
                role: "$_id",
                count: 1
            },
        },
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            users,
            stats
        }
    });
});
const deleteUser = deleteOne(User);

export {getAllUsers, createUser, updateUser, deleteUser, getUser};