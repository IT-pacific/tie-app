import bcrypt from 'bcrypt';
import { User } from '../models/user.model';
import { BadRequestError } from '../errors/bad-request.error';
import admin from "firebase-admin";
import { OAuth2Client } from 'google-auth-library';

const serviceAccount = require('../tie-app.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
    const client = new OAuth2Client(process.env.CLIENT_ID);
export class AuthService {

    static async register(userData: any) {
        const { email, username, password, companyName, businessCategory, phoneNumber, role,companyLogo } = userData;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Set default business category if not provided
        const selectedCategory = businessCategory || 'Health care products/services';

        const user = new User({
            email,
            username,
            password: hashedPassword,
            companyName,
            businessCategory: selectedCategory,
            phoneNumber,
            role,
            businessType: role === 'receptionist' ? 'wholesale' : 'retail',
            companyLogo:companyLogo?companyLogo:''
        });

        // Save new user
        await user.save();

        return user;
    }

    static async login(email: string, password: string) {
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid credentials');
        }

        return user;
    }
    static async getUserInfo(userId:any){
        const user = await User.findById(userId)
        if(!user) throw new Error('User not found');

        return user;
    }
    static async updateProfile(userId: string|undefined, updateData: any) {
        const { email, username, password, companyName, businessCategory, phoneNumber, companyLogo } = updateData;
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new BadRequestError('Email is already in use by another account.');
            }
            user.email = email;
        }
        if (username) user.username = username;
        if (companyName) user.companyName = companyName;
        if (businessCategory) user.businessCategory = businessCategory;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (companyLogo) user.companyLogo = companyLogo;
        await user.save();

        return user;
    }
    static async updatePassword(userId: string|undefined, prevPassword: string, newPassword: string) {
        
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const isPasswordValid = await bcrypt.compare(prevPassword, user.password);
        if (!isPasswordValid) {
            throw new BadRequestError('Incorrect current password');
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        return user;
    }
    static async googleLogin(idToken: string) {
        const ticket = await client.verifyIdToken({
          idToken,
          audience: process.env.CLIENT_ID, 
        });
    
        const payload = ticket.getPayload();
        if (!payload) {
          throw new BadRequestError('Invalid Google token');
        }
    
        const { sub: googleUserId, email, name, picture } = payload;
        let userRecord;
        try {
          userRecord = await admin.auth().getUserByEmail(email!);
        } catch (error) {
       
          userRecord = await admin.auth().createUser({
            uid: googleUserId,
            email: email!,
            displayName: name,
            photoURL: picture,
          });
        }
        const customToken = await admin.auth().createCustomToken(userRecord.uid);
    
        return {
          customToken,
          user: {
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName,
            photoURL: userRecord.photoURL,
          },
        };
      }
}
