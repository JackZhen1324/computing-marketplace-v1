import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { z } from 'zod';

const router = Router();
const categoryController = new CategoryController();

// Validation schemas
const createCategorySchema = z.object({
  body: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    nameEn: z.string().optional(),
    description: z.string().optional(),
    iconUrl: z.string().optional(),
    displayOrder: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
  }),
});

const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    nameEn: z.string().optional(),
    description: z.string().optional(),
    iconUrl: z.string().optional(),
    displayOrder: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
  }),
});

// Public routes - GET requests are public
router.get('/', categoryController.getAllCategories.bind(categoryController));
router.get('/:id', categoryController.getCategoryById.bind(categoryController));

// Admin routes (require auth and admin role)
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(createCategorySchema),
  categoryController.createCategory.bind(categoryController)
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateCategorySchema),
  categoryController.updateCategory.bind(categoryController)
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  categoryController.deleteCategory.bind(categoryController)
);

router.patch(
  '/:id/status',
  authenticate,
  authorize('ADMIN'),
  categoryController.toggleCategoryStatus.bind(categoryController)
);

export default router;
