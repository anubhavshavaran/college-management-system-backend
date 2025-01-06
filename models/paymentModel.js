import mongoose, {Schema} from "mongoose";
import Student from "./studentModel.js";

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

function getFinancialYearStart(date = new Date()) {
    const year = date.getMonth() < 3 ? date.getFullYear() - 1 : date.getFullYear();
    return new Date(`${year}-04-01T00:00:00.000Z`);
}

paymentSchema.pre("save", async function (next) {
    try {
        const student = await mongoose.model("Student").findById(this.studentId);

        if (!student) {
            return next(new Error("Student not found"));
        }

        const financialYearStart = getFinancialYearStart();

        const lastPayment = await mongoose
            .model("Payment")
            .findOne({
                studentId: { $in: await mongoose.model("Student").distinct("_id", { organization: student.organization }) },
                paidOn: { $gte: financialYearStart },
            })
            .sort({ paidOn: -1, _id: -1 });

        if (lastPayment) {
            const lastTransactionNumber = parseInt(lastPayment.transactionId, 10) || 0;
            this.transactionId = lastTransactionNumber + 1;
        } else {
            this.transactionId = 1;
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