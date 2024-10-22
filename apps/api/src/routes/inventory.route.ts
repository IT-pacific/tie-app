import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';
import userMiddleware from '../middlewares/user.middleware';
export const inventory = Router();
// Add item to  inventory
inventory.post('/addItem', userMiddleware.hasRole("receptionist"), InventoryController.addItem);
inventory.post('/addItem/many',userMiddleware.hasRole("receptionist"), InventoryController.addManyItems);
// Remove item from inventory
inventory.delete('/deleteItem/:id',userMiddleware.hasRole("receptionist"), InventoryController.deleteItem);
// Update item in inventory
inventory.put('/updateItem/:id',userMiddleware.hasRole("receptionist"), InventoryController.updateItem);
// Get all items in inventory
inventory.get('/inventory',userMiddleware.hasRole("receptionist"),InventoryController.getAllItems)