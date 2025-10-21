import logger from '../utils/logger.util.js';
import { AppError } from '../utils/errorHandler';

export const notFound = (req, res, next) => {
    const error = new AppError(
        `Route ${req.originalUrl} not found`,
        404
    );
    next(error);
};

/* Development Error Response */

const sendErrorDev = (err, req, res) => {
    logger.error('Development Error:', {
        error: err,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
    });

    return res.status(err.statusCode || 500).json({
        success: false,
        status: err.status || 'error',
        error: err,
        message: err.message,
        stack: err.stack,
        details: err.details || null,
    });
};


/* production Error response */

const sendErorProd = (err, req, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message
        });
    }


    // programming or other unknown error: don't leak error details
    logger.error('Production Error:', {
        error: err,
        url: req.originalUrl,
        method: req.method,
    });

    return res.status(500).json({
        success: false,
        status: 'error',
        message: 'Something went wrong!'
    });

};

/* Handle Mongoose Cast Error (Invalid ID) */

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

/* Handle Mongoose Duplicate Key Error */

const handleDuplicateFieldsDB = (err) => {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `Duplicate field value: '${value}' for field: '${field}'. Please use another value!`;
    return new AppError(message, 409);
};

/* Handle Mongoose Validation Error */

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

/* Handle JWT Error */

const handleJWTError = () => {
    return new AppError('Invalid token. Please log in again', 401);
};

/* Handle JWT Expired Error */
const handleJWTExpiredError = () => {
    return new AppError('Your token has expired. Please log in again.', 401);
};

/* Handle Multer File Upload Error */

const handleMulterError = (err) => {
    if(err.code === 'LIMIT_FILE_SIZE'){
        return new AppError('File size too large. Maximum Size is 100MB', 400);
    }
    if(err.code === 'LIMIT_FILE_COUNT'){
        return new AppError('Too many files. Maximum 10 files allowed', 400);
    }
    if(err.code === 'LIMIT_UNEXPECTED_FILE'){
        return new AppError('Unexpected file field', 400);
    }
    return new AppError(err.message, 400);
};


/* Global Error Handler Middleware */

const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err, req, res);
    }else if(process.env.NODE_ENV === 'production'){
        let error = {...err};
        error.message = err.message;
        error.name = err.name;

        /* Handle specific error types */
        if(error.name === 'CastError') error = handleCastErrorDB(error);
        if(error.code === 11000) error = handleDuplicateFieldsDB(error);
        if(error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if(error.name === 'JsonWebTokenError') error = handleJWTError(error);
        if(error.name === 'TokenExpiredError') error = handleJWTExpiredError(error);
        if(error.name === 'MulterError') error = handleMulterError(error);

        sendErorProd(error, req, res);     
    }
};

export {
    errorMiddleware
};
