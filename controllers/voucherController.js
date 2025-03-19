import {createOne, deleteOne, getOne, updateOne} from "./handlerFactory.js";
import Voucher from "../models/voucherModel.js";
import catchAsync from "../utils/CatchAsync.js";

const getVoucher = getOne(Voucher);
const createVoucher = createOne(Voucher);
const updateVoucher = updateOne(Voucher);
const deleteVoucher = deleteOne(Voucher);

const getAllVouchers = catchAsync(async (req, res) => {
    let query = {};

    const {start, end, date} = req.query;

    if (date && !start && !end) {
        const targetDate = new Date(date);

        const startOfDay = new Date(targetDate);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(targetDate);
        endOfDay.setUTCHours(23, 59, 59, 999);

        query = {
            date: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        };
    } else if (!date && start && end) {
        const startPeriod = new Date(start);
        startPeriod.setUTCHours(0, 0, 0, 0);

        const endPeriod = new Date(end);
        endPeriod.setUTCHours(23, 59, 59, 999);

        query = {
            date: {
                $gte: startPeriod,
                $lte: endPeriod,
            }
        }
    }

    const docs = await Voucher.find({
        ...query,
        organization: req.params.organization.toUpperCase(),
    });

    res.status(200).json({
        status: 'success',
        length: docs.length,
        data: {docs},
    });
});

export {getAllVouchers, getVoucher, createVoucher, updateVoucher, deleteVoucher};