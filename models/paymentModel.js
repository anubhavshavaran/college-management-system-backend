import mongoose, {Schema} from "mongoose";
import Student from "./studentModel.js";

const paymentSchema = new mongoose.Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    transactionId: {
        type: Number,
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
    try {
        const payment = this;

        const currentDate = payment.paidOn || new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        const financialYearStart = new Date(`${currentMonth >= 4 ? currentYear : currentYear - 1}-04-01T00:00:00.000Z`);
        const financialYearEnd = new Date(`${currentMonth >= 4 ? currentYear + 1 : currentYear}-03-31T23:59:59.999Z`);

        const lastPayment = await mongoose.model("Payment").findOne({
            paidOn: { $gte: financialYearStart, $lte: financialYearEnd }
        }).sort({ transactionId: -1 });

        if (lastPayment) {
            payment.transactionId = lastPayment.transactionId + 1;
        } else {
            payment.transactionId = 1;
        }

        next();
    } catch (error) {
        next(error);
    }
});

paymentSchema.post("save", async function (doc, next) {
    try {
        const student = await Student.findById(doc.studentId);

        if (!student) {
            return next(new Error("Student not found"));
        }

        if (student.previousFee > 0) {
            const remainingPreviousFee = student.previousFee - doc.amount;

            if (remainingPreviousFee >= 0) {
                await Student.findByIdAndUpdate(doc.studentId, {
                    $set: {
                        previousFee: remainingPreviousFee,
                    },
                });
            } else {
                await Student.findByIdAndUpdate(doc.studentId, {
                    $set: {
                        previousFee: 0,
                        paidFee: student.paidFee + Math.abs(remainingPreviousFee),
                    },
                });
            }
        } else {
            await Student.findByIdAndUpdate(doc.studentId, {
                $set: {
                    paidFee: student.paidFee + doc.amount,
                },
            });
        }

        next();
    } catch (error) {
        next(error);
    }
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;