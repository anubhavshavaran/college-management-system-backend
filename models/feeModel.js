import mongoose, {Schema} from "mongoose";

const feeSchema = new mongoose.Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Student",
    },
    fixedFee: {
        type: Number,
        default: 0,
    },
    paidFee: {
        type: Number,
        default: 0,
    },
    previousFee: {
        type: Number,
        default: 0,
    },
    paidOn: {
        type: Date,
        required: true,
        default: Date.now(),
    }
});

const Fee = mongoose.model("Fee", feeSchema);
export default Fee;