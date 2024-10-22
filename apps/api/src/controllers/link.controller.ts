import { Request, Response } from 'express';
import { Link } from '../models/link.model';
import { getTokenInfo } from '../utils';

import { LinkService } from '../services/link.service';
import { User } from '../models/user.model';
import { Inventory } from '../models/item.model';

export class LinkController {

  static async createLink(req: Request, res: Response) {
    try {
      const { items, hiddenFields, customerIds, expiresAt } = req.body;
      const userId = getTokenInfo({ req })?.user?.userId;

      if (userId) {
        const newLink = await LinkService.createLink(userId, {
          items,
          hiddenFields,
          expiresAt,
          customerIds,
        });
        return res
          .status(201)
          .json({ message: 'Link created successfully', link: newLink });
      } else {
        return res.status(403).json({ message: 'Access denied' });
      }
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  // Get All Links for user
  static async getAllLinks(req: Request, res: Response) {
    try {
      const userId = getTokenInfo({ req })?.user?.userId;
      const isReceptionist = getTokenInfo({req})?.user?.role === "receptionist";
      
      const links = await LinkService.getAllLinks({ userId: isReceptionist ? userId : undefined });
      return res.status(200).json({ links });
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }
  // Get All Items for user
  static async getAllLinkItems(req: Request, res: Response) {
    try {
      const userId = getTokenInfo({ req })?.user?.userId;
      if (userId) {
        const items = await LinkService.getAllItemsInLink(userId);
        return res.status(200).json({ items });
      }
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }
  // Update Link
  static async updateLink(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const userId = getTokenInfo({ req })?.user?.userId;
      if (userId) {
        const link = LinkService.updateLink(id, userId, updateData);
        return res
          .status(200)
          .json({ message: 'Link updated successfully', link });
      } else {
        res.status(403).json({ message: 'Access Denied' });
      }
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }

  // Delete Link
  static async deleteLink(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const link = await Link.findById(id);

      const userId = getTokenInfo({ req })?.user?.userId;

      if (link != null) {
        if (userId != link.wholesaleId.toString()) {
          return res.status(200).json({ message: 'Access denied' });
        }
        await LinkService.deleteLink(id);
      } else {
        return res.status(404).json({ message: 'Link not found' });
      }

      return res.status(200).json({ message: 'Link deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }

  static async addItemToLink(req: Request, res: Response) {
    try {
      const { linkId, itemId } = req.body;
      const link = await Link.findById(linkId);
      const userId = getTokenInfo({ req })?.user?.userId;

      if (link != null) {
        if (userId != link.wholesaleId.toString()) {
          res.status(200).json({ message: 'Access denied' });
        }
        const updatedLink = await LinkService.addItemToLink(linkId, itemId);

        res.status(200).json({
          message: 'Item added successfully to link',
          link: updatedLink,
        });
      } else {
        return res.status(404).json({ message: 'Link not found' });
      }
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
  static async getItemsByLink(req: Request, res: Response) {
    
    try {
    
      const { id } = req.params;
      const userId = await getTokenInfo({ req })?.user?.userId;
      const user = await User.findById(userId)
      let items;
      if (user != null && user.role=="receptionist") {
        items = await LinkService.getItemsByLinkId(id,user);
      }
      else {
        
        items = await LinkService.getItemsByLinkId(id,user);
      }
      const link = await Link.findById(id).populate('wholesaleId','companyName email companyLogo phoneNumber -_id');
      if (link != null) {
        
        res.status(200).json({
          items,
          company:link.wholesaleId
        });
      } else {
        return res.status(404).json({ message: 'no items found' });
      }
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
  // Add Customer ID to Link
  static async addCustomerIdToLink(req: Request, res: Response) {
    try {
      const { linkId, customerId } = req.body;
      const link = await Link.findById(linkId);
      if (!link) {
        return res.status(404).json({ message: 'Link not found' });
      }
      const updatedLink = await LinkService.addCustomerIdToLink(
        linkId,
        customerId,
      );
      res.status(200).json({
        message: 'Customer ID added successfully to link',
        link: updatedLink,
      });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
}