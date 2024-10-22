import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    companyName: { type: String },
    companyLogo: {
        type:String
    },
    businessCategory: { type: String, enum: ['Health care products/services', 'Construction Materials/Service', 'Food, Beverage & Home Accessories', 'Stationaries & School supplies', 'Others'], default: 'Health care products/services' },
    phoneNumber: { type: String },
    role: { type: String, enum: ['receptionist', 'operator'], required: true },
    businessType: { type: String, enum: ['wholesale', 'retail'], default: null }
});

export const User = model('User', userSchema);
