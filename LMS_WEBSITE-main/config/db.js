import mongoose from 'mongoose';

/**
 * MongoDB connection setup using Mongoose
 * Reads connection string from process.env.MONGODB_URI
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default mongoose.connection;

