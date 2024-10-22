import * as express from 'express';
import { Socket } from 'socket.io';
declare global {
  namespace Express {
    interface Request {
      connectedUsers?: Record<string, Socket>;
    }
  }
}