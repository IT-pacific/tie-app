import { Router } from 'express';
import userMiddleware from '../middlewares/user.middleware';
import { LinkController } from '../controllers/link.controller';
export const link = Router();

// Add item to  link
link.post('/generateLink', userMiddleware.hasRole("receptionist"), LinkController.createLink);
link.get('/items',userMiddleware.hasRole("operator"),LinkController.getAllLinkItems)
//Add item to the link
link.patch('/add-items', userMiddleware.hasRole("receptionist"), LinkController.addItemToLink)
//Add customer to the link
link.patch('/add-customer', userMiddleware.hasRole("receptionist"), LinkController.addCustomerIdToLink)
// Remove item from link
link.delete('/:id',userMiddleware.hasRole("receptionist"), LinkController.deleteLink);
// Update item in link
link.put('/:id',userMiddleware.hasRole("receptionist"), LinkController.updateLink);
// Get all items inluckybelieve10@gmail. link
link.get('/', LinkController.getAllLinks)
// get items by linkId
link.get("/link/:id/items",LinkController.getItemsByLink)

