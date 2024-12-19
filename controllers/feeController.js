import catchAsync from "../utils/CatchAsync.js";
import Fee from "../models/feeModel.js";

const createFee = catchAsync(async (req, res, next) => {
    const fee = await Fee.create({
        ...req.body,
    });

    res.status(201).json({
        status: "success",
        data: {
            fee
        }
    });
});

export {createFee};