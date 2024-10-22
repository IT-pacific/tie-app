import { PROTECTED_API, PUBLIC_API } from '../axios';
import { items, Link } from '@/types';

export const createLink = async (
  link: { item_ids:string[]|null,hiddenFields?:string[],expiresAt:Date|undefined,customerIds?:[string]}|Partial<Link>
): Promise<{ message: string; link: Partial<Link> }> => {
  try {
    const request = await PROTECTED_API.post('/links/generateLink', {
      items: link.item_ids,
      hiddenFields: link.hiddenFields,
      expiresAt: link.expiresAt,
      customerIds: link.customerIds,
    });

    return request.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateLink = async (
  link: Partial<Link>,
  linkId?: string
): Promise<{ message: string; link: Partial<Link> }> => {
  try {
    const request = await PROTECTED_API.put(`/links/${linkId}`, {
      itemsIds: link.item_ids,
      hiddenFields: link.hiddenFields,
      expiresAt: link.expiresAt,
      customerIds: link.customerIds,
    });
    return request.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const addItemToLink = async (
  linkId: string,
  itemId: string
): Promise<{ message: string; link: Partial<Link> }> => {
  try {
    const request = await PROTECTED_API.patch('/links/add-items', {
      linkId,
      itemId,
    });

    return request.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const addCustomerToLink = async (
  linkId: string,
  customerId: string
): Promise<{ message: string; link: Partial<Link> }> => {
  try {
    const request = await PROTECTED_API.patch('/links/add-customer', {
      linkId,
      customerId,
    });
    return request.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteLink = async (
  linkId: string
): Promise<{ message: string }> => {
  try {
    const request = await PROTECTED_API.delete(`/links/${linkId}`);
    return request.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getAllLinks = async (): Promise<Partial<Link>[] > => {
  try {
    const request = await PROTECTED_API.get('/links');
   
    return request.data.links;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getItemsByLink = async (
  linkId: string|undefined
): Promise<{ items: Partial<items>[],company?:{email:string,phoneNumber?:string,companyName:string}}> => {
  try {
    const response = await PROTECTED_API.get(`/links/link/${linkId}/items`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

