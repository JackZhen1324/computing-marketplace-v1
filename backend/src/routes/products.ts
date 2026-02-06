import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { z } from 'zod';

const router = Router();
const productController = new ProductController();

// Validation schemas
const createProductSchema = z.object({
  body: z.object({
    id: z.string().min(1),
    categoryId: z.string().min(1),
    name: z.string().min(1),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    priceDisplay: z.string().optional(),
    source: z.string().optional(),
    region: z.string().optional(),
    tags: z.array(z.string()).optional(),
    cpuMemoryRatio: z.string().optional(),
    vcpuRange: z.string().optional(),
    baseFreq: z.string().optional(),
    features: z.array(z.string()).optional(),
    specifications: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })).optional(),
    pricing: z.array(z.object({
      plan: z.string(),
      price: z.string(),
      features: z.array(z.string()),
    })).optional(),
    useCases: z.array(z.string()).optional(),
  }),
});

const updateProductSchema = z.object({
  body: z.object({
    categoryId: z.string().optional(),
    name: z.string().optional(),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    priceDisplay: z.string().optional(),
    source: z.string().optional(),
    region: z.string().optional(),
    tags: z.array(z.string()).optional(),
    cpuMemoryRatio: z.string().optional(),
    vcpuRange: z.string().optional(),
    baseFreq: z.string().optional(),
    isActive: z.boolean().optional(),
    features: z.array(z.string()).optional(),
    specifications: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })).optional(),
    pricing: z.array(z.object({
      plan: z.string(),
      price: z.string(),
      features: z.array(z.string()),
    })).optional(),
    useCases: z.array(z.string()).optional(),
  }),
});

// Public routes (no auth required) - GET requests are public
router.get('/', productController.getAllProducts.bind(productController));
router.get('/:id', productController.getProductById.bind(productController));

// Admin routes (require auth and admin role)
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(createProductSchema),
  productController.createProduct.bind(productController)
);
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateProductSchema),
  productController.updateProduct.bind(productController)
);
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  productController.deleteProduct.bind(productController)
);
router.patch(
  '/:id/status',
  authenticate,
  authorize('ADMIN'),
  productController.toggleProductStatus.bind(productController)
);

export default router;
