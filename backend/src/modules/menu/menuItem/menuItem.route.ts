import { Router } from 'express';
import { MenuItemController } from './menuItem.controller';
import { validate } from '../../../shared/middleware/validate.middleware';
import {
  createMenuItemSchema,
  updateMenuItemSchema,
  getMenuItemByIdSchema,
  getByCategorySchema,
  deleteMenuItemSchema,
  toggleAvailabilitySchema,
} from './menuItem.validation';

const router = Router();
const controller = new MenuItemController();

// GET /api/v1/menu-items - Retrieve all menu items
// POST /api/v1/menu-items - Create a new menu item
router.route('/')
  .get(controller.getMenuItems)
  .post(validate(createMenuItemSchema), controller.createMenuItem);

// GET /api/v1/menu-items/available - Retrieve available items (isAvailable = true)
// Note: Placed before /:id to prevent matching 'available' as an ID parameter.
router.route('/available')
  .get(controller.getAvailableMenuItems);

// GET /api/v1/menu-items/category/:categoryId - Retrieve items by Category ID
// Note: Placed before /:id to prevent matching 'category' as an ID parameter.
router.route('/category/:categoryId')
  .get(validate(getByCategorySchema), controller.getMenuItemsByCategory);

// GET /api/v1/menu-items/:id - Retrieve item by ID
// PUT /api/v1/menu-items/:id - Update item by ID
// DELETE /api/v1/menu-items/:id - Delete item by ID
router.route('/:id')
  .get(validate(getMenuItemByIdSchema), controller.getMenuItemById)
  .put(validate(updateMenuItemSchema), controller.updateMenuItem)
  .delete(validate(deleteMenuItemSchema), controller.deleteMenuItem);

// PATCH /api/v1/menu-items/:id/toggle-availability - Toggle availability
router.route('/:id/toggle-availability')
  .patch(validate(toggleAvailabilitySchema), controller.toggleAvailability);

export default router;
