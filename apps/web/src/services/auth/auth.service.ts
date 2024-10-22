import { User } from "@/types";
import { PROTECTED_API, PUBLIC_API } from "../axios";
import { AxiosErrorHandler, CustomError } from "@/utils/response";

// RegisterUser Service
export const RegisterUser = async (
  userData: Partial<User>
): Promise<{ accessToken: string; message: string; refreshToken: string; user: Partial<User> }> => {
  try {
    const request = await PUBLIC_API.post("/user/register",
      
      {
      email: userData.email,
      username: userData.username,
      password: userData.password,
        companyName: userData.companyName,
      companyLogo:userData.companyLogo,
      businessCategory: userData.category,
      phoneNumber: userData.phone,
      role: userData.role,
      }, {
        headers: {
        "Content-Type":"multipart/form-data"
      }
    });
    return request.data; 
  } catch (error: any) {
    throw new CustomError(AxiosErrorHandler(error));  
  }
};

// Login Service
export const Login = async (
  userData: Partial<User>
): Promise<{ accessToken: string; message: string; refreshToken: string; user: Partial<User> }> => {
  try {
    const request = await PUBLIC_API.post("/user/login", {
      email: userData.email,
      password: userData.password,
    });
    return request.data;  // Return the successful response
  } catch (error: any) {
    throw new CustomError(AxiosErrorHandler(error));  // Throw an error for handling in the thunk
  }
};

// WhoAmI Service
export const whoami = async (): Promise<{ user: Partial<User> }> => {
  try {
    const request = await PROTECTED_API.get("/user/whoami");
    return request.data;  // Return the successful response
  } catch (error: any) {
    throw new CustomError(AxiosErrorHandler(error));  // Throw an error for handling in the thunk
  }
};

