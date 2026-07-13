import { z } from 'zod';

/**
 * Zod validation schema for creating a MenuItem
 */
export const createMenuItemSchema = z.object({
  body: z.object({
    code: z.string({
      required_error: 'Code is required',
    }).trim().toUpperCase().min(1, 'Code cannot be empty').max(50, 'Code is too long'),
    categoryId: z.number({
      required_error: 'Category ID is required',
    }).int().positive('Invalid Category ID format'),
    name: z.string({
      required_error: 'Menu item name is required',
    }).trim().min(1, 'Menu item name cannot be empty').max(100, 'Menu item name is too long'),
    shortCode: z.string({
      required_error: 'Short code is required',
    }).trim().min(1, 'Short code cannot be empty').max(10, 'Short code is too long (max 10 characters)'),
    description: z.string().trim().max(500, 'Description is too long').optional().nullable(),
    price: z.number({
      required_error: 'Price is required',
    }).positive('Price must be a positive number'),
    image: z.string().trim().max(255, 'Image filename is too long').optional().nullable(),
    isAvailable: z.boolean().optional(),
    displayOrder: z.number().int().nonnegative('Display order must be a non-negative integer').optional(),
  }),
});

/**
 * Zod validation schema for updating a MenuItem
 */
export const updateMenuItemSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive('Invalid menu item ID format'),
  }),
  body: z.object({
    code: z.string().trim().toUpperCase().min(1, 'Code cannot be empty').max(50, 'Code is too long').optional(),
    categoryId: z.number().int().positive('Invalid Category ID format').optional(),
    name: z.string().trim().min(1, 'Menu item name cannot be empty').max(100, 'Menu item name is too long').optional(),
    shortCode: z.string().trim().min(1, 'Short code cannot be empty').max(10, 'Short code is too long (max 10 characters)').optional(),
    description: z.string().trim().max(500, 'Description is too long').optional().nullable(),
    price: z.number().positive('Price must be a positive number').optional(),
    image: z.string().trim().max(255, 'Image filename is too long').optional().nullable(),
    isAvailable: z.boolean().optional(),
    displayOrder: z.number().int().nonnegative('Display order must be a non-negative integer').optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update',
  }),
});

/**
 * Zod validation schema for fetching a MenuItem by ID
 */
export const getMenuItemByIdSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive('Invalid menu item ID format'),
  }),
});

/**
 * Zod validation schema for fetching MenuItems by Category ID
 */
export const getByCategorySchema = z.object({
  params: z.object({
    categoryId: z.coerce.number().int().positive('Invalid Category ID format'),
  }),
});

/**
 * Zod validation schema for deleting a MenuItem
 */
export const deleteMenuItemSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive('Invalid menu item ID format'),
  }),
});

/**
 * Zod validation schema for toggling MenuItem availability
 */
export const toggleAvailabilitySchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive('Invalid menu item ID format'),
  }),
});
