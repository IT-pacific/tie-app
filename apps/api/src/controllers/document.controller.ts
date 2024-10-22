import { Request, Response } from "express";
import { DocumentService } from "../services/document.service";
import { getTokenInfo } from "../utils";
import mongoose, { isValidObjectId } from "mongoose";
import { Inventory } from "../models/item.model";
import { Link } from "../models/link.model";
import { User } from "../models/user.model";
import { OrderService } from "../services/order.service";
import { NotificationService } from "../services/notification.service";
import { generateRandomNumber } from "../utils/document.utils";
import { IItemDetail, IOrder } from "../models/order.model";

export class DocumentController{
  static async saveDocument (req: Request, res: Response){
    const { id, sheets } = req.body;
    const user = getTokenInfo({ req })?.user?.userId
  
    try {
      const document = await DocumentService.saveDocumentWithSheets(id, sheets,user);
      res.status(200).json({ message: "Document saved or updated successfully!", document });
    } catch (error) {
      console.error("Error saving document:", error);
      res.status(500).json({ message: "Failed to save or update document." });
    }
  };
  static async getAllDocumentByUser(req: Request, res: Response) {
    try {
      const user = getTokenInfo({ req })?.user?.userId;
      const allDocuments = await DocumentService.getAllDocuments(user)
      res.send({
        documents:allDocuments
      })
    } catch (error) {
      res.status(500).json({message: error instanceof Error?error.message:"Something went wrong"})
    }
    
    
  }
  static async getDocumentById(req: Request, res: Response) {
    try {
      const id = req.params.id
      if (isValidObjectId(id)) {
        const user = getTokenInfo({ req })?.user?.userId;
      const allDocuments = await DocumentService.getDocumentById(user,id)
      res.send({
        document:allDocuments
      })
      }
      else {
        res.status(400).send({message:"Invalid document identifier"})
      }
      
    } catch (error) {
      res.status(500).json({message: error instanceof Error?error.message:"Something went wrong"})
    }
    
    
  }

  static async convertDocumentToLink(req: Request, res: Response) {
    try {
      const io = req.app.get('io');
      const id = req.params.id;
      const user = getTokenInfo({ req })?.user?.userId;
  
      const allItems: { [key: string]: any }[] = await DocumentService.generateLink(user, id) || [];
      const createdItems = [];
  
      for (const item of allItems) {
        const newItem = new Inventory({
          name: item["itemName"],
          quantity: item.quantity ? item.quantity : 0,
          description: item.description ? item.description : "",
          expirationDate: item.expirationDate ? new Date(item.expirationDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          isCustomerGenerated: true
        });
  
        const savedItem = await newItem.save();
        createdItems.push(savedItem);
      }
  
      const link = new Link();
      link.items = createdItems.map((item) => item.id);
      link.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  
      const firstWholesale = await User.findOne({ role: "receptionist" })
        .sort({ createdAt: 1 })
        .exec();
        
      link.wholesaleId = firstWholesale ? firstWholesale.id : null;
      link.allItems = false;
  
      const savedUser = await User.findById(user);
      if (savedUser) {
        link.customerIds = [new mongoose.Types.ObjectId(savedUser._id)];
      }
  console.log(allItems)
      const orderData = {
        order_id: 'order' + generateRandomNumber(),
        retail_id: savedUser?.id,
        link_id: link.id,
        generatedBy: savedUser?.id,
        item_details:
          createdItems.map((item) => ({
          item: item._id, 
          quantity: item.quantity,
          unitPrice: item.unitPrice || 0 
        })),
        status: "pending",
      };
      const newOrder = await OrderService.createOrder(orderData);
  
      const wholeSaleNotification =
        await NotificationService.createNotification(
          link?.wholesaleId?.toString(),
          newOrder.id,
          `New Order from ${savedUser?.companyName}`,
        );
  
      const notification = await NotificationService.createNotification(
        savedUser?._id.toString(),
        newOrder.id,
        `Order #${newOrder.order_id} successfully placed`,
      );
  
      // Emit notifications
      if (savedUser?._id) {
        io.to(savedUser._id.toString()).emit('new_notification', notification);
      }
  
      if (link?.wholesaleId) {
        io.to(link.wholesaleId.toString()).emit('new_notification', wholeSaleNotification);
      }
  
      await link.save();
      res.status(200).json(newOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Something went wrong" });
    }
  }
  
  

}


