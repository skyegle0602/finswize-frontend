import { auth, currentUser } from '@clerk/nextjs/server';
import connectDB from './mongodb';
import User from '@/models/user';

/**
 * Ensures the current user exists in MongoDB and is up-to-date
 * Call this in API routes or server components that need user data
 * 
 * @returns User document from MongoDB, or null if not authenticated
 */
export async function ensureUserSynced() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return null;
    }

    // Get full user data from Clerk
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return null;
    }

    // Connect to MongoDB
    await connectDB();

    // Prepare user data from Clerk
    const userData = {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      firstName: clerkUser.firstName || undefined,
      lastName: clerkUser.lastName || undefined,
      displayName: clerkUser.fullName || clerkUser.firstName || undefined,
      imageUrl: clerkUser.imageUrl || undefined,
      lastSyncedAt: new Date(),
    };

    // Upsert user (create if doesn't exist, update if exists)
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      userData,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    return user;
  } catch (error) {
    console.error('Error ensuring user sync:', error);
    return null;
  }
}

/**
 * Gets the current user from MongoDB
 * 
 * @returns User document from MongoDB, or null if not found
 */
export async function getCurrentUser() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return null;
    }

    await connectDB();

    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}
