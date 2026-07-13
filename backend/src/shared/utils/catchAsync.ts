import { Request, Response, NextFunction } from 'express';

/**
 * Wraps an asynchronous Express route handler or middleware.
 * Automatically catches any thrown errors and passes them to the next error middleware.
 */
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
