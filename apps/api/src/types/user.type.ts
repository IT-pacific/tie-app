import { JwtPayload } from 'jsonwebtoken';
import { Schema } from 'mongoose';


export interface TUser {
    _id?: Schema.Types.ObjectId;
    userId:string,
    email: string;
    username: string;
    password: string;
    companyName?: string; 
    businessCategory?: 'Health care products/services' | 'Construction Materials/Service' | 'Food, Beverage & Home Accessories' | 'Stationaries & School supplies' | 'Others';
    phoneNumber?: string; 
    role: 'receptionist' | 'operator';
    businessType?: 'wholesale' | 'retail' | null;
  }
  
export type TPayload = string | JwtPayload | null | undefined;
