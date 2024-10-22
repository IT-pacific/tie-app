import { Request, Response } from 'express';

import { InventoryService } from '../services/inventory.service';
import { getTokenInfo } from '../utils';
import { Inventory } from '../models/item.model';

export class InventoryController {
  static async addItem(req: Request, res: Response) {
    try {
      const { name, quantity, unitPrice, expirationDate, description } =
        req.body;
      const user = getTokenInfo({ req })?.user;

      const item = await InventoryService.addItemToInventory({
        name,
        quantity,
        unitPrice,
        expirationDate,
        description,
        wholeSaleId: user?.userId,
      });

      res.status(201).json({
        message: 'Inventory added successfully',
        item,
      });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
  static async addManyItems(req: Request, res: Response) {
    try {
      const {items} =
        req.body;
  
      const user = getTokenInfo({ req })?.user;

      const savedItem = await InventoryService.addManyItemToInventory(items,user?.userId);

      res.status(201).json({
        message: 'Inventory added successfully',
        item:savedItem,
      });
    } catch (error) {
      
      res.status(400).json({ message: error });
    }
  }
  static async deleteItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = getTokenInfo({ req })?.user;
      const itemToDelete = await Inventory.findById(id);
      if (itemToDelete?.wholeSaleId == user?.userId) {
        await InventoryService.deleteItemInInventory(id);
        res.status(201).json({
          message: 'Item in inventory Deleted successfully',
        });
      } else {
        res.status(403).send({ error: 'Access Denied' });
      }
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
  static async updateItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dataToBeUpdated = req.body;
      const user = getTokenInfo({ req })?.user;
      const itemToUpdate = await Inventory.findById(id);
      if (itemToUpdate?.wholeSaleId == user?.userId) {
        const items = await InventoryService.updateItemInInventory(
          id,
          dataToBeUpdated,
        );
        res.status(200).json({
          message: 'Successfully updated item  inventory',
          items,
        });
      } else {
        res.status(403).send({ error: 'Access Denied' });
      }
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
  static async getAllItems(req: Request, res: Response) {
    try {
      const user = getTokenInfo({ req })?.user;
      const items = await InventoryService.getAllItemInventory(user);
      res.status(200).json({
        message: 'Successfully retrieved inventory',
        items,
      });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
}
