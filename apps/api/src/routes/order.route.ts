import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import userMiddleware from '../middlewares/user.middleware';
import upload from '../middlewares/upload.middleware';
const order = Router();
//create order
order.post('/new', userMiddleware.hasRole("operator"), OrderController.createOrder);
//get all orders
order.get('/', userMiddleware.hasAllRoles(["receptionist","operator"]), OrderController.getAllOrders);
//get order by number
order.get('/:id', userMiddleware.hasAllRoles(["operator","receptionist"]),OrderController.getOrderById);
//update an order by orderNumber
order.put('/:id', userMiddleware.hasAllRoles(["operator","receptionist"]),OrderController.updateOrder);
//update order status
order.patch('/:id', userMiddleware.hasAllRoles(["operator", "receptionist"]), OrderController.updateOrderStatus)
//upload payment proof
order.post('/upload-payment-proof/:orderId', upload.single('paymentProof'), OrderController.uploadPaymentProof);

export default order;
