import { Request, Response } from 'express';
import { SalesService } from './sales.service';
import { catchAsync } from '../../shared/utils/catchAsync';
import { AuthenticatedRequest } from '../../shared/middleware/auth.middleware';
import { BadRequestError, UnauthorizedError } from '../../shared/utils/errors';

export class SalesController {
  private salesService: SalesService;

  constructor() {
    this.salesService = new SalesService();
  }

  /**
   * Retrieve paginated bills list
   * GET /api/v1/sales/bills
   */
  getBills = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await this.salesService.getBills(req.query);
    res.status(200).json({
      success: true,
      message: 'Bills retrieved successfully',
      data: result,
    });
  });

  /**
   * Retrieve single bill details by ID
   * GET /api/v1/sales/bills/:billId
   */
  getBillById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const billId = Number(req.params.billId);
    if (isNaN(billId)) {
      throw new BadRequestError('Invalid Bill ID format. Must be a number');
    }
    const result = await this.salesService.getBillById(billId);
    res.status(200).json({
      success: true,
      message: 'Bill retrieved successfully',
      data: result,
    });
  });

  /**
   * Cancel completed bill
   * PATCH /api/v1/sales/bills/:billId/cancel
   */
  cancelBill = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('User must be authenticated');
    }
    const billId = Number(req.params.billId);
    if (isNaN(billId)) {
      throw new BadRequestError('Invalid Bill ID format. Must be a number');
    }
    const result = await this.salesService.cancelBill(billId, req.user.id);
    res.status(200).json({
      success: true,
      message: 'Bill cancelled successfully',
      data: result,
    });
  });
}
