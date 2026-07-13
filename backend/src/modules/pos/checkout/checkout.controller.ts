import { Request, Response } from 'express';
import { CheckoutService } from './checkout.service';
import { catchAsync } from '../../../shared/utils/catchAsync';

export class CheckoutController {
  private checkoutService: CheckoutService;

  constructor() {
    this.checkoutService = new CheckoutService();
  }

  /**
   * Execute checkout workflow
   * POST /api/v1/pos/checkout
   */
  checkout = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await this.checkoutService.checkout(req.body);
    res.status(201).json({
      success: true,
      message: 'POS Checkout completed successfully',
      data: result,
    });
  });
}
