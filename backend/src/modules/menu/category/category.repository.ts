import { prisma } from '../../../prisma/client';
import { Category, Prisma } from '@prisma/client';

export class CategoryRepository {
  /**
   * Retrieve all categories ordered by displayOrder ascending
   */
  async getAll(): Promise<Category[]> {
    return prisma.category.findMany({
      orderBy: {
        displayOrder: 'asc',
      },
    });
  }

  /**
   * Retrieve a category by its ID, including the count of associated menu items.
   */
  async getById(id: number) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { menuItems: true },
        },
      },
    });
  }

  /**
   * Retrieve a category by its name (exact match)
   */
  async getByName(name: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { name },
    });
  }

  /**
   * Retrieve a category by its unique code (exact match)
   */
  async getByCode(code: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { code },
    });
  }

  /**
   * Create a new category
   */
  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return prisma.category.create({
      data,
    });
  }

  /**
   * Update an existing category
   */
  async update(id: number, data: Prisma.CategoryUpdateInput): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a category
   */
  async delete(id: number): Promise<Category> {
    return prisma.category.delete({
      where: { id },
    });
  }
}
