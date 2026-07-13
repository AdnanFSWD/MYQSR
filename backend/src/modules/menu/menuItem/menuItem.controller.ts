import { Request, Response } from 'express';
import { MenuItemService } from './menuItem.service';
import { catchAsync } from '../../../shared/utils/catchAsync';

export class MenuItemController {
  private menuItemService: MenuItemService;

  constructor() {
    this.menuItemService = new MenuItemService();
  }

  /**
   * Retrieve all menu items.
   * GET /api/v1/menu-items
   */
  getMenuItems = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const items = await this.menuItemService.getAllMenuItems();
    res.status(200).json({
      success: true,
      message: 'Menu items retrieved successfully',
      data: items,
    });
  });

  /**
   * Retrieve a single menu item by its ID.
   * GET /api/v1/menu-items/:id
   */
  getMenuItemById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const item = await this.menuItemService.getMenuItemById(id);
    res.status(200).json({
      success: true,
      message: 'Menu item retrieved successfully',
      data: item,
    });
  });

  /**
   * Retrieve all menu items belonging to a specific category.
   * GET /api/v1/menu-items/category/:categoryId
   */
  getMenuItemsByCategory = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const categoryId = Number(req.params.categoryId);
    const items = await this.menuItemService.getMenuItemsByCategory(categoryId);
    res.status(200).json({
      success: true,
      message: 'Menu items retrieved by category successfully',
      data: items,
    });
  });

  /**
   * Retrieve all available menu items (isAvailable = true).
   * GET /api/v1/menu-items/available
   */
  getAvailableMenuItems = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const items = await this.menuItemService.getAvailableMenuItems();
    res.status(200).json({
      success: true,
      message: 'Available menu items retrieved successfully',
      data: items,
    });
  });

  /**
   * Create a new menu item.
   * POST /api/v1/menu-items
   */
  createMenuItem = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { code, categoryId, name, shortCode, description, price, image, isAvailable, displayOrder } = req.body;
    const item = await this.menuItemService.createMenuItem({
      code,
      categoryId: Number(categoryId),
      name,
      shortCode,
      description,
      price: Number(price), // ensure numeric
      image,
      isAvailable,
      displayOrder,
    });
    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: item,
    });
  });

  /**
   * Update an existing menu item.
   * PUT /api/v1/menu-items/:id
   */
  updateMenuItem = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const { code, categoryId, name, shortCode, description, price, image, isAvailable, displayOrder } = req.body;
    const item = await this.menuItemService.updateMenuItem(id, {
      code,
      categoryId: categoryId !== undefined ? Number(categoryId) : undefined,
      name,
      shortCode,
      description,
      price: price !== undefined ? Number(price) : undefined, // ensure numeric
      image,
      isAvailable,
      displayOrder,
    });
    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: item,
    });
  });

  /**
   * Delete an existing menu item.
   * DELETE /api/v1/menu-items/:id
   */
  deleteMenuItem = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const item = await this.menuItemService.deleteMenuItem(id);
    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully',
      data: item,
    });
  });

  /**
   * Toggle availability of a menu item.
   * PATCH /api/v1/menu-items/:id/toggle-availability
   */
  toggleAvailability = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const item = await this.menuItemService.toggleMenuItemAvailability(id);
    res.status(200).json({
      success: true,
      message: 'Menu item availability toggled successfully',
      data: item,
    });
  });
}
