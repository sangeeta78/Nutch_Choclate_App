import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  previewOrder,
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} from '../controllers/orderController.js';

const router = express.Router();

router.use(protect); // all order routes require auth

router.post('/preview', previewOrder);
router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

export default router;
