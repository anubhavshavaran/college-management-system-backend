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
    const {username, password} = req.body;

    if (!username || !password) {
        return next(new AppError('Please provide an email and password!', 401));
    }

    const user = await User.findOne({
        username
    }).select('+password');

    if (!user || !await user.comparePassword(password, user.password)) {
        return next(new AppError('Invalid username or password', 401));
    }

    createSendToken(user, 200, res);
});

const signup = catchAsync(async (req, res, next) => {
    const {username, role, password} = req.body;
    const newUser = await User.create({
        username,
        password,
        role
    });

    createSendToken(newUser, 201, res);
});

export {signin, signup};