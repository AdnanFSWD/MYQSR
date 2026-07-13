import { Request, Response } from 'express';
import { DashboardService } from './dashboard.service';
import { catchAsync } from '../../shared/utils/catchAsync';

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  /**
   * Retrieve aggregated dashboard data metrics
   * GET /api/v1/dashboard
   */
  getDashboardData = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await this.dashboardService.getDashboardData();
    res.status(200).json({
      success: true,
      message: 'Dashboard metrics retrieved successfully',
      data: result,
    });
  });
}
