import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getProfile,
  updateProfile,
  getWishlist,
  toggleWishlist,
  addRecentlyViewed,
  getRecentlyViewed,
} from '../controllers/userController.js';

const router = express.Router();

router.use(protect); // all user routes require auth

router.route('/profile').get(getProfile).put(updateProfile);

router.get('/wishlist', getWishlist);
router.post('/wishlist/:productId', toggleWishlist);

router.get('/recently-viewed', getRecentlyViewed);
router.post('/recently-viewed/:productId', addRecentlyViewed);

export default router;
