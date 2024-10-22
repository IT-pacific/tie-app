import {isAxiosError} from "axios";

export type ResponseType<T> =  {
  path: string;
  method: string;
  message: string;
  success: boolean;
  statusCode: number;
  data: T;
};

export class CustomError extends Error {
  response: ResponseType<null>;

  constructor(response: ResponseType<null>) {
    super(response.message);
    this.name = "CustomError";
    this.response = response;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export type CustomErrorType = {
  message: string;
  response: ResponseType<null>;
};

export const AxiosErrorHandler = (error: any): ResponseType<null> => {
  if (isAxiosError(error)) {
    if (error.response) {
      return {
        statusCode: error.response.status,
        message: error.response.data.message,
        success: true,
        data: error.response.data.data,
        path: error.response.data.path,
        method: error.response.data.method,
      };
    } else if (error.request) {
      return {
        statusCode: 504,
        message: "Gateway Timeout: The server did not respond in time.",
        success: false,
        data: null,
        path: error.request.path,
        method: error.request.method,
      };
    } else {
      return {
        statusCode: 400,
        message: "Bad Request: The request could not be processed.",
        success: false,
        data: null,
        path: error.request.path,
        method: error.request.method,
      };
    }
  }
  return {
    statusCode: 500,
    message: "Internal Server Error: An error occurred on the server.",
    success: true,
    data: null,
    path: error.request.path,
    method: error.request.method,
  };
};
