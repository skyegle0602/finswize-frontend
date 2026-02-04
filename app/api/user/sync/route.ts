import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/user';

/**
 * Syncs Clerk user data to MongoDB
 * This endpoint can be called after signup/login to ensure user exists in MongoDB
 */
export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get full user data from Clerk
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json(
        { error: 'User not found in Clerk' },
        { status: 404 }
      );
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

    return NextResponse.json(
      {
        message: 'User synced successfully',
        user: {
          id: user._id,
          clerkId: user.clerkId,
          email: user.email,
          displayName: user.displayName,
          onboardingCompleted: user.onboardingCompleted,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json(
      {
        error: 'Failed to sync user',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Get current user from MongoDB
 */
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        user: {
          id: user._id,
          clerkId: user.clerkId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          displayName: user.displayName,
          imageUrl: user.imageUrl,
          businessType: user.businessType,
          monthlyIncome: user.monthlyIncome,
          currency: user.currency,
          financialGoals: user.financialGoals,
          onboardingCompleted: user.onboardingCompleted,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch user',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
