import { Router } from 'express';
import { SolutionController } from '../controllers/solution.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { z } from 'zod';

const router = Router();
const solutionController = new SolutionController();

// Public routes (GET requests are public)
router.get('/', solutionController.getAllSolutions.bind(solutionController));
router.get('/:id', solutionController.getSolutionById.bind(solutionController));

// Admin routes
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(z.object({
    body: z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      subtitle: z.string().optional(),
      description: z.string().optional(),
      highlights: z.array(z.string()).optional(),
      architecture: z.string().optional(),
      imageUrl: z.string().optional(),
      features: z.array(z.string()).optional(),
      benefits: z.array(z.object({
        title: z.string(),
        description: z.string().optional(),
        icon: z.string().optional(),
      })).optional(),
    }),
  })),
  solutionController.createSolution.bind(solutionController)
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  solutionController.updateSolution.bind(solutionController)
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  solutionController.deleteSolution.bind(solutionController)
);

export default router;
