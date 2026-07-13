import { Request, Response } from 'express';
import { SettingsService } from './settings.service';
import { catchAsync } from '../../shared/utils/catchAsync';

export class SettingsController {
  private settingsService: SettingsService;

  constructor() {
    this.settingsService = new SettingsService();
  }

  /**
   * Fetch settings configurations
   * GET /api/v1/settings
   */
  getSettings = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await this.settingsService.getSettings();
    res.status(200).json({
      success: true,
      message: 'Settings retrieved successfully',
      data: result,
    });
  });

  /**
   * Update settings configurations
   * PUT /api/v1/settings
   */
  updateSettings = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await this.settingsService.updateSettings(req.body);
    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: result,
    });
  });
}
