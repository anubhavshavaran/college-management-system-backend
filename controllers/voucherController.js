import {createOne, deleteOne, getAll, getOne, updateOne} from "./handlerFactory.js";
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
        query = {
            date
        }
    } else if (!date && start && end) {
        query = {
            date: {
                $gte: start,
                $lte: end,
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