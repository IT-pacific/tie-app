import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order.model';
import { getTokenInfo } from '../utils';
import { Link } from '../models/link.model';
import { NotificationService } from '../services/notification.service';
import { User } from '../models/user.model';

export class OrderController {
  static async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const io = req.app.get('io');
      let user = await getTokenInfo({ req })?.user;
      const data = req.body;
      data.retail_id = user?.userId;
      const newOrder = await OrderService.createOrder(data);
      const link = await Link.findById(data.link);
      user = await User.findById(user?.userId);
      const wholeSaleNotification =
        await NotificationService.createNotification(
          link?.wholesaleId?.toString(),
          newOrder.id,
          `New Order from ${user?.companyName}`,
        );

      const notification = await NotificationService.createNotification(
        user?.userId,
        newOrder.id,
        `Order #${newOrder.order_id} successfully placed`,
      );

      io.to(user?.userId ? user?.userId : '').emit(
        'new_notification',
        notification,
      );
      io.to(
        link?.wholesaleId?.toString() ? link?.wholesaleId?.toString() : '',
      ).emit('new_notification', wholeSaleNotification);

      res.status(201).json(newOrder);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
  static async uploadPaymentProof(req: Request, res: Response) {
    try {
      const orderId = req.params.orderId;
      
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      //@ts-ignore
      order.paymentProof = req?.file?.filename;
      order.status = 'payment-pending';
      await order.save();

      return res
        .status(200)
        .json({ message: 'Payment proof uploaded successfully!' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  static async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      let user = await getTokenInfo({ req })?.user?.userId;
      const order = await OrderService.getOrderById(id, user);
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  static async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const userId = await getTokenInfo({ req })?.user?.userId;
      const user = await User.findById(userId);
      let orders;
      if (user?.role == 'operator') {
        orders = await Order.find({
          retail_id: userId,
          status: { $ne: 'cancelled' },
        })
          .sort({ createdAt: -1 })
          .populate('item_details.item retail_id');
        orders = orders.map(order => {
          const orderObj = order.toObject();
          const itemDetails = orderObj.item_details.map(detail => ({
            ...detail.item,
          }));
          return {
            ...orderObj,
            item_details: itemDetails,
          };
        });
      } else {
        orders = await OrderService.getAllOrders(userId);
      }
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  static async updateOrder(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const io = req.app.get('io');
      let user = await getTokenInfo({ req })?.user;

      const updatedOrder = await OrderService.updateOrder(id, req.body);
      const link=await Link.findById(updatedOrder?.link_id)
      const wholeSaleNotification =
      await NotificationService.createNotification(
        link?.wholesaleId?.toString(),
        updatedOrder?.id,
        ` Order #${updatedOrder?.id}  ${updatedOrder?.status=="rejected"?`was ${updatedOrder?.status}`:` ${updatedOrder?.status}`}`,
        );
      

    const notification = await NotificationService.createNotification(
      updatedOrder?.retail_id.toString(),
      updatedOrder?.id,
     `Your order #${updatedOrder?.order_id} ${updatedOrder?.status === 'rejected' || updatedOrder?.status === 'cancelled' ? `was ${updatedOrder?.status}` : `${updatedOrder?.status}`}`
    );

    io.to(user?.userId ? user?.userId : '').emit(
      'new_notification',
      notification,
    );
    io.to(
      link?.wholesaleId?.toString() ? link?.wholesaleId?.toString() : '',
    ).emit('new_notification', wholeSaleNotification);

      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(404).json({ message: (error as Error).message });
    }
  }
  static async updateOrderStatus(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const id = req.params.id;
      const userId = getTokenInfo({ req })?.user?.userId;
      const user = await User.findById(userId);
      //check whether the user updating order is authorized
      if (user?.role == 'operator') {
        let order = await Order.findById(id);
        if (order?.retail_id.toString() != userId) {
          return res
            .status(403)
            .json({ message: 'Not authorized to perform operation' });
        }
      }

      const allowedStatus = ['pending', 'confirmed', 'rejected', 'cancelled'];

      const status = req.body.status;

      if (!allowedStatus.includes(status.toLowerCase())) {
        return res
          .status(400)
          .json('Status should exist in pending,completed,rejected,cancelled');
      } else {
        if (user?.role == 'operator' && status.toLowercase == 'cancelled') {
          const updatedOrder = await OrderService.updateOrder(id, {
            status: status.toLowerCase(),
          });
          return res.status(200).json(updatedOrder);
        } else if (user?.role == 'receptionist') {
          const updatedOrder = await OrderService.updateOrder(id, {
            status: status.toLowerCase(),
          });
          return res.status(200).json(updatedOrder);
        } else {
          return res.status(403).json({ message: 'Not authorized' });
        }
      }
    } catch (error) {
      return res.status(404).json({ message: (error as Error).message });
    }
  }
}
