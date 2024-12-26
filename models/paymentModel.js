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

paymentSchema.pre("save", async function (next) {
    this.transactionId = `${new Date().getFullYear()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    next();
});

paymentSchema.post("save", async function (doc, next) {
    try {
        // Find the student by studentId
        const student = await Student.findById(doc.studentId);

        if (!student) {
            return next(new Error("Student not found"));
        }

        // If there is any previousFee, first deduct it from the payment
        if (student.previousFee > 0) {
            const remainingPreviousFee = student.previousFee - doc.amount;

            if (remainingPreviousFee >= 0) {
                // Update the previousFee
                await Student.findByIdAndUpdate(doc.studentId, {
                    $set: {
                        previousFee: remainingPreviousFee,
                    },
                });
            } else {
                // If the previousFee is less than the amount, we clear previousFee and increment paidFee
                await Student.findByIdAndUpdate(doc.studentId, {
                    $set: {
                        previousFee: 0,
                        paidFee: student.paidFee + Math.abs(remainingPreviousFee), // Add the remaining to paidFee
                    },
                });
            }
        } else {
            // If no previousFee, just increase paidFee
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