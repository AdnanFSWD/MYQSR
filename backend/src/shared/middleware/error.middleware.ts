import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { ZodError } from 'zod';

/**
 * Global Error Handling Middleware
 * 
 * Intercepts all thrown errors in the application. It formats and returns
 * structured JSON responses to the client.
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  // 1. Handle custom AppError instances
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(isDevelopment && { stack: err.stack }),
    });
    return;
  }

  // 2. Handle Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: err.errors.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
      ...(isDevelopment && { stack: err.stack }),
    });
    return;
  }

  // 3. Handle Prisma specific errors (if any runtime/client errors occur)
  if (err.name?.startsWith('PrismaClient')) {
    res.status(400).json({
      success: false,
      message: 'Database query/validation failed',
      ...(isDevelopment && { details: err.message, stack: err.stack }),
    });
    return;
  }

  // 4. Default: Handle all other unexpected errors (e.g., system/programming bugs)
  // Log the detailed error internally for debugging
  console.error('[Unhandled Error]:', err);

  res.status(500).json({
    success: false,
    message: isDevelopment ? err.message : 'Internal Server Error',
    ...(isDevelopment && { stack: err.stack }),
  });
};
