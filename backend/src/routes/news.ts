import { Router } from 'express';
import { NewsController } from '../controllers/news.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
const newsController = new NewsController();

// Public routes (GET requests are public)
router.get('/', newsController.getAllNews.bind(newsController));
router.get('/:id', newsController.getNewsById.bind(newsController));

// Admin routes
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  newsController.createNews.bind(newsController)
);
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  newsController.updateNews.bind(newsController)
);
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  newsController.deleteNews.bind(newsController)
);
router.patch(
  '/:id/publish',
  authenticate,
  authorize('ADMIN'),
  newsController.togglePublish.bind(newsController)
);

export default router;
