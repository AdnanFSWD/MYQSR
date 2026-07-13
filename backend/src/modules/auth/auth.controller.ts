import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { catchAsync } from '../../shared/utils/catchAsync';
import { AuthenticatedRequest } from '../../shared/middleware/auth.middleware';
import { UnauthorizedError } from '../../shared/utils/errors';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Login handler
   * POST /api/v1/auth/login
   */
  login = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;
    const result = await this.authService.login(username, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  });

  /**
   * Logout handler (Stateless logout)
   * POST /api/v1/auth/logout
   */
  logout = catchAsync(async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  });

  /**
   * Change password handler
   * POST /api/v1/auth/change-password
   */
  changePassword = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User must be authenticated');
    }

    const { oldPassword, newPassword } = req.body;
    const result = await this.authService.changePassword(req.user.id, {
      oldPassword,
      newPassword,
    });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
      data: result,
    });
  });
}
