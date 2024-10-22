import { Router, Request, Response } from 'express';
import { user } from './auth.route';
import { inventory } from './inventory.route';
import { link } from './link.route';
import { notification } from './notification.route';
import order from './order.route';
import { analytic } from './analytic.route';
import document from './document.route';


const routes = Router();

// Home route
routes.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the API project!');
});

// API routes
routes.use('/api/user', user);
routes.use('/api/document',document)
routes.use("/api/wholesale", inventory)
routes.use("/api/links", link)
routes.use("/api/notifications", notification)
routes.use('/api/orders', order)
routes.use('/api/analytics',analytic)

// With Middleware
// routes.use('/api/user', userMiddleware.validateToken, userMiddleware.hasAnyRole(['user', 'admin']), user);

export default routes;
