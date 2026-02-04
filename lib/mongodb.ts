import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI?.trim();

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Clean and validate the URI
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }
    
    let cleanUri = MONGODB_URI.trim();
    
    // Remove any trailing whitespace or newlines
    cleanUri = cleanUri.replace(/\s+$/, '');
    
    // Check if URI starts with mongodb:// or mongodb+srv://
    if (!cleanUri.startsWith('mongodb://') && !cleanUri.startsWith('mongodb+srv://')) {
      throw new Error('Invalid MongoDB URI format. Must start with mongodb:// or mongodb+srv://');
    }

    // For mongoose 9.x, connect with just the URI
    // If your connection string has unsupported options, they will be ignored
    cached.promise = mongoose
      .connect(cleanUri)
      .then((mongoose) => {
        console.log('MongoDB connected successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        // Log URI format (without exposing full credentials)
        const uriPreview = cleanUri.substring(0, 30) + '...';
        console.error('Connection URI preview:', uriPreview);
        console.error('Full error:', error.message);
        throw new Error(`Failed to connect to MongoDB: ${error.message}`);
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
