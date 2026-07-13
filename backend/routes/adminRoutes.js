import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getCustomers,
  getCustomerOrders,
} from '../controllers/adminController.js';

const router = express.Router();

router.use(protect, admin); // everything here is admin-only

router.get('/stats', getDashboardStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/customers', getCustomers);
router.get('/customers/:id/orders', getCustomerOrders);

export default router;
