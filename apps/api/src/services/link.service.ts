import { Link } from '../models/link.model';

import mongoose from 'mongoose';
import { getTokenInfo } from '../utils';
import { Inventory } from '../models/item.model';
import { populate } from 'dotenv';
import { User } from '../models/user.model';
import { log } from 'node:console';

export class LinkService {
  static async createLink(userId: string, linkData: any) {
    let newLink = new Link();
    const { items, hiddenFields, customerIds, expiresAt } = linkData;

    if (items && items.length > 0) {
      newLink.items = items;
      newLink.allItems=false
    } else {
      newLink.allItems = true;
    }
    if (customerIds) {
      newLink.customerIds = customerIds;
    }
    if (hiddenFields) {
      newLink.hiddenFields = hiddenFields;
    }
    newLink.expiresAt = expiresAt;
    newLink.wholesaleId = new mongoose.Types.ObjectId(userId);

    await newLink.save();
    return newLink;
  }

  static async getItemsByLinkId(linkId: string,user:any) {
    try {
      
      if (user != null && user.role == "receptionist") {
        
        const link = await Link.findById(linkId).populate('wholeSaleId items');
       
        if (!link) {
          throw new Error('Link not found');
        }
        if (link.allItems) {
          const items = await Inventory.find({ wholeSaleId: link.wholesaleId });
          return items;
        } else {
          return link.items;
        }
      }
      else {
       
        const link = await Link.findById(linkId);
        if (!link) {
          throw new Error('Link not found');
        }
        if (link.allItems) {
          const items = await Inventory.find({ wholeSaleId: link?.wholesaleId })
          .populate({ path: "wholeSaleId", strictPopulate: false }).select(`${link?.hiddenFields?.length>0?`-${link?.hiddenFields.join(" -")}`:"name quantity unitPrice description wholeSaleId expirationDate"}`);

          return items;
        } else {
          
          const populatedLink = (await link?.populate('items',`${link?.hiddenFields?.length>0?`-${link?.hiddenFields.join(" -")}`:"name quantity unitPrice description wholeSaleId expirationDate"}`)).populate('wholesaleId')
          return (await populatedLink).items;
        }
      }
      

    } catch (error) {
     
      throw new Error(error instanceof Error?error.message:"Something went wrong ");
    }
  }
  //Get allItemsInLink
  static async getAllItemsInLink(userId: string | undefined) {
    try {
      const links = await Link.find({
        $or: [{ customerIds: userId }, { allItems: true }],
      }).populate('items');
     
      const itemPromises = links.map(async link => {
        if (link.allItems) {
          return await Inventory.find({ wholeSaleId: link.wholesaleId });
        } else {
          return link.items;
        }
      });
      const items = (await Promise.all(itemPromises)).flat();
      return items;
    } catch (error) {
      throw new Error(error instanceof Error?error.message:"Something went wrong ");
    }
  }

  // wholesale
  static async getAllLinks({ userId }: { userId?: string }) {
    if (userId) {
      return await Link.find({ wholesaleId: userId });
    }
    return await Link.find();
  }

  static async updateLink(id: string, userId: string, updateData: any) {
    const link = await Link.findById(id);

    if (userId !== link?.wholesaleId.toString()) {
      throw new Error('Access denied');
    }

    const updatedLink = await Link.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedLink) {
      throw new Error('Link not found');
    }
    return updatedLink;
  }

  static async deleteLink(id: string) {
    const link = await Link.findById(id);

    if (!link) {
      throw new Error('Link not found');
    }
    await Link.findByIdAndDelete(id);
  }

  static async addItemToLink(linkId: string, itemId: string) {
    const link = await Link.findById(linkId);

    if (link) {
      link.items = link.items || [];
      if (!link.items.includes(new mongoose.Types.ObjectId(itemId))) {
        link.items.push(new mongoose.Types.ObjectId(itemId));
      }
      await link.save();
      return link;
    }
  }

  static async addCustomerIdToLink(linkId: string, customerId: string) {
    const link = await Link.findById(linkId);
    if (!link) {
      throw new Error('Link not found');
    }
    link.customerIds = link.customerIds || [];
    if (!link.customerIds.includes(new mongoose.Types.ObjectId(customerId))) {
      link.customerIds.push(new mongoose.Types.ObjectId(customerId));
    }
    await link.save();
    return link;
  }
}
