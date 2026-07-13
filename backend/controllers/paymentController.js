import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Product from '../models/Product.js';
import { generateTransactionId, sendMockEmail } from '../utils/helpers.js';

// @desc    Simulate processing a payment for an order.
//          NOTE: This is a DUMMY gateway - no real provider is contacted.
// @route   POST /api/payments/process
// @access  Private
export const processPayment = asyncHandler(async (req, res) => {
  const { orderId, method, provider } = req.body;

  const validMethods = ['UPI', 'Net Banking', 'Credit Card', 'Debit Card', 'Wallet'];
  if (!validMethods.includes(method)) {
    res.status(400);
    throw new Error('Invalid payment method');
  }

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized for this order');
  }
  if (order.paymentStatus === 'Paid') {
    res.status(400);
    throw new Error('This order is already paid');
  }

  // --- Simulated success (always succeeds in this demo) ---
  const transactionId = generateTransactionId();

  // Create the payment record
  const payment = await Payment.create({
    order: order._id,
    user: req.user._id,
    transactionId,
    method,
    provider: provider || '',
    amount: order.grandTotal,
    status: 'Success',
  });

  // Update the order
  order.paymentStatus = 'Paid';
  order.transactionId = transactionId;
  order.paymentMethod = method;
  order.orderStatus = 'Processing';
  const eta = new Date();
  eta.setDate(eta.getDate() + 5); // estimated delivery in 5 days
  order.estimatedDelivery = eta;
  await order.save();

  // Decrement stock for each purchased item
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  // Mock order-confirmation email
  await sendMockEmail({
    to: order.shipping.email,
    subject: `Order Confirmed - ${order.orderId}`,
    body: `Thank you! Your payment of ₹${order.grandTotal} was successful. Transaction: ${transactionId}.`,
  });

  res.json({
    success: true,
    message: 'Payment successful',
    payment: {
      transactionId,
      method,
      amount: order.grandTotal,
      status: 'Success',
    },
    order,
  });
});
