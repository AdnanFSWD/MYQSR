import { CategoryRepository } from './category.repository';
import { Category } from '@prisma/client';
import { NotFoundError, ConflictError, BadRequestError } from '../../../shared/utils/errors';

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  /**
   * Get all categories
   */
  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.getAll();
  }

  /**
   * Get a category by its ID
   */
  async getCategoryById(id: number): Promise<Category> {
    const category = await this.categoryRepository.getById(id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }
    // Destructure to omit relational counts before returning the Category object
    const { _count, ...categoryData } = category;
    return categoryData;
  }

  /**
   * Create a new category
   */
  async createCategory(data: { code: string; name: string; displayOrder?: number; isActive?: boolean }): Promise<Category> {
    // Check for duplicate code
    const existingCode = await this.categoryRepository.getByCode(data.code);
    if (existingCode) {
      throw new ConflictError(`Category with code "${data.code}" already exists`);
    }

    // Check for duplicate name
    const existingName = await this.categoryRepository.getByName(data.name);
    if (existingName) {
      throw new ConflictError(`Category with name "${data.name}" already exists`);
    }

    return this.categoryRepository.create({
      code: data.code,
      name: data.name,
      displayOrder: data.displayOrder ?? 0,
      isActive: data.isActive ?? true,
    });
  }

  /**
   * Update an existing category
   */
  async updateCategory(id: number, data: { code?: string; name?: string; displayOrder?: number; isActive?: boolean }): Promise<Category> {
    // Check if category exists
    const category = await this.categoryRepository.getById(id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    // Check for duplicate code if being changed
    if (data.code && data.code !== category.code) {
      const existing = await this.categoryRepository.getByCode(data.code);
      if (existing && existing.id !== id) {
        throw new ConflictError(`Category with code "${data.code}" already exists`);
      }
    }

    // Check for duplicate name if the name is being changed
    if (data.name && data.name !== category.name) {
      const existing = await this.categoryRepository.getByName(data.name);
      if (existing && existing.id !== id) {
        throw new ConflictError(`Category with name "${data.name}" already exists`);
      }
    }

    return this.categoryRepository.update(id, data);
  }

  /**
   * Delete an existing category
   */
  async deleteCategory(id: number): Promise<Category> {
    // Check if category exists
    const category = await this.categoryRepository.getById(id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    // Check if category contains associated menu items
    if (category._count.menuItems > 0) {
      throw new BadRequestError('Cannot delete category because it has associated menu items');
    }

    return this.categoryRepository.delete(id);
  }
}
