import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRouter from './routes';
import { notFoundHandler } from './shared/middleware/notFound.middleware';
import { errorHandler } from './shared/middleware/error.middleware';

// Load environment variables from .env file
dotenv.config();

const app: Application = express();

// ==========================================
// Middleware Configuration
// ==========================================

// HTTP request logger middleware
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat));

// Enable Cross-Origin Resource Sharing (CORS) with default configuration
// Allows all origins by default; customize as needed for production environments.
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse incoming requests with JSON payloads
app.use(express.json());

// Parse incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: true }));

// ==========================================
// Route Declarations
// ==========================================

// Mount all API routes under /api
app.use('/api', apiRouter);

// ==========================================
// Error Handling Middleware
// ==========================================

// Catch 404 and forward to global error handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;
