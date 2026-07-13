import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../utils/errors';

/**
 * 404 Not Found Middleware
 * 
 * Executed when a requested route doesn't match any registered route handlers.
 * It forwards a NotFoundError to the global error handler.
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
};
