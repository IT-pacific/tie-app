import {  Notification } from "@/types";
import { PROTECTED_API } from "../axios";

export const getNotificationApi = async (): Promise<Notification[]> => {
  try {
    const response = await PROTECTED_API.get(`/notifications`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export const markAllAsReadApi = async (): Promise<void> => {
  try {
    const response = await PROTECTED_API.patch(`/notifications/read`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

