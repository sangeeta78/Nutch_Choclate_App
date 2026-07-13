import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import { slugify } from '../utils/helpers.js';

// @desc    List products with search / filter / sort / pagination
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const { keyword, category, sort, page = 1, limit = 12, minPrice, maxPrice } = req.query;

  const query = {};

  if (keyword) {
    query.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ];
  }
  if (category && category !== 'All') query.category = category;

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Sorting
  let sortOption = { createdAt: -1 };
  if (sort === 'price-asc') sortOption = { price: 1 };
  else if (sort === 'price-desc') sortOption = { price: -1 };
  else if (sort === 'rating') sortOption = { rating: -1 };

  const pageNum = Number(page);
  const perPage = Number(limit);
  const total = await Product.countDocuments(query);

  const products = await Product.find(query)
    .sort(sortOption)
    .skip((pageNum - 1) * perPage)
    .limit(perPage);

  res.json({
    success: true,
    products,
    page: pageNum,
    pages: Math.ceil(total / perPage),
    total,
  });
});

// @desc    Get featured products for the home page
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ featured: true }).limit(8);
  res.json({ success: true, products });
});

// @desc    Get a single product by id
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, product });
});

// @desc    Get related products (same category, excluding current)
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  }).limit(4);
  res.json({ success: true, products: related });
});

// @desc    Add a review to a product
// @route   POST /api/products/:id/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  product.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  });
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ success: true, message: 'Review added', product });
});

/* --------------------------- Admin actions --------------------------- */

// @desc    Create a product
// @route   POST /api/products
// @access  Admin
export const createProduct = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (data.name) data.slug = slugify(data.name);

  // Merge uploaded files (if any) into the images array
  if (req.files?.length) {
    const uploaded = req.files.map((f) => `/uploads/${f.filename}`);
    data.images = [...(data.images || []), ...uploaded];
  }

  const product = await Product.create(data);
  res.status(201).json({ success: true, product });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const fields = [
    'name', 'category', 'description', 'ingredients', 'weight',
    'shelfLife', 'price', 'discount', 'stock', 'featured', 'images',
  ];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) product[f] = req.body[f];
  });
  if (req.body.name) product.slug = slugify(req.body.name);

  if (req.files?.length) {
    const uploaded = req.files.map((f) => `/uploads/${f.filename}`);
    product.images = [...product.images, ...uploaded];
  }

  const updated = await product.save();
  res.json({ success: true, product: updated });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  res.json({ success: true, message: 'Product removed' });
});
