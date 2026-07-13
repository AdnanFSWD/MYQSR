import { Request, Response } from 'express';
import { OrdersService } from './orders.service';
import { catchAsync } from '../../shared/utils/catchAsync';
import { AuthenticatedRequest } from '../../shared/middleware/auth.middleware';
import { BadRequestError, UnauthorizedError } from '../../shared/utils/errors';

export class OrdersController {
  private ordersService: OrdersService;

  constructor() {
    this.ordersService = new OrdersService();
  }

  /**
   * Retrieve paginated orders list
   * GET /api/v1/orders
   */
  getOrders = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await this.ordersService.getOrders(req.query);
    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      data: result,
    });
  });

  /**
   * Retrieve order details by ID
   * GET /api/v1/orders/:id
   */
  getOrderById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      throw new BadRequestError('Invalid Order ID format. Must be a number');
    }
    const result = await this.ordersService.getOrderById(id);
    res.status(200).json({
      success: true,
      message: 'Order retrieved successfully',
      data: result,
    });
  });

  /**
   * Cancel completed order
   * PATCH /api/v1/orders/:id/cancel
   */
  cancelOrder = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User must be authenticated');
    }
    const id = Number(req.params.id);
    if (isNaN(id)) {
      throw new BadRequestError('Invalid Order ID format. Must be a number');
    }
    const result = await this.ordersService.cancelOrder(id, req.user.id);
    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: result,
    });
  });
}
