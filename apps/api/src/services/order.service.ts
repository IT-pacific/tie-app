import { Link } from '../models/link.model';
import { IOrder, Order } from '../models/order.model';
import { Document, Types } from 'mongoose';
import { User } from '../models/user.model';
import path from "path"

import fs from 'fs'
export class OrderService {
  static async createOrder(orderData:any): Promise<IOrder> {
    try {
      const newOrder = new Order(orderData);
      await newOrder.save();
      return newOrder;
    } catch (error) {
      throw new Error(`Error creating order: ${(error as Error).message}`);
    }
  }
  static async getAllOrders(userId:string|undefined): Promise<any[]> {
    try {
      const link=await Link.find({wholesaleId:userId})
      let orders = await Order.find({link_id:{$in:link}}).sort({createdAt:-1}).populate('item_details.item retail_id');
     let newOrders = orders.map(order => {
        const orderObj = order.toObject(); 
        const itemDetails = orderObj.item_details.map(detail => ({             
           ...detail.item 
        }));
    
        
        return {
          ...orderObj,              
          item_details: itemDetails  
        };
      });
      return newOrders;
    } catch (error) {
      throw new Error(`Error retrieving orders: ${(error as Error).message}`);
    }
  }
  static async getOrderById(id:string,user:string|undefined): Promise<any|null> {
    try {
    
      const order = await Order.findById(id).populate('item_details.item');
      const link = await Link.findById(order?.link_id)
      const companyInfo=await User.findById(link?.wholesaleId)
      const currentUser=await User.findById(user)
   
      if (currentUser?.role == "receptionist") {
        return {order,
          companyInfo}; }
      
      if (currentUser && currentUser?.id != order?.retail_id.toString()) {
        throw new Error(`Access denied`)
      }
      return {order,
      companyInfo};
    } catch (error) {
      throw new Error(`Error retrieving orders: ${(error as Error).message}`);
    }
  }


 

 static async updateOrder(id:string, updateData: Partial<IOrder>): Promise<IOrder | null> {
   try {
    const order = await Order.findOne({id})
      const updatedOrder = await Order.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedOrder) throw new Error('Order not found');
      return updatedOrder;
    } catch (error) {
      throw new Error(`Error updating order: ${(error as Error).message}`);
    }
  }

  
  static async deleteOrder(orderId: Types.ObjectId): Promise<Document | null> {
    try {
      const deletedOrder = await Order.findByIdAndDelete(orderId);
      if (!deletedOrder) throw new Error('Order not found');
      return deletedOrder;
    } catch (error) {
      throw new Error(`Error deleting order: ${(error as Error).message}`);
    }
  }
}

