import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import { slugify } from './helpers.js';

dotenv.config();

// Categories requested in the brief
const categories = [
  {
    name: 'Homemade Chocolates',
    description: 'Small-batch handcrafted chocolates made with love.',
    image:
      'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800&q=80',
  },
  {
    name: 'Dry Fruits',
    description: 'Premium sun-dried fruits, naturally sweet.',
    image:
      'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=800&q=80',
  },
  {
    name: 'Nuts',
    description: 'Freshly roasted, crunchy and wholesome.',
    image:
      'https://images.unsplash.com/photo-1508747703725-719777637510?w=800&q=80',
  },
  {
    name: 'Gift Boxes',
    description: 'Curated assortments for every celebration.',
    image:
      'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=80',
  },
];

// Helper to build image arrays from Unsplash
const img = (id) => `https://images.unsplash.com/${id}?w=800&q=80`;

const products = [
  {
    name: 'Dark Chocolate Truffles',
    category: 'Homemade Chocolates',
    description:
      'Rich 70% dark chocolate truffles with a silky ganache center. Handrolled in cocoa powder.',
    ingredients: 'Cocoa solids, cream, butter, sugar, vanilla',
    weight: '250g',
    shelfLife: '3 months',
    price: 499,
    discount: 10,
    stock: 40,
    featured: true,
    images: [img('photo-1548907040-4baa42d10919'), img('photo-1511381939415-e44015466834')],
    rating: 4.7,
    numReviews: 12,
  },
  {
    name: 'Milk Chocolate Bar',
    category: 'Homemade Chocolates',
    description: 'Creamy, smooth milk chocolate bar made from single-origin cocoa.',
    ingredients: 'Milk, cocoa butter, cocoa solids, sugar',
    weight: '100g',
    shelfLife: '4 months',
    price: 199,
    discount: 0,
    stock: 80,
    featured: true,
    images: [img('photo-1623660053975-cf75a8be0908')],
    rating: 4.5,
    numReviews: 8,
  },
  {
    name: 'Hazelnut Chocolate Spread',
    category: 'Homemade Chocolates',
    description: 'Velvety hazelnut and chocolate spread, no palm oil.',
    ingredients: 'Hazelnuts, cocoa, sugar, milk powder',
    weight: '350g',
    shelfLife: '6 months',
    price: 349,
    discount: 5,
    stock: 25,
    featured: false,
    images: [img('photo-1505253213348-cd54c92b37fb')],
    rating: 4.6,
    numReviews: 5,
  },
  {
    name: 'Premium Almonds',
    category: 'Nuts',
    description: 'California almonds, roasted and lightly salted. Great for snacking.',
    ingredients: 'Almonds, sea salt',
    weight: '500g',
    shelfLife: '9 months',
    price: 599,
    discount: 15,
    stock: 60,
    featured: true,
    images: [img('photo-1508747703725-719777637510')],
    rating: 4.8,
    numReviews: 20,
  },
  {
    name: 'Roasted Cashews',
    category: 'Nuts',
    description: 'Whole jumbo cashews, roasted to golden perfection.',
    ingredients: 'Cashews, sunflower oil, salt',
    weight: '500g',
    shelfLife: '9 months',
    price: 749,
    discount: 10,
    stock: 50,
    featured: true,
    images: [img('photo-1600189261867-8e4a1d7cb91d')],
    rating: 4.7,
    numReviews: 15,
  },
  {
    name: 'Mixed Nuts Trail',
    category: 'Nuts',
    description: 'A wholesome mix of almonds, cashews, walnuts, and pistachios.',
    ingredients: 'Almonds, cashews, walnuts, pistachios',
    weight: '400g',
    shelfLife: '8 months',
    price: 649,
    discount: 0,
    stock: 35,
    featured: false,
    images: [img('photo-1599599810769-bcde5a160d32b')],
    rating: 4.4,
    numReviews: 6,
  },
  {
    name: 'Seedless Dates',
    category: 'Dry Fruits',
    description: 'Soft, juicy Medjool dates. Naturally sweet energy bites.',
    ingredients: 'Dates',
    weight: '500g',
    shelfLife: '12 months',
    price: 399,
    discount: 5,
    stock: 70,
    featured: false,
    images: [img('photo-1601897655071-982a0f6d3d2f')],
    rating: 4.6,
    numReviews: 9,
  },
  {
    name: 'Dried Figs',
    category: 'Dry Fruits',
    description: 'Premium Afghan dried figs, rich in fiber and iron.',
    ingredients: 'Figs',
    weight: '250g',
    shelfLife: '10 months',
    price: 449,
    discount: 0,
    stock: 45,
    featured: true,
    images: [img('photo-1596591606975-97ee5cef3a1e')],
    rating: 4.5,
    numReviews: 7,
  },
  {
    name: 'Assorted Chocolate Gift Box',
    category: 'Gift Boxes',
    description: 'A luxurious box of 16 assorted handmade chocolates. Perfect for gifting.',
    ingredients: 'Assorted chocolates, nuts, caramel',
    weight: '400g',
    shelfLife: '3 months',
    price: 999,
    discount: 20,
    stock: 30,
    featured: true,
    images: [img('photo-1607344645866-009c320b63e0'), img('photo-1549007994-cb92caebd54b')],
    rating: 4.9,
    numReviews: 25,
  },
  {
    name: 'Festive Dry Fruit Hamper',
    category: 'Gift Boxes',
    description: 'Elegant hamper with almonds, cashews, dates, and figs. Ideal for festivals.',
    ingredients: 'Almonds, cashews, dates, figs',
    weight: '1kg',
    shelfLife: '6 months',
    price: 1499,
    discount: 15,
    stock: 20,
    featured: true,
    images: [img('photo-1513558161293-cdaf765ed2fd')],
    rating: 4.8,
    numReviews: 18,
  },
];

const importData = async () => {
  await connectDB();
  try {
    // Clear existing data
    await Promise.all([
      Order.deleteMany(),
      Payment.deleteMany(),
      Product.deleteMany(),
      Category.deleteMany(),
      User.deleteMany(),
    ]);

    // Admin user (password hashed by model pre-save hook)
    await User.create({
      name: 'CocoaCraft Admin',
      email: process.env.ADMIN_EMAIL || 'admin@cocoacraft.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      role: 'admin',
      mobile: '9999999999',
    });

    // A demo customer
    await User.create({
      name: 'Demo Customer',
      email: 'customer@cocoacraft.com',
      password: 'Customer@123',
      role: 'customer',
      mobile: '8888888888',
    });

    await Category.insertMany(
      categories.map((c) => ({ ...c, slug: slugify(c.name) }))
    );
    await Product.insertMany(
      products.map((p) => ({ ...p, slug: slugify(p.name) }))
    );

    console.log('✅ Sample data imported!');
    console.log(`   Admin login: ${process.env.ADMIN_EMAIL || 'admin@cocoacraft.com'} / ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
    console.log('   Customer login: customer@cocoacraft.com / Customer@123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

const destroyData = async () => {
  await connectDB();
  try {
    await Promise.all([
      Order.deleteMany(),
      Payment.deleteMany(),
      Product.deleteMany(),
      Category.deleteMany(),
      User.deleteMany(),
    ]);
    console.log('🗑️  All data destroyed!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// `npm run seed` imports, `npm run seed:destroy` wipes
if (process.argv[2] === '--destroy') {
  destroyData();
} else {
  importData();
}
