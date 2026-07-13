import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { generateOrderId } from '../utils/helpers.js';

// Simple in-code coupon table (percentage discounts)
const COUPONS = {
  SWEET10: 10,
  COCOA20: 20,
  FESTIVE25: 25,
};

const DELIVERY_CHARGE = 49; // flat delivery charge
const GST_RATE = 0.05; // 5% GST
const FREE_DELIVERY_THRESHOLD = 999;

/**
 * Recompute totals server-side from the cart items so the client can never
 * dictate prices. Returns a fully-priced order breakdown.
 */
const priceOrder = async (items, couponCode) => {
  let itemsTotal = 0;
  const pricedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) throw new Error(`Product not found: ${item.product}`);
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }
    const unitPrice = product.finalPrice; // price after product-level discount
    itemsTotal += unitPrice * item.quantity;
    pricedItems.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0] || '',
      price: unitPrice,
      quantity: item.quantity,
    });
  }

  // Coupon discount
  let discount = 0;
  let appliedCoupon = '';
  if (couponCode && COUPONS[couponCode.toUpperCase()]) {
    appliedCoupon = couponCode.toUpperCase();
    discount = Math.round((itemsTotal * COUPONS[appliedCoupon]) / 100);
  }

  const taxable = itemsTotal - discount;
  const deliveryCharge = taxable >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const gst = Math.round(taxable * GST_RATE);
  const grandTotal = taxable + deliveryCharge + gst;

  return {
    items: pricedItems,
    itemsTotal,
    discount,
    couponCode: appliedCoupon,
    deliveryCharge,
    gst,
    grandTotal,
  };
};

// @desc    Validate a coupon and preview totals
// @route   POST /api/orders/preview
// @access  Private
export const previewOrder = asyncHandler(async (req, res) => {
  const { items, couponCode } = req.body;
  if (!items?.length) {
    res.status(400);
    throw new Error('Cart is empty');
  }
  const pricing = await priceOrder(items, couponCode);
  res.json({ success: true, pricing });
});

// @desc    Create an order (payment pending)
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shipping, couponCode } = req.body;

  if (!items?.length) {
    res.status(400);
    throw new Error('Cart is empty');
  }
  if (!shipping) {
    res.status(400);
    throw new Error('Shipping details are required');
  }

  const pricing = await priceOrder(items, couponCode);

  const order = await Order.create({
    orderId: generateOrderId(),
    user: req.user._id,
    items: pricing.items,
    shipping,
    itemsTotal: pricing.itemsTotal,
    deliveryCharge: pricing.deliveryCharge,
    gst: pricing.gst,
    discount: pricing.discount,
    couponCode: pricing.couponCode,
    grandTotal: pricing.grandTotal,
  });

  res.status(201).json({ success: true, order });
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

// @desc    Get a single order (owner or admin)
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  const isOwner = order.user._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }
  res.json({ success: true, order });
});

// @desc    Cancel own order (only if not shipped)
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }
  if (['Shipped', 'Delivered', 'Cancelled'].includes(order.orderStatus)) {
    res.status(400);
    throw new Error(`Cannot cancel an order that is ${order.orderStatus}`);
  }
  order.orderStatus = 'Cancelled';
  await order.save();
  res.json({ success: true, order });
});
