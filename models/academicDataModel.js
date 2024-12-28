import mongoose from "mongoose";

const academicDataSchema = new mongoose.Schema({
    startingDate: {
        type: Date,
        required: true,
    },
    endingDate: {
        type: Date,
        required: true,
    },
    organization: {
        type: String,
        enum: ['SCHOOL', 'COLLEGE'],
        required: true
    }
});

const AcademicData = mongoose.model('AcademicData', academicDataSchema);
export default AcademicData;