import { Router } from 'express';
import userMiddleware from '../middlewares/user.middleware';
import { AnalyticController } from '../controllers/analytic.controller';
export const analytic = Router();
//get dashboard data
analytic.get('/',userMiddleware.hasAllRoles(["receptionist","operator"]),AnalyticController.getAnalyticData );
