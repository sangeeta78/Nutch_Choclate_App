import mongoose from 'mongoose';

// Embedded review sub-document
const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    slug: { type: String, lowercase: true, index: true },
    category: {
      type: String,
      required: true,
      enum: ['Homemade Chocolates', 'Dry Fruits', 'Nuts', 'Gift Boxes'],
    },
    description: { type: String, required: true },
    ingredients: { type: String, default: '' },
    weight: { type: String, default: '' }, // e.g. "250g"
    shelfLife: { type: String, default: '' }, // e.g. "3 months"
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 }, // percentage
    stock: { type: Number, required: true, default: 0, min: 0 },
    images: [{ type: String }], // array of image URLs / data paths
    featured: { type: Boolean, default: false },

    reviews: [reviewSchema],
    rating: { type: Number, default: 0 }, // average rating
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text index powers keyword search on name + description
productSchema.index({ name: 'text', description: 'text' });

// Virtual: price after discount
productSchema.virtual('finalPrice').get(function () {
  return Math.round(this.price - (this.price * this.discount) / 100);
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
