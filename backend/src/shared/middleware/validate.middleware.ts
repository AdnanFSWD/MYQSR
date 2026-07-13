import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

/**
 * Express middleware to validate request payload/parameters against a Zod schema.
 * Automatically delegates caught Zod validation errors to the global error handler.
 */
export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      next(error);
    }
  };
};
