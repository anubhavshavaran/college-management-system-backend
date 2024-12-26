import mongoose from "mongoose";

const docsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    uploadedAt: {
        type: Date,
        default: Date.now(),
        required: true,
    },
    path: {
        type: String
    },
    organization: {
        type: String,
        enum: ['SCHOOL', 'COLLEGE'],
        required: true,
    }
});

const Docs = mongoose.model("Docs", docsSchema);
export default Docs;