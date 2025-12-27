import mongoose from 'mongoose';

/**
 * Global MongoDB Connection Handler for Vercel Serverless
 * 
 * This utility ensures:
 * 1. Connection reuse across serverless invocations
 * 2. No buffering timeouts
 * 3. Proper connection caching using globalThis
 * 4. Vercel-safe implementation
 */

// Disable Mongoose buffering (critical for serverless)
mongoose.set('bufferCommands', false);

// Cache connection in global scope (survives across serverless invocations)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB with connection caching
 * Safe for Vercel serverless - reuses existing connections
 * 
 * @returns {Promise<typeof mongoose>} Mongoose connection
 */
export async function connectDB() {
  // Check for MongoDB URI
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined. Please set it in your Vercel project settings.');
  }

  // Return existing connection if available
  if (cached.conn) {
    console.log('✅ Using cached MongoDB connection');
    return cached.conn;
  }

  // Return pending connection promise if one exists
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable buffering
      maxPoolSize: 10,       // Connection pool size
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000, // 45 second socket timeout
    };

    console.log('🔄 Creating new MongoDB connection...');
    
    // Create connection promise
    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
      console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
      console.log(`📊 Database: ${mongoose.connection.name}`);
      return mongoose;
    });
  }

  try {
    // Wait for connection to complete
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset promise on error so next invocation retries
    cached.promise = null;
    console.error('❌ MongoDB Connection Failed:', error.message);
    throw error;
  }

  return cached.conn;
}

/**
 * Check if MongoDB is connected
 * @returns {boolean}
 */
export function isConnected() {
  return mongoose.connection.readyState === 1;
}

/**
 * Disconnect from MongoDB (primarily for cleanup in non-serverless environments)
 * Not recommended for serverless - let connections persist
 */
export async function disconnectDB() {
  if (cached.conn) {
    await cached.conn.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log('✅ MongoDB Disconnected');
  }
}

export default connectDB;
