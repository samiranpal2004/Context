import mongoose from 'mongoose';

/**
 * Connect to MongoDB Database
 * This function establishes connection to MongoDB
 * and handles connection events
 */
export const connectDB = async () => {
  try {
    // Attempt to connect
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);

  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    process.exit(1); // Exit process with failure
  }
};