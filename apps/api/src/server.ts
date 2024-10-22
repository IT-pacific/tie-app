import express, { Express, NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import createError from 'http-errors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import http from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';
import routes from './routes';
import type { TServerConfig } from './types';
import path from 'path';
import userMiddleware from './middlewares/user.middleware';
import corsConfiguration from './configs/cors.config';


import Document from './models/document.model';

let presences: any[] = [];

export class InitServer {
    server: Express;
    database: typeof mongoose;
    httpServer: http.Server;
    io: SocketIOServer | undefined;
    connectedUsers: Record<string, Socket> = {};

    constructor() {
        this.server = express();
        this.database = mongoose;
        this.httpServer = http.createServer(this.server);
    }

    setup(config: TServerConfig) {
        this.database.set('strictPopulate', false);
        this.server.set('host', config.host);
        this.server.set('port', config.port);
        this.server.set('db_url', config.db_url);
        this.server.set('log_level', config.log_level);

        this.server.use(cors(corsConfiguration));
        this.server.use(helmet());
        this.server.use(morgan('tiny'));
        this.server.use(cookieParser());
        this.server.use(express.json());
        this.server.use(express.urlencoded({ extended: false }));

        this.server.use('/uploads', (req, res, next) => {
            res.header('Cross-Origin-Resource-Policy', 'cross-origin');
            next();
        }, express.static(path.join(__dirname, 'uploads')));

        this.io = new SocketIOServer(this.httpServer, {
            cors: {
                origin: "*",
            },
        });

        this.io.on('connection', (socket) => {
         

         

            socket.on('register', (userId: string) => {
                this.connectedUsers[userId] = socket;
                socket.emit('registered', `User ${userId} is registered with socket id ${socket.id}`);
            });

            socket.on('joinRoom', (roomName: string) => {
                socket.join(roomName);
            });

            socket.on('disconnect', (userId: string) => {
                delete this.connectedUsers[userId];
            });
        });

        this.server.use('/', (req: Request, res: Response, next: NextFunction) => {
            req.app.set('io', this.io);
            next();
        }, routes);

        this.server.use((req: Request, res: Response, next: NextFunction) => {
            next(createError(404));
        });
    }

    async start() {
        const host = this.server.get('host');
        const port = this.server.get('port');
        const db_url = this.server.get('db_url');

        try {
            await this.database.connect(db_url);

            this.httpServer.listen(port, () => {
                console.log(` Server is running at http://${host}:${port}`);
            });
        } catch (error) {
            console.error('[error]: Failed to start the server', error);
            process.exit(1);
        }
    }
}
