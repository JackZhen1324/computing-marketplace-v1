import { Router } from 'express';
import { NavigationController } from '../controllers/navigation.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
const navigationController = new NavigationController();

// Public routes
router.get('/', navigationController.getNavigation.bind(navigationController));

// Admin routes
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  navigationController.createNavigationItem.bind(navigationController)
);
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  navigationController.updateNavigationItem.bind(navigationController)
);
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  navigationController.deleteNavigationItem.bind(navigationController)
);

export default router;
