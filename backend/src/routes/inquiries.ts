import { Router } from 'express';
import { InquiryController } from '../controllers/inquiry.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
const inquiryController = new InquiryController();

// Public route - submit inquiry without login
router.post('/', inquiryController.createInquiry.bind(inquiryController));

// Protected routes - require authentication
router.get('/', authenticate, inquiryController.getAllInquiries.bind(inquiryController));
router.get('/:id', authenticate, inquiryController.getInquiryById.bind(inquiryController));

// Sales/Admin routes
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'SALES'),
  inquiryController.updateInquiry.bind(inquiryController)
);
router.patch(
  '/:id/status',
  authenticate,
  authorize('ADMIN', 'SALES'),
  inquiryController.updateStatus.bind(inquiryController)
);
router.patch(
  '/:id/assign',
  authenticate,
  authorize('ADMIN', 'SALES'),
  inquiryController.assignInquiry.bind(inquiryController)
);
router.post(
  '/:id/notes',
  authenticate,
  authorize('ADMIN', 'SALES'),
  inquiryController.addNote.bind(inquiryController)
);

export default router;
