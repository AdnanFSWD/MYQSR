import { MenuItemRepository } from './menuItem.repository';
import { CategoryRepository } from '../category/category.repository';
import { MenuItem } from '@prisma/client';
import { NotFoundError, ConflictError } from '../../../shared/utils/errors';

export class MenuItemService {
  private menuItemRepository: MenuItemRepository;
  private categoryRepository: CategoryRepository;

  constructor() {
    this.menuItemRepository = new MenuItemRepository();
    this.categoryRepository = new CategoryRepository();
  }

  /**
   * Retrieve all menu items.
   */
  async getAllMenuItems(): Promise<MenuItem[]> {
    return this.menuItemRepository.getAll();
  }

  /**
   * Retrieve a menu item by ID.
   */
  async getMenuItemById(id: number): Promise<MenuItem> {
    const menuItem = await this.menuItemRepository.getById(id);
    if (!menuItem) {
      throw new NotFoundError('Menu item not found');
    }
    return menuItem;
  }

  /**
   * Retrieve all menu items belonging to a category.
   */
  async getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]> {
    const category = await this.categoryRepository.getById(categoryId);
    if (!category) {
      throw new NotFoundError('Category not found');
    }
    return this.menuItemRepository.getByCategory(categoryId);
  }

  /**
   * Retrieve all available menu items.
   */
  async getAvailableMenuItems(): Promise<MenuItem[]> {
    return this.menuItemRepository.getAvailable();
  }

  /**
   * Create a new menu item.
   */
  async createMenuItem(data: {
    code: string;
    categoryId: number;
    name: string;
    shortCode: string;
    description?: string | null;
    price: number;
    image?: string | null;
    isAvailable?: boolean;
    displayOrder?: number;
  }): Promise<MenuItem> {
    // 1. Validate category exists
    const category = await this.categoryRepository.getById(data.categoryId);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    // 2. Prevent duplicate code
    const existingCode = await this.menuItemRepository.getByCode(data.code);
    if (existingCode) {
      throw new ConflictError(`Menu item with code "${data.code}" already exists`);
    }

    // 3. Prevent duplicate shortCode
    const existingShortCode = await this.menuItemRepository.getByShortCode(data.shortCode);
    if (existingShortCode) {
      throw new ConflictError(`Menu item with short code "${data.shortCode}" already exists`);
    }

    // 4. Prevent duplicate name in the same category
    const existingName = await this.menuItemRepository.getByNameAndCategory(data.name, data.categoryId);
    if (existingName) {
      throw new ConflictError(`Menu item with name "${data.name}" already exists in this category`);
    }

    return this.menuItemRepository.create({
      code: data.code,
      categoryId: data.categoryId,
      name: data.name,
      shortCode: data.shortCode,
      description: data.description ?? null,
      price: data.price,
      image: data.image ?? null,
      isAvailable: data.isAvailable ?? true,
      displayOrder: data.displayOrder ?? 0,
    });
  }

  /**
   * Update an existing menu item.
   */
  async updateMenuItem(id: number, data: {
    code?: string;
    categoryId?: number;
    name?: string;
    shortCode?: string;
    description?: string | null;
    price?: number;
    image?: string | null;
    isAvailable?: boolean;
    displayOrder?: number;
  }): Promise<MenuItem> {
    // 1. Verify menu item exists
    const menuItem = await this.menuItemRepository.getById(id);
    if (!menuItem) {
      throw new NotFoundError('Menu item not found');
    }

    // 2. Validate category if changing it
    const targetCategoryId = data.categoryId ?? menuItem.categoryId;
    if (data.categoryId && data.categoryId !== menuItem.categoryId) {
      const category = await this.categoryRepository.getById(data.categoryId);
      if (!category) {
        throw new NotFoundError('Category not found');
      }
    }

    // 3. Prevent duplicate code
    if (data.code && data.code !== menuItem.code) {
      const existingCode = await this.menuItemRepository.getByCode(data.code);
      if (existingCode && existingCode.id !== id) {
        throw new ConflictError(`Menu item with code "${data.code}" already exists`);
      }
    }

    // 4. Prevent duplicate shortCode
    if (data.shortCode && data.shortCode !== menuItem.shortCode) {
      const existingShortCode = await this.menuItemRepository.getByShortCode(data.shortCode);
      if (existingShortCode && existingShortCode.id !== id) {
        throw new ConflictError(`Menu item with short code "${data.shortCode}" already exists`);
      }
    }

    // 5. Prevent duplicate name in target category
    const targetName = data.name ?? menuItem.name;
    if (data.name || data.categoryId) {
      const existingName = await this.menuItemRepository.getByNameAndCategory(targetName, targetCategoryId);
      if (existingName && existingName.id !== id) {
        throw new ConflictError(`Menu item with name "${targetName}" already exists in this category`);
      }
    }

    return this.menuItemRepository.update(id, data);
  }

  /**
   * Delete a menu item.
   */
  async deleteMenuItem(id: number): Promise<MenuItem> {
    const menuItem = await this.menuItemRepository.getById(id);
    if (!menuItem) {
      throw new NotFoundError('Menu item not found');
    }
    return this.menuItemRepository.delete(id);
  }

  /**
   * Toggle the availability status of a menu item.
   */
  async toggleMenuItemAvailability(id: number): Promise<MenuItem> {
    const menuItem = await this.menuItemRepository.getById(id);
    if (!menuItem) {
      throw new NotFoundError('Menu item not found');
    }
    const newStatus = !menuItem.isAvailable;
    return this.menuItemRepository.toggleAvailability(id, newStatus);
  }
}
