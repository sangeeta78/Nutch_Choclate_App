import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Dashboard summary stats
// @route   GET /api/admin/stats
// @access  Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalOrders, totalCustomers, products, revenueAgg] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    Product.find({}, 'name stock'),
    Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$grandTotal' } } },
    ]),
  ]);

  const productsInStock = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStock = products.filter((p) => p.stock <= 5);
  const totalRevenue = revenueAgg[0]?.total || 0;

  // Orders grouped by status for a quick pipeline view
  const statusAgg = await Order.aggregate([
    { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
  ]);
  const ordersByStatus = statusAgg.reduce((acc, s) => {
    acc[s._id] = s.count;
    return acc;
  }, {});

  res.json({
    success: true,
    stats: {
      totalOrders,
      totalCustomers,
      totalRevenue,
      productsInStock,
      lowStock,
      ordersByStatus,
    },
  });
});

// @desc    List all orders with optional status filter
// @route   GET /api/admin/orders
// @access  Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = status && status !== 'All' ? { orderStatus: status } : {};
  const orders = await Order.find(query)
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

// @desc    Update an order's status
// @route   PUT /api/admin/orders/:id/status
// @access  Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const valid = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!valid.includes(status)) {
    res.status(400);
    throw new Error('Invalid order status');
  }
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.orderStatus = status;
  await order.save();
  res.json({ success: true, order });
});

// @desc    List customers with optional search
// @route   GET /api/admin/customers
// @access  Admin
export const getCustomers = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const query = { role: 'customer' };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  const customers = await User.find(query).select('-password').sort({ createdAt: -1 });
  res.json({ success: true, customers });
});

// @desc    Get a customer's order history
// @route   GET /api/admin/customers/:id/orders
// @access  Admin
export const getCustomerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.params.id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});
