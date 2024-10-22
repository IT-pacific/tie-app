export interface initialValues {
  email: string;
  category: string;
  role: 'Retail' | 'Wholesale';
  phone?: string;
  username: string;
  password: string;
}

export type User = {
  user_id: string;
  category: string;
  username: string;
  phone?: string;
  companyLogo?: any;
  password: string;
  email: string;
  role: 'receptionist' | 'operator';
  companyName: string;
};
export type Notification = {
  id?: string;
  userId?: string;
  orderId?: string;
  message: string;
  read: boolean;
  createdAt: Date;
};

export type items = {
  _id: string;
  name: string;
  description: string;
  quantity: number;
  expirationDate: Date | string;
  unitPrice: number;
  quantityUnit?: 'kilogram (kg)' | 'litre (l)' | 'meter (m)' | 'others';
  batchNo?: number;
  itemType?: 'Finished Product' | 'Raw material' | 'others';
  wholeSaleId?: string;
  createdAt: Date | string;
  updatedAt?: Date;
};
export type PaidAndNotPaidData = {
  year: number;
  totalOrders: number;
  paidOrders: number;
};
export type Analytic = {
  _id?: string;
  totalOrders: number;
  totalSales?: number;
  totalInventory?: number;
  totalCorporate?: number;
  orderAnalytic?: {
    rejected: number;
    pending: number;
    cancelled: number;
    confirmed: number;
  };
  activeVsComplete?: {
    active: number;
    complete: number;
  };
  orderStatics?: PaidAndNotPaidData[];
  recentOrders: Order[] | null;
};

export type Order = {
  link_id: string;
  order_id: string;
  _id?: string;
  retail_id: User | Partial<User> | null;
  item_details: items[];
  status:
    | 'pending'
    | 'confirmed'
    | 'rejected'
    | 'cancelled'
    | 'payment-pending'
    | 'completed';
  paymentProof: string;
  createdAt: Date | string;
};

export type OrderType = {
  customer: string;
  order_number: string;
  total_cost: string;
  total_quantity: string;
  total_items: string;
  status:
    | 'pending'
    | 'confirmed'
    | 'rejected'
    | 'cancelled'
    | 'payment-pending'
    | 'completed';
  Date: Date;
};

export type Filter = {
  columnName: string;
};

export type Link = {
  _id: string;
  hiddenFields?: string[];
  wholeSaleId?: string;
  item_ids?: string;
  customerIds?: string;
  confirm_count?: string;
  createdAt: Date | string;
  expiresAt: Date | string;
  allItems?: boolean;
  status: 'active' | 'expired';
};
