import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { upload, processImage, processImages } from '../middleware/upload.middleware';

const router = Router();
const uploadController = new UploadController();

// Single image upload (requires auth)
router.post(
  '/image',
  authenticate,
  authorize('ADMIN', 'SALES'),
  upload.single('image'),
  processImage,
  uploadController.uploadSingle.bind(uploadController)
);

// Multiple images upload (requires auth)
router.post(
  '/images',
  authenticate,
  authorize('ADMIN', 'SALES'),
  upload.array('images', 10),
  processImages,
  uploadController.uploadMultiple.bind(uploadController)
);

export default router;
