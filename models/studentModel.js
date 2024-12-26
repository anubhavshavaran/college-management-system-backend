import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: String,
    organization: {
        type: String,
        enum: ['SCHOOL', 'COLLEGE'],
        required: true,
    },
    rollNumber: String,
    class: String, // Only for the school
    section: Number, // Only for the school
    course: String, // Only for the college
    semester: { // Only for the college
        type: Number,
        min: 1,
        max: 8,
        default: 1,
    },
    expectedYearOfPassing: String, // Only for the college
    mothersName: String,
    fathersName: String,
    phoneNumber: String,
    dateOfBirth: {
        type: Date,
    },
    adhaarNumber: String,
    voterNumber: String,
    passportNumber: String,
    admissionNumber: String,
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
        enum: ["general", "obc", "sc", "st"],
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