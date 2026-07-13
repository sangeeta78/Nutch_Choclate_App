import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';
import { slugify } from '../utils/helpers.js';

// @desc    List all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json({ success: true, categories });
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Admin
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, image } = req.body;
  const category = await Category.create({
    name,
    slug: slugify(name),
    description,
    image,
  });
  res.status(201).json({ success: true, category });
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Admin
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  const { name, description, image } = req.body;
  if (name) {
    category.name = name;
    category.slug = slugify(name);
  }
  if (description !== undefined) category.description = description;
  if (image !== undefined) category.image = image;

  const updated = await category.save();
  res.json({ success: true, category: updated });
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Admin
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  await category.deleteOne();
  res.json({ success: true, message: 'Category removed' });
});
