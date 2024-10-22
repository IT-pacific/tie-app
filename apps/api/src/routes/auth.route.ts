import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import upload from '../middlewares/upload.middleware';
import userMiddleware from '../middlewares/user.middleware';
export const user = Router();
// Register a new user
user.post('/register',upload.single("companyLogo"), AuthController.register);
// User login
user.post('/login', AuthController.login);
// Refresh token
user.post('/refresh-token', AuthController.refreshToken);
// who am I
user.get("/whoami", AuthController.whoami)
//update profile
user.post("/profile/update", userMiddleware.hasAllRoles(["operator", "receptionist"]),upload.single("companyLogo"), AuthController.updateProfile)
//update password
user.post("/profile/change-password", userMiddleware.hasAllRoles(["operator", "receptionist"]), AuthController.changePassword)
//Google login
user.post("/login/google",AuthController.googleLogin)
