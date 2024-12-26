import mongoose, {Schema} from "mongoose";

const paymentSchema = new mongoose.Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    transactionId: {
        type: String,
    },
    amount: {
        type: Number,
        required: true
    },
    paidOn: {
        type: Date,
        default: Date.now()
    },
    mode: {
        type: String,
        required: true
    },
    particulars: {
        type: String,
    }
});

paymentSchema.pre("save", async function (next) {
    this.transactionId = `${new Date().getFullYear()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    next();
});

paymentSchema.post("save", async function (doc, next) {
    try {
        const Student = mongoose.model("Student");

        await Student.findByIdAndUpdate(
            doc.studentId,
            {
                $inc: {
                    paidFee: doc.amount,
                },
            },
            { new: true }
        );

        next();
    } catch (err) {
        next(err);
    }
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;