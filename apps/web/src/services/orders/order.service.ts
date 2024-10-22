import {  items, Order } from "@/types";
import { PROTECTED_API } from "../axios";

export const createOrder = async (orderData: any): Promise<Order> => {
  try {
    const response = await PROTECTED_API.post('/orders/new', orderData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const response = await PROTECTED_API.get('/orders');
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getOrderByIdApi = async (orderId: string|undefined): Promise<any> => {
  try {
    const response = await PROTECTED_API.get(`/orders/${orderId}`);
    const item_details = response.data.order.item_details
    response.data.order.item_details=item_details.map((i:any) => (i.item) )
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const uploadPaymentProofApi =async (orderId: string, formData: FormData): Promise<{ message: string }> => {
  try {
    const response=await PROTECTED_API.post(`/orders/upload-payment-proof/${orderId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data

  } catch (error:any) {
    throw new Error(error.message);
  }
  
};
export const updateOrder = async (
  orderNumber: string,
  updateData: any
): Promise<{ message: string }> => {
  try {
    const response = await PROTECTED_API.put(`/orders/${orderNumber}`, updateData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateOrderStatusApi = async (
  orderId: string,
  statusUpdate: any
): Promise<{ message: string }> => {
  try {
    const response = await PROTECTED_API.put(`/orders/${orderId}`, statusUpdate);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
