import { prisma } from '../../../prisma/client';
import { MenuItem, Prisma } from '@prisma/client';

export class MenuItemRepository {
  /**
   * Retrieve all menu items sorted by displayOrder ASC, then name ASC.
   * Includes the category name.
   */
  async getAll(): Promise<MenuItem[]> {
    return prisma.menuItem.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' },
      ],
    });
  }

  /**
   * Retrieve a menu item by ID.
   */
  async getById(id: number): Promise<MenuItem | null> {
    return prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  /**
   * Retrieve all menu items belonging to a category, sorted by displayOrder ASC, then name ASC.
   */
  async getByCategory(categoryId: number): Promise<MenuItem[]> {
    return prisma.menuItem.findMany({
      where: { categoryId },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' },
      ],
    });
  }

  /**
   * Retrieve all available menu items (isAvailable: true), sorted by displayOrder ASC, then name ASC.
   */
  async getAvailable(): Promise<MenuItem[]> {
    return prisma.menuItem.findMany({
      where: { isAvailable: true },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' },
      ],
    });
  }

  /**
   * Retrieve a menu item by name within a specific category (checks unique constraint).
   */
  async getByNameAndCategory(name: string, categoryId: number): Promise<MenuItem | null> {
    return prisma.menuItem.findUnique({
      where: {
        categoryId_name: {
          categoryId,
          name,
        },
      },
    });
  }

  /**
   * Retrieve a menu item by its shortCode.
   */
  async getByShortCode(shortCode: string): Promise<MenuItem | null> {
    return prisma.menuItem.findUnique({
      where: { shortCode },
    });
  }

  /**
   * Retrieve a menu item by its code.
   */
  async getByCode(code: string): Promise<MenuItem | null> {
    return prisma.menuItem.findUnique({
      where: { code },
    });
  }

  /**
   * Create a new menu item.
   */
  async create(data: Prisma.MenuItemUncheckedCreateInput): Promise<MenuItem> {
    return prisma.menuItem.create({
      data,
    });
  }

  /**
   * Update an existing menu item.
   */
  async update(id: number, data: Prisma.MenuItemUncheckedUpdateInput): Promise<MenuItem> {
    return prisma.menuItem.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete an existing menu item.
   */
  async delete(id: number): Promise<MenuItem> {
    return prisma.menuItem.delete({
      where: { id },
    });
  }

  /**
   * Toggle the availability status of a menu item.
   */
  async toggleAvailability(id: number, isAvailable: boolean): Promise<MenuItem> {
    return prisma.menuItem.update({
      where: { id },
      data: { isAvailable },
    });
  }
}
