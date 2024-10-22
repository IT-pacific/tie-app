import { Request, Response } from 'express';
import { getTokenInfo } from '../utils';
import { User } from '../models/user.model';
import { Analytic } from '../types';
import { Order } from '../models/order.model';
import { Inventory } from '../models/item.model';
import { OrderService } from '../services/order.service';
import { Link } from '../models/link.model';
export class AnalyticController {
  static async getAnalyticData(req: Request, res: Response) {
    try {
      const { period } = req.query;
      const userId = getTokenInfo({ req })?.user?.userId;
      const user = await User.findById(userId);
      let analyticData: Analytic = {
        totalOrders: 0,
        totalSales: 0,
        totalInventory: 0,
        totalCorporate: 0,
        recentOrders: null,
        orderStatics: [],
        activeVsComplete: {
          active: 0,
          complete: 0,
        },
      };

      if (user?.role === 'receptionist') {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59,
        );

        const link = await Link.find({ wholesaleId: userId });
        const totalOrders = await Order.countDocuments({
          link_id: { $in: link },
        });

        analyticData.totalOrders = totalOrders;
        const completedOrders = await Order.countDocuments({
          status: 'confirmed',
          link_id: { $in: link },
        });
        const rejectedOrders = await Order.countDocuments({
          status: 'rejected',
          link_id: { $in: link },
        });
        const cancelledOrders = await Order.countDocuments({
          status: 'cancelled',
          link_id: { $in: link },
        });
        const pendingOrders = await Order.countDocuments({
          status: 'pending',
          link_id: { $in: link },
        });
        const confirmedOrders = await Order.countDocuments({
          status: 'confirmed',
          link_id: { $in: link },
        });
        analyticData.orderAnalytic = {
          confirmed: completedOrders,
          rejected: rejectedOrders,
          cancelled: cancelledOrders,
          pending: pendingOrders,
        };
        analyticData.activeVsComplete = {
          active: pendingOrders,
          complete: rejectedOrders + cancelledOrders + confirmedOrders,
        };
        const totalSale = await Order.find({
          status: 'confirmed',
          link_id: { $in: link },
        });
        const totalSalePrice = totalSale.reduce((total, order) => {
          const orderTotal = order.item_details.reduce((orderSum, item) => {
            const unitPrice = item.unitPrice || 0;
            const quantity = item.quantity || 0;
            return orderSum + unitPrice * quantity;
          }, 0);

          return total + orderTotal;
        }, 0);
        analyticData.totalSales = totalSalePrice;

        const allInventory = await Inventory.find({ wholeSaleId: userId });
        const totalInventory = allInventory.reduce((sum, item) => {
          const unitPrice = item.unitPrice || 0;
          const quantity = item.quantity || 0;
          return sum + unitPrice * quantity;
        }, 0);

        analyticData.totalInventory = totalInventory;
        const thisMonthInventory = await Inventory.find({
          createdAt: { $gte: startOfMonth, $lt: endOfMonth },
          wholeSaleId: userId,
        });
        const thisMonthInventoryCount = thisMonthInventory.reduce(
          (sum, item) => {
            const unitPrice = item.unitPrice || 0;
            const quantity = item.quantity || 0;
            return sum + unitPrice * quantity;
          },
          0,
        );

        const totalCorporates = await User.countDocuments({ role: 'operator' });
        analyticData.totalCorporate = totalCorporates;
        const recentOrders = await Order.find({ link_id: { $in: link } }).sort({
          createdAt: -1,
        });
        analyticData.recentOrders = recentOrders;
        const currentDate = new Date();
        const statistics = [];

        if (period === 'monthly') {
          for (let i = 0; i < 12; i++) {
            const monthStart = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth() - i,
              1,
            );
            const monthEnd = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth() - i + 1,
              0,
            );

            const monthlyOrders = await Order.find({
              createdAt: { $gte: monthStart, $lte: monthEnd },
              link_id: { $in: link },
            });

            const paidOrders = monthlyOrders.filter(
              order => order.status === 'confirmed',
            ).length;

            statistics.push({
              month: monthStart.toLocaleString('default', { month: 'long' }),
              year: monthStart.getFullYear(),
              totalOrders: monthlyOrders.length,
              paidOrders,
            });
          }
        } else if (period === 'weekly') {
          for (let i = 0; i < 4; i++) {
            const weekStart = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate() - i * 7,
            );
            const weekEnd = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              weekStart.getDate() + 6,
            );

            const weeklyOrders = await Order.find({
              createdAt: { $gte: weekStart, $lte: weekEnd },
              link_id: { $in: link },
            });

            const paidOrders = weeklyOrders.filter(
              order => order.status === 'confirmed',
            ).length;

            statistics.push({
              week: `Week of ${weekStart.toLocaleDateString()}`,
              totalOrders: weeklyOrders.length,
              paidOrders,
            });
          }
        } else {
          for (let i = 0; i < 5; i++) {
            const yearStart = new Date(currentDate.getFullYear() - i, 0, 1);
            const yearEnd = new Date(yearStart.getFullYear() + 1, 0, 0);

            const yearlyOrders = await Order.find({
              createdAt: { $gte: yearStart, $lte: yearEnd },
              link_id: { $in: link },
            });

            const paidOrders = yearlyOrders.filter(
              order => order.status === 'confirmed',
            ).length;

            statistics.push({
              year: yearStart.getFullYear(),
              totalOrders: yearlyOrders.length,
              paidOrders,
            });
          }
        }
        analyticData.orderStatics = statistics;
        return res.status(200).json(analyticData);
      } else if (user?.role === 'operator') {
        const completedOrders = await Order.countDocuments({
          status: 'confirmed',
          retail_id: userId,
        });
        const rejectedOrders = await Order.countDocuments({
          status: 'rejected',
          retail_id: userId,
        });
        const cancelledOrders = await Order.countDocuments({
          status: 'cancelled',
          retail_id: userId,
        });
        const pendingOrders = await Order.countDocuments({
          status: 'pending',
          retail_id: userId,
        });
        analyticData.orderAnalytic = {
          confirmed: completedOrders,
          rejected: rejectedOrders,
          cancelled: cancelledOrders,
          pending: pendingOrders,
        };
        analyticData.activeVsComplete = {
          active: pendingOrders,
          complete: rejectedOrders + cancelledOrders + completedOrders,
        };
        const totalOrders = await Order.countDocuments({ retail_id: userId });
        analyticData.totalOrders = totalOrders;
        const totalSale = await Order.find({
          status: 'confirmed',
          retail_id: userId,
        });
        const totalSalePrice = totalSale.reduce((total, order) => {
          const orderTotal = order.item_details.reduce((orderSum, item) => {
            const unitPrice = item.unitPrice || 0;
            const quantity = item.quantity || 0;
            return orderSum + unitPrice * quantity;
          }, 0);

          return total + orderTotal;
        }, 0);
        analyticData.totalSales = totalSalePrice;

        const recentOrders = await Order.find({ retail_id: userId }).sort({
          createdAt: -1,
        });
        analyticData.recentOrders = recentOrders;
        const currentDate = new Date();
        const statistics = [];

        if (period === 'monthly') {
          for (let i = 0; i < 12; i++) {
            const monthStart = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth() - i,
              1,
            );
            const monthEnd = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth() - i + 1,
              0,
            );

            const monthlyOrders = await Order.find({
              createdAt: { $gte: monthStart, $lte: monthEnd },
              retail_id: userId,
            });

            const paidOrders = monthlyOrders.filter(
              order => order.status === 'confirmed',
            ).length;

            statistics.push({
              month: monthStart.toLocaleString('default', { month: 'long' }),
              year: monthStart.getFullYear(),
              totalOrders: monthlyOrders.length,
              paidOrders,
            });
          }
        } else if (period === 'weekly') {
          for (let i = 0; i < 4; i++) {
            const weekStart = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate() - i * 7,
            );
            const weekEnd = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              weekStart.getDate() + 6,
            );

            const weeklyOrders = await Order.find({
              createdAt: { $gte: weekStart, $lte: weekEnd },
              retail_id: userId,
            });

            const paidOrders = weeklyOrders.filter(
              order => order.status === 'confirmed',
            ).length;

            statistics.push({
              week: `Week of ${weekStart.toLocaleDateString()}`,
              totalOrders: weeklyOrders.length,
              paidOrders,
            });
          }
        } else {
          for (let i = 0; i < 5; i++) {
            const yearStart = new Date(currentDate.getFullYear() - i, 0, 1);
            const yearEnd = new Date(yearStart.getFullYear() + 1, 0, 0);

            const yearlyOrders = await Order.find({
              createdAt: { $gte: yearStart, $lte: yearEnd },
              retail_id: userId,
            });

            const paidOrders = yearlyOrders.filter(
              order => order.status === 'confirmed',
            ).length;

            statistics.push({
              year: yearStart.getFullYear(),
              totalOrders: yearlyOrders.length,
              paidOrders,
            });
          }
        }
        analyticData.orderStatics = statistics;
        return res.status(200).json(analyticData);
      }
    } catch (error) {
      
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : 'Something went wrong',
      });
    }
  }
}
