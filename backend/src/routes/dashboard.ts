import express from 'express';
import * as dashboardController from '../controllers/dashboardController';

const router = express.Router();

router.get('/stats', dashboardController.getQuickStats);
router.get('/conversion', dashboardController.getConversionData);
router.get('/trends', dashboardController.getTrendData);
router.get('/products/rank', dashboardController.getProductRanking);
router.get('/tasks', dashboardController.getPendingTasks);
router.patch('/tasks/:id', dashboardController.updateTaskStatus);

export default router;
