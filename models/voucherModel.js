import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema({
    voucherId: {
        type: String,
        required: true
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

const Voucher = mongoose.model('Voucher', voucherSchema);
export default Voucher;