import { Request, Response } from 'express';
import { CategoryService } from './category.service';
import { catchAsync } from '../../../shared/utils/catchAsync';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  /**
   * Retrieve all categories.
   * GET /api/v1/categories
   */
  getCategories = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const categories = await this.categoryService.getAllCategories();
    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categories,
    });
  });

  /**
   * Retrieve a category by its ID.
   * GET /api/v1/categories/:id
   */
  getCategoryById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const category = await this.categoryService.getCategoryById(id);
    res.status(200).json({
      success: true,
      message: 'Category retrieved successfully',
      data: category,
    });
  });

  /**
   * Create a new category.
   * POST /api/v1/categories
   */
  createCategory = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { code, name, displayOrder, isActive } = req.body;
    const category = await this.categoryService.createCategory({ code, name, displayOrder, isActive });
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  });

  /**
   * Update an existing category.
   * PUT /api/v1/categories/:id
   */
  updateCategory = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const { code, name, displayOrder, isActive } = req.body;
    const category = await this.categoryService.updateCategory(id, { code, name, displayOrder, isActive });
    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  });

  /**
   * Delete an existing category.
   * DELETE /api/v1/categories/:id
   */
  deleteCategory = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const category = await this.categoryService.deleteCategory(id);
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data: category,
    });
  });
}
