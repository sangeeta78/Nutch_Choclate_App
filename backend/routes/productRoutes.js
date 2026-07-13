import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';
import {
  getProducts,
  getFeaturedProducts,
  getProductById,
  getRelatedProducts,
  createReview,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);
router.get('/:id/related', getRelatedProducts);

router.post('/:id/reviews', protect, createReview);

// Admin management (accepts up to 5 uploaded images under field name "images")
router.post('/', protect, admin, upload.array('images', 5), createProduct);
router.put('/:id', protect, admin, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;
