import { Schema } from "mongoose";
import { IOrder } from "../models/order.model";

export interface Analytic {
  _id?: Schema.Types.ObjectId;
  totalOrders: number,
  totalSales?: number,
  totalInventory?: number,
  totalCorporate?: number,
  activeVsComplete: {
    active: number,
    complete:number,
  },
  orderAnalytic?: {
    rejected: number,
    pending: number,
    cancelled: number,
    confirmed:number,
  },
  orderStatics?:any[]
  recentOrders: IOrder[]|null,
  
}