import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    transactionId: { type: String, required: true, unique: true },
    method: {
      type: String,
      enum: ['UPI', 'Net Banking', 'Credit Card', 'Debit Card', 'Wallet'],
      required: true,
    },
    // Provider-specific meta captured from the dummy gateway
    provider: { type: String, default: '' }, // e.g. bank name, wallet name
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Success', 'Failed', 'Pending'],
      default: 'Success',
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
