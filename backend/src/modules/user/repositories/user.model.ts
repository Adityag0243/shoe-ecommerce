import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import mongoose, { Schema } from 'mongoose';

import { config } from '../../../config.js';

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        role: {
            type: String,
            enum: ['customer', 'admin'],
            default: 'customer',
        },
        refreshToken: {
            type: String,
            default: null,
        },
    },
    { timestamps: true },
);

userSchema.pre('save', async function (next) {
    if ((this as any).isModified('password')) {
        (this as any).password = await bcrypt.hash((this as any).password, 10);
        next();
    } else {
        return next();
    }
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, (this as any).password);
};

userSchema.methods.generateAccessToken = function () {
    return jsonwebtoken.sign(
        {
            _id: (this as any)._id,
            email: (this as any).email,
            fullName: (this as any).fullName,
        },
        config.accessTokenSecret as any,
        { expiresIn: config.accessTokenExpiry as any } as any,
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jsonwebtoken.sign(
        { _id: (this as any)._id },
        config.refreshTokenSecret as any,
        { expiresIn: config.refreshTokenExpiry as any } as any,
    );
};

export const User = mongoose.model('User', userSchema);
