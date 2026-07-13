import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../../prisma/client';
import { UnauthorizedError } from '../utils/errors';

const JWT_SECRET = process.env.JWT_SECRET || 'qsr-super-secret-key-12345';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    name: string;
    username: string;
    role: string;
  };
}

export const authenticateJWT = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      role: string;
    };

    // Find user in DB to verify still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true, // Stores the username (e.g. 'admin')
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('User associated with this token no longer exists');
    }

    // Attach user payload to request
    req.user = {
      id: user.id,
      name: user.name,
      username: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid or expired authentication token'));
    } else {
      next(error);
    }
  }
};
