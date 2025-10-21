import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
//import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import path from "path";

// Import your custom code
import authRoutes from "./routes/auth.routes.js";
import callRoutes from './routes/call.routes.js';
import userRoutes from './routes/user.routes.js';
import messageRoutes from './routes/message.routes.js';
import conversationRoutes from './routes/conversation.routes.js';
// import { errorMiddleware } from './middlewares/error.middleware.js';
//import { notFound } from "./middlewares/error.middleware.js";
import logger from './utils/logger.js';

import { fileURLToPath } from 'url';

// These lines simulate __filename and __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ========================================
// 1. CREATE EXPRESS APPLICATION
// ========================================
const app = express();

// ========================================
// 2. BASIC SETTINGS
// ========================================

// Trust proxy - needed when behind Nginx or load balancer
// This helps get real client IP addresses
app.set('trust proxy', 1);

// ========================================
// 3. SECURITY MIDDLEWARE (Order matters!)
// ========================================

// HELMET: Sets secure HTTP headers to protect against common attacks
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow loading resources from other origins
    contentSecurityPolicy: false // Disable CSP in development (enable in production)
}));

// CORS: Allow requests from your React frontend
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // Your React app URL
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

// RATE LIMITING: Prevent brute force attacks by limiting requests
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes time window
    max: 100, // Max 100 requests per IP in this window
    message: 'Too many requests, please try again later.',
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
});
app.use('/api/', limiter); // Apply only to API routes

// NOSQL INJECTION PROTECTION: Sanitize user input
//app.use(mongoSanitize()); // Removes $ and . from req.body, req.params, req.query

// ========================================
// 4. REQUEST PARSING MIDDLEWARE
// ========================================

// Parse JSON bodies (when client sends JSON data)
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies (when client sends form data)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Parse cookies from request headers
app.use(cookieParser());

// ========================================
// 5. PERFORMANCE MIDDLEWARE
// ========================================

// Compress response bodies for better performance
app.use(compression());

// ========================================
// 6. LOGGING MIDDLEWARE
// ========================================

if (process.env.NODE_ENV === 'development') {
    // Development: Colorful console logs
    app.use(morgan('dev'));
    console.log('🔧 Running in DEVELOPMENT mode');
} else {
    // Production: Log to file using Winston
    app.use(morgan('combined', {
        stream: { write: (message) => logger.info(message.trim()) }
    }));
    console.log('🚀 Running in PRODUCTION mode');
}

// ========================================
// 7. STATIC FILES
// ========================================

// Serve uploaded files (images, videos, etc.)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ========================================
// 8. ROOT ROUTE (Homepage)
// ========================================

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Chat App API Server',
        version: '1.0.0',
        environment: process.env.NODE_ENV,
        endpoints: {
            health: '/health',
            auth: '/api/auth',
            users: '/api/users',
            conversations: '/api/conversations',
            messages: '/api/messages',
            groups: '/api/groups',
            calls: '/api/calls',
            upload: '/api/upload'
        },
        documentation: 'https://github.com/yourusername/chat-app-api'
    });
});

// ========================================
// 9. HEALTH CHECK ENDPOINT
// ========================================

// This endpoint is used to check if server is running
// Useful for monitoring tools and load balancers
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'healthy',
        message: 'Server is running perfectly',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()) + ' seconds',
        environment: process.env.NODE_ENV,
        memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
        }
    });
});

// ========================================
// 10. API ROUTES (Your actual endpoints)
// ========================================

// All routes start with /api
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/conversation', conversationRoutes);
app.use('/api/call', callRoutes);

// ========================================
// 11. ERROR HANDLING (Must be last!)
// ========================================

// Handle 404 errors (route not found)
//app.use(notFound);

// Handle all other errors
//app.use(errorMiddleware);

// ========================================
// 12. EXPORT APP
// ========================================

export default app;