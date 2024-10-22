import { items } from '@/types';
import { PROTECTED_API } from '../axios';

export const addItem = async (
  item: Partial<items>
): Promise<{ message: string; item: Partial<items> }> => {
  try {
    const request = await PROTECTED_API.post('/wholesale/addItem', {
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      expirationDate: item.expirationDate,
      description: item.description,
    });
    return request.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateItem = async (
  item: Partial<items>,
  itemId?: string
): Promise<{ message: string }> => {
  try {
    const request = await PROTECTED_API.put(`/wholesale/updateItem/${itemId}`, {
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      expirationDate: item.expirationDate,
      description: item.description,
    });
    return request.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getAllItems = async (): Promise<{ items: Partial<items>[] }> => {
  try {
    const request = await PROTECTED_API.get('/wholesale/inventory');
    return request.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteItem = async (
  itemId: string
): Promise<{ message: string }> => {
  try {
    const request = await PROTECTED_API.delete(
      `/wholesale/deleteItem/${itemId}`
    );
    return request.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const addManyItemApi = async (
  data: Partial<items>[]
): Promise<{ message: string; item: Partial<items>[] }> => { 
  try {
    const request = await PROTECTED_API.post('/wholesale/addItem/many', {
      items: data.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        expirationDate: item.expirationDate,
        description: item.description,
      }))
    });
    

    return request.data; 
  } catch (error: any) {
    throw new Error(error.message);
  }
};


