import { Inventory } from '../models/item.model';
import { TUser } from '../types';

export class InventoryService {
  static async addItemToInventory(itemData: any) {
    const {
      name,
      quantity,
      unitPrice,
      expirationDate,
      description,
      wholeSaleId,
    } = itemData;
    const item = new Inventory({
      name,
      quantity,
      unitPrice,
      expirationDate,
      description,
      wholeSaleId,
    });

    await item.save();

    return item;
  }
  static async addManyItemToInventory(itemData: any,wholeSaleId:string|undefined) {
    const items = await itemData.map((item: any) => ({ ...item, wholeSaleId: wholeSaleId }))
    const insertedItems = await Inventory.insertMany(items)
    return insertedItems
    
  }
  static async getAllItemInventory(user: TUser | null | undefined) {
    const items = await Inventory.find({ wholeSaleId: user?.userId });
    return items;
  }
  static async deleteItemInInventory(id: String) {
    await Inventory.findByIdAndDelete(id);
  }
  static async updateItemInInventory(id: String, itemData: any) {
    const dataToBeUpdated = itemData;
    const updatedItem = await Inventory.findByIdAndUpdate(id, dataToBeUpdated, {
      new: true,
    });
    return updatedItem;
  }
}
