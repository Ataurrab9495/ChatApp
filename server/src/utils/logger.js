import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// These lines simulate __filename and __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure log directory exists
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Define colors for log levels
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
};

// Tell winston about our colors
winston.addColors(colors);

// Determine the current environment
const env = process.env.NODE_ENV || 'development';

// Define which level to log based on environment
const level = () => {
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'warn';
};

// Define log format
const format = winston.format.combine(
    // Add timestamp to logs
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),

    // Add colors in development
    env === 'development' ? winston.format.colorize({ all: true }) : winston.format.uncolorize(),

    // Add errors stack trace
    winston.format.errors({ stack: true }),

    // Custom log format
    winston.format.printf((info) => {
        const { timestamp, level, message, stack, ...meta } = info;

        let log = `${timestamp} [${level}]: ${message}`;

        // Add metadata if present
        if (Object.keys(meta).length > 0) log += ` ${JSON.stringify(meta, null, 2)}`;

        // Add stack trace for errors
        if (stack) log += `\n${stack}`;

        return log;
    })
);

// Define transports
const transports = [
    // console transport
    new winston.transports.Console({
        level: level(),
    }),

    // Error log file
    new winston.transports.File({
        filename: path.join(logDir, 'error.log'),
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }),

    // Combined log file
    new winston.transports.File({
        filename: path.join(logDir, 'combined.log'),
        maxSize: 5242880, // 5MB
        maxFiles: 5,
    }),
];

// All daily rotate file transport for production
if (env === 'production') {
    const DailyRotateFile = require('winston-daily-rotate-file');

    transports.push(
        new DailyRotateFile({
            filename: path.join(logsDir, 'application-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',  // keep logs for 14 days
            level: 'info',
        })
    );
}

// Create the logger
const logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
    exitOnError: false, // do not exit on handled exceptions
});

// Create a stream object for Morgan HTTP logger
logger.stream = {
    write: (message) => {
        logger.http(message.trim());
    },
};

// Add custom methods for better logging
logger.logRequest = (req) => {
    logger.http(`${req.method} ${req.url}`, {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        userId: req.user?.id || 'anonymous',
    });
};

logger.logError = (error, req = null) => {
    const errorLog = {
        message: error.message,
        stack: error.stack,
        ...(req && {
            method: req.method,
            url: req.url,
            ip: req.ip,
            userId: req.user?.id
        }),
    };

    logger.error('Application Error', errorLog);
};

export default logger;