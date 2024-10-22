import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import userMiddleware from '../middlewares/user.middleware';
export const notification = Router();

notification.post('/new',userMiddleware.hasAllRoles(["operator","receptionist"]), NotificationController.createNotification);
notification.get('/',userMiddleware.hasAllRoles(["operator","receptionist"]), NotificationController.getAllNotifications);
notification.delete('/:id',userMiddleware.hasAllRoles(["operator","receptionist"]), NotificationController.deleteNotification)
notification.patch('/read',userMiddleware.hasAllRoles(["operator","receptionist"]),NotificationController.markAllNotificationsAsRead)