import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },
    role: {
        type: String,
        enum: ['CHAIRMAN', 'ACCOUNTANT', 'ADMIN'],
        default: 'ACCOUNTANT',
    },
    organization: {
        type: String,
        enum: ['UNIVERSAL', 'SCHOOL', 'COLLEGE'],
        default: 'UNIVERSAL',
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    if (update.password) {
        update.password = await bcrypt.hash(update.password, 12);
    }
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model('User', userSchema);
export default User;