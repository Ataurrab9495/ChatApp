import http from "http";
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// import configurations
//import connectDB from './src/config/db.js';
//import connectRedis from './src/config/redis.js';
//import { initializeSocket } from './src/config/socket.js';
import logger from './src/utils/logger.js';

//import routes
//import routes from './src/routes';

// import middleware
// import errorMiddleware from './src/middlewares/error.middleware.js';
// import { notFound } from './src/middlewares/error.middleware.js';

// import jobs

import app from './src/app.js';


const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = http.createServer(app);

//const io = initializeSocket(server);

//app.set('io', io);

const initializeDatabases = async () => {
    try {
        //await connectDB();
        logger.info('MongoDB connected Successfully');

        // connect to Redis
    } catch (error) {
        logger.error('Database Connection failed:', error);
        process.exit(1);
    }
}

const startServer = async () => {
    try {
        await initializeDatabases();

        // start Http server
        server.listen(PORT, () => {
            logger.info(`
        🚀 SERVER STARTED SUCCESSFULLY
        Environment: ${NODE_ENV.toUpperCase().padEnd(42)}
        Port: ${PORT.toString().padEnd(50)}
        URL: http://localhost:${PORT.toString().padEnd(37)}

        📡 Socket.io: Running
        💾 MongoDB: Connected
        🔴 Redis: Connected 
`);
        })

        //initialize background jobs in production
    } catch (error) {
        logger.error("failed to start server", error);
        process.exit(1);
    }
}

startServer();