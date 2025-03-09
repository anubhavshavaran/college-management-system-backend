import catchAsync from "../utils/CatchAsync.js";
import AppError from "../utils/appError.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const signToken = id => {
    return jwt.sign({id: id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
}

const signin = catchAsync(async (req, res, next) => {
    let {username, password, organization, role} = req.body;
    if (role === "CHAIRMAN") organization = "UNIVERSAL";

    if (!username || !password || !organization || !role) {
        return next(new AppError('Please provide a username, password, role and organization!', 401));
    }

    const user = await User.findOne({
        username,
        role,
        organization
    }).select('+password');

    if (!user || !(await user.comparePassword(password, user.password))) {
        return next(new AppError('Invalid username or password', 401));
    }

    createSendToken(user, 200, res);
});

const signup = catchAsync(async (req, res, next) => {
    const {username, role, password, organization, name} = req.body;

    if (!username || !password || !role || !organization || !name) {
        return next(new AppError('Please provide the required fields!', 401));
    }

    const newUser = await User.create({
        name,
        username,
        password,
        role,
        organization
    });

    createSendToken(newUser, 201, res);
});

export {signin, signup};