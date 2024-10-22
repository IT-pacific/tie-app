import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';
import { getTokenInfo } from '../utils';
import { Notification } from '../models/notification.model';

export class NotificationController {
  // Create a Notification
  static async createNotification(req: Request, res: Response) {
    try {
      const userId=getTokenInfo({req})?.user?.userId
      const {orderId, message } = req.body;
      const notification = await NotificationService.createNotification(userId, orderId, message);
      return res.status(201).json(notification);
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }
  // Retrieve All Notifications
  static async getAllNotifications(req: Request, res: Response) {
    try {
      const userId = getTokenInfo({ req })?.user?.userId
      if (userId) {
        const { read } = req.query;
      const readValue = read ? read === 'true' : undefined;
        const notifications = await NotificationService.getAllNotifications(userId as string, readValue);
         
      return res.status(200).json(notifications);
      }
      else {
        res.status(403).json({message:"Login to continue"})
      }

     
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
  
  // Delete a Notification
  static async deleteNotification(req: Request, res: Response) {
    
    try {
      const userId = getTokenInfo({ req })?.user?.userId
      if (userId) {
        await NotificationService.deleteNotification(req.params.id);
      return res.status(200).json({ message: 'Notification deleted successfully.' });
      }
      else {
        res.status(403).json({message:"Access denied"})
      }
      
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
  static async markAllNotificationsAsRead (req:Request, res:Response) {
    try {
      
      const userId = getTokenInfo({req})?.user?.userId;
  
     
      await Notification.updateMany(
        { userId: userId, read: false },
        { $set: { read: true } }
      );
  
      res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error marking notifications as read", error });
    }
  };
}
