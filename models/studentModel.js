import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: String,
    organization: {
        type: String,
        enum: ['SCHOOL', 'COLLEGE'],
        required: true,
    },
    rollNumber: String,
    satsNumber: String,
    registrationNumber: String,
    class: String,
    section: Number,
    course: String,
    durationInYear: {
        type: Number
    },
    year: {
        type: String
    },
    expectedYearOfPassing: String,
    mothersName: String,
    fathersName: String,
    phoneNumber: String,
    phoneNumber2: String,
    dateOfBirth: {
        type: Date,
    },
    adhaarNumber: String,
    voterNumber: String,
    passportNumber: String,
    dateOfAdmission: {
        type: Date,
    },
    gender: {
        type: String,
        enum: ["male", "female"],
    },
    presentAddress: String,
    permanentAddress: String,
    city: String,
    state: String,
    pinCode: String,
    religion: String,
    caste: String,
    subCaste: String,
    category: {
        type: String,
        // enum: ["general", "obc", "sc", "st"],
    },
    categoryCertificateEnclosed: {
        type: String,
        enum: ["yes", "no"],
    },
    parentsIncome: String,
    inComeCertificateEnclosed: {
        type: String,
        enum: ["yes", "no"],
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
    }
});

const Student = mongoose.model("Student", studentSchema);
export default Student;