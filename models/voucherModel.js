import mongoose from "mongoose";
import AcademicData from "./academicDataModel.js";

const voucherSchema = new mongoose.Schema({
    voucherId: {
        type: String,
        required: true
    },
    voucherNumber: {
        type: Number
    },
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    modeOfPayment: {
        type: String,
        required: true
    },
    particulars: {
        type: String,
        required: true
    },
    organization: {
        type: String,
        enum: ['SCHOOL', 'COLLEGE'],
        required: true
    }
});

voucherSchema.pre("save", async function (next) {
    const voucher = this;

    // Get the current date
    const currentDate = voucher.date;
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const financialYearStart = new Date(`${currentMonth >= 4 ? currentYear : currentYear - 1}-04-01`);
    const financialYearEnd = new Date(`${currentMonth >= 4 ? currentYear + 1 : currentYear}-03-31`);

    const lastVoucher = await mongoose.model("Voucher").findOne({
        organization: voucher.organization,
        date: { $gte: financialYearStart, $lte: financialYearEnd }
    }).sort({ voucherNumber: -1 });

    if (lastVoucher) {
        console.log(lastVoucher.voucherNumber);
        voucher.voucherNumber = lastVoucher.voucherNumber + 1;
    } else {
        voucher.voucherNumber = "1";
    }

    next();
});


const Voucher = mongoose.model('Voucher', voucherSchema);
export default Voucher;