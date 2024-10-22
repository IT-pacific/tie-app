import {  Analytic } from "@/types";
import { PROTECTED_API } from "../axios";

export const getAnalyticApi = async (period:string="yearly"): Promise<Analytic> => {
  try {
    const response = await PROTECTED_API.get(`/analytics?period=${period}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
