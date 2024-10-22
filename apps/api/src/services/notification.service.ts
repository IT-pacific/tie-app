import mongoose from 'mongoose';
import { Notification } from '../models/notification.model';

export class NotificationService {
  // Create a Notification
  static async createNotification(userId: string | undefined, orderId: string, message: string) {
    const notification = new Notification({ orderId, message });
    
    if (userId) {
      notification.userId =new mongoose.Types.ObjectId(userId);
    } else {
      notification.toAll = true;
    }
    
    await notification.save();
    return notification;
  }

  // Retrieve All Notifications
  static async getAllNotifications(userId?: string, read?: boolean) {
    const filter: any = {};
    let notifications;
    if (read) {
      notifications=await Notification.find({userId:userId,read:true})
    }
    notifications=await Notification.find({userId:userId})
    return notifications;
  }

  // Delete a Notification
  static async deleteNotification(id: string) {
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      throw new Error('Notification not found.');
    }
    
    return notification;
  }
}
