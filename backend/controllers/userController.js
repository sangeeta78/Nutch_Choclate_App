import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @desc    Get current user's profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json({ success: true, user });
});

// @desc    Update profile (name, mobile, address, password)
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { name, mobile, address, password } = req.body;
  if (name) user.name = name;
  if (mobile) user.mobile = mobile;
  if (address) user.address = { ...user.address, ...address };
  if (password) user.password = password; // re-hashed by pre-save hook

  const updated = await user.save();
  res.json({
    success: true,
    user: {
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      mobile: updated.mobile,
      role: updated.role,
      address: updated.address,
    },
  });
});

/* ----------------------------- Wishlist ----------------------------- */

// @desc    Get wishlist products
// @route   GET /api/users/wishlist
// @access  Private
export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json({ success: true, wishlist: user.wishlist });
});

// @desc    Toggle a product in the wishlist
// @route   POST /api/users/wishlist/:productId
// @access  Private
export const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { productId } = req.params;

  const index = user.wishlist.findIndex((id) => id.toString() === productId);
  let added;
  if (index === -1) {
    user.wishlist.push(productId);
    added = true;
  } else {
    user.wishlist.splice(index, 1);
    added = false;
  }
  await user.save();
  res.json({ success: true, added, wishlist: user.wishlist });
});

/* -------------------------- Recently viewed ------------------------- */

// @desc    Record a recently viewed product (capped at 8)
// @route   POST /api/users/recently-viewed/:productId
// @access  Private
export const addRecentlyViewed = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { productId } = req.params;

  user.recentlyViewed = [
    productId,
    ...user.recentlyViewed.filter((id) => id.toString() !== productId),
  ].slice(0, 8);

  await user.save();
  res.json({ success: true });
});

// @desc    Get recently viewed products
// @route   GET /api/users/recently-viewed
// @access  Private
export const getRecentlyViewed = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('recentlyViewed');
  res.json({ success: true, products: user.recentlyViewed });
});
