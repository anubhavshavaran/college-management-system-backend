import catchAsync from "../utils/CatchAsync.js";
import Payment from "../models/paymentModel.js";
import AppError from "../utils/appError.js";
import Student from "../models/studentModel.js";

const getPaymentsOfStudent = catchAsync(async (req, res) => {
    const payments = await Payment.find({
        studentId: req.params.id,
    });

    res.status(200).json({
        status: "success",
        data: {
            payments,
        },
    });
});

const createPayment = catchAsync(async (req, res) => {
    const payment = await Payment.create({
        ...req.body,
        studentId: req.params.id,
    });

    res.status(201).json({
        status: "success",
        data: {
            payment,
        }
    });
});

const getPaymentStats = catchAsync(async (req, res) => {
    const stats = await Payment.aggregate([
        {
            $lookup: {
                from: "students",
                localField: "studentId",
                foreignField: "_id",
                as: "studentDetails"
            }
        },
        {
            $unwind: "$studentDetails"
        },
        {
            $match: {
                "studentDetails.organization": req.params.organization.toUpperCase(),
                paidOn: {
                    $gte: new Date(`${req.params.year}-01-01T00:00:00.000Z`),
                    $lte: new Date(`${req.params.year}-12-31T23:59:59.999Z`)
                }
            }
        },
        {
            $group: {
                _id: { $month: "$paidOn" },
                totalAmount: { $sum: "$amount" }
            }
        },
        {
            $project: {
                month: "$_id",
                totalAmount: 1,
                _id: 0
            }
        },
        {
            $sort: { month: 1 }
        }
    ]);

    const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);
    const payments = allMonths.map(month => {
        const monthData = stats.find(result => result.month === month);
        return {
            month: new Date(req.params.year, month - 1).toLocaleString("default", { month: "long" }),
            totalAmount: monthData ? monthData.totalAmount : 0
        };
    });

    res.status(200).json({
        status: "success",
        data: {
            payments
        }
    });
});

const deletePayment = catchAsync(async (req, res, next) => {
    const doc = await Payment.findOneAndDelete({_id: req.params.id});

    if (!doc) {
        return next(new AppError("No document found with this ID", 404));
    }

    await Student.findByIdAndUpdate(
        doc.studentId,
        {
            $inc: {
                paidFee: -doc.amount
            },
        }
    );

    res.status(204).json({
        status: "success",
        data: null
    });
});

const getPayment = catchAsync(async (req, res, next) => {
    const payment = await Payment.findById(req.params.id).populate('studentId');

    if (!payment) {
        return next(new AppError("No document found with this ID", 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            payment,
        },
    });
});

export {getPaymentsOfStudent, createPayment, getPaymentStats, deletePayment, getPayment};