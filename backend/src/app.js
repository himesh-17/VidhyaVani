import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import v1Routes from './routes/v1/index.js';
import { errorHandler, notFound } from './middleware/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// CORS configuration
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// API Routes
app.use('/api/v1', v1Routes);

// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'SIP Platform API - Institutional Blogging & Events',
        version: '1.0.0',
        docs: '/api/v1/health',
    });
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;
