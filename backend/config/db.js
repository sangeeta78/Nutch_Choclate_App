import mongoose from 'mongoose';

/**
 * Establishes a connection to MongoDB using the URI from environment variables.
 * Exits the process on failure so container/PM2 supervisors can restart cleanly.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
