import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { JwtService } from '../services/jwt.service';

import { getTokenInfo } from '../utils';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const {
        email,
        username,
        password,
        companyName,
        businessCategory,
        phoneNumber,
        role,
      } = req.body;
      const companyLogo = req?.file?.filename;
      const user = await AuthService.register({
        email,
        username,
        password,
        companyName,
        businessCategory,
        phoneNumber,
        role,
        companyLogo
      });

      const accessToken = JwtService.sign({ userId: user._id }, 'access');
      const refreshToken = JwtService.sign({ userId: user._id }, 'refresh');

      res.status(201).json({
        user: { username: user.username, email: user.email, role: user.role },
        message: 'User registered successfully',
        accessToken,
        refreshToken,
      });
    } catch (error:any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await AuthService.login(email, password);
      const accessToken = JwtService.sign({ userId: user._id }, 'access');
      const refreshToken = JwtService.sign({ userId: user._id }, 'refresh');

      res.status(200).json({
        user: { username: user.username, email: user.email, role: user.role },
        message: 'Login successful',
        accessToken,
        refreshToken,
      });
    } catch (error:any) {
      res.status(401).json({ message: error.message });
    }
  }

  static async refreshToken(req: Request, res: Response) {
    const { token } = req.body;

    const validToken = JwtService.verify(token, 'refresh');
    if (
      typeof validToken === 'object' &&
      validToken !== null &&
      'userId' in validToken
    ) {
      const newAccessToken = JwtService.sign(
        { userId: validToken.userId },
        'access',
      );
      return res.status(200).json({ accessToken: newAccessToken });
    }
    return res.status(401).json({ message: 'Invalid refresh Token' });
  }

  static async whoami(req: Request, res: Response) {
    try {
      const token = getTokenInfo({req})
      
        const user = await AuthService.getUserInfo(token?.user?.userId);
        if (user) {
          // Return user information
          return res.status(200).json({
            user: { user_id:user.id,username: user.username, email: user.email, role: user.role },
          });
        }
        return res.status(404).json({ message: 'User not found' });
      }
      catch(error:any){
        res.status(500).json({ message: error.message });
      }
  }
  static async updateProfile(req: Request, res: Response) {
    try {
      const userId=getTokenInfo({req})?.user?.userId
      const { username, companyName, businessCategory, phoneNumber } = req.body;
      const companyLogo = req?.file?.filename;
      const updatedUser = await AuthService.updateProfile(userId, {
        username,
        companyName,
        businessCategory,
        phoneNumber,
        companyLogo,
      });
  
      res.status(200).json({
        user: { 
          username: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role,
          companyName: updatedUser.companyName,
          businessCategory: updatedUser.businessCategory,
          phoneNumber: updatedUser.phoneNumber,
          companyLogo: updatedUser.companyLogo,
        },
        message: 'Profile updated successfully',
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  static async changePassword(req: Request, res: Response) {
    try {
      const userId = getTokenInfo({req})?.user?.userId; 
      const { prevPassword, newPassword } = req.body;
  
      await AuthService.updatePassword(userId, prevPassword, newPassword);
  
      res.status(200).json({
        message: 'Password changed successfully',
      });
    } catch (error: any) {
      console.log(error)
      res.status(400).json({ message: error.message });
    }
  }
  static async googleLogin(req: Request, res: Response) {
    try {
      const { idToken } = req.body; 
      const response = await AuthService.googleLogin(idToken)
      res.status(201).json(response)
    } catch (error) {
      res.status(400).json({ message:error instanceof Error? error.message:"Something went wrong" })
    }
  }
}
