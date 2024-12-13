import {createOne, deleteOne, getAll, getOne, updateOne} from "./handlerFactory.js";
import Voucher from "../models/voucherModel.js";

const getAllVouchers = getAll(Voucher);
const getVoucher = getOne(Voucher);
const createVoucher = createOne(Voucher);
const updateVoucher = updateOne(Voucher);
const deleteVoucher = deleteOne(Voucher);

export {getAllVouchers, getVoucher, createVoucher, updateVoucher, deleteVoucher};