import { z } from 'zod';

/**
 * Zod validation schema for creating a Category
 */
export const createCategorySchema = z.object({
  body: z.object({
    code: z.string({
      required_error: 'Category code is required',
    }).trim().toUpperCase().min(1, 'Category code cannot be empty').max(50, 'Category code is too long'),
    name: z.string({
      required_error: 'Category name is required',
    }).trim().min(1, 'Category name cannot be empty').max(100, 'Category name is too long'),
    displayOrder: z.number().int().nonnegative('Display order must be a non-negative integer').optional(),
    isActive: z.boolean().optional(),
  }),
});

/**
 * Zod validation schema for updating a Category
 */
export const updateCategorySchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive('Invalid category ID format'),
  }),
  body: z.object({
    code: z.string().trim().toUpperCase().min(1, 'Category code cannot be empty').max(50, 'Category code is too long').optional(),
    name: z.string().trim().min(1, 'Category name cannot be empty').max(100, 'Category name is too long').optional(),
    displayOrder: z.number().int().nonnegative('Display order must be a non-negative integer').optional(),
    isActive: z.boolean().optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field (code, name, displayOrder, isActive) must be provided to update',
  }),
});

/**
 * Zod validation schema for fetching a Category by ID
 */
export const getCategoryByIdSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive('Invalid category ID format'),
  }),
});

/**
 * Zod validation schema for deleting a Category
 */
export const deleteCategorySchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive('Invalid category ID format'),
  }),
});
