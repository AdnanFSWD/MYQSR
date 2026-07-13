import { Router } from 'express';
import { CategoryController } from './category.controller';
import { validate } from '../../../shared/middleware/validate.middleware';
import {
  createCategorySchema,
  updateCategorySchema,
  getCategoryByIdSchema,
  deleteCategorySchema,
} from './category.validation';

const router = Router();
const controller = new CategoryController();

// GET /api/v1/categories - Retrieve all categories
// POST /api/v1/categories - Create a new category
router.route('/')
  .get(controller.getCategories)
  .post(validate(createCategorySchema), controller.createCategory);

// GET /api/v1/categories/:id - Retrieve category by ID
// PUT /api/v1/categories/:id - Update category by ID
// DELETE /api/v1/categories/:id - Delete category by ID
router.route('/:id')
  .get(validate(getCategoryByIdSchema), controller.getCategoryById)
  .put(validate(updateCategorySchema), controller.updateCategory)
  .delete(validate(deleteCategorySchema), controller.deleteCategory);

export default router;
