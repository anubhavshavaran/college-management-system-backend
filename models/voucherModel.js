import mongoose from "mongoose";
import AcademicData from "./academicDataModel.js";

const voucherSchema = new mongoose.Schema({
    voucherId: {
        type: String,
        required: true
    },
    voucherNumber: {
        type: String
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

    const academicYear = await AcademicData.findOne({ organization: voucher.organization });
    if (!academicYear) {
        return next(new Error("Academic year data not found for the organization."));
    }

    const { startingDate } = academicYear;
    const currentYear = startingDate.getFullYear();
    const financialYearStart = new Date(`${currentYear}-04-01`);
    const financialYearEnd = new Date(`${currentYear + 1}-03-31`);

    const lastVoucher = await mongoose.model("Voucher").findOne({
        organization: voucher.organization,
        date: { $gte: financialYearStart, $lte: financialYearEnd }
    }).sort({ voucherNumber: -1 });

    if (lastVoucher) {
        voucher.voucherNumber = (parseInt(lastVoucher.voucherNumber, 10) + 1).toString();
    } else {
        voucher.voucherNumber = "1";
    }

    next();
});

const Voucher = mongoose.model('Voucher', voucherSchema);
export default Voucher;