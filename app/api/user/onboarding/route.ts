import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/user';

/**
 * Updates user onboarding data
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      businessType,
      monthlyIncome,
      currency,
      financialGoals,
      displayName,
    } = body;

    // Validate required fields
    if (!businessType || !monthlyIncome) {
      return NextResponse.json(
        { error: 'Missing required fields: businessType and monthlyIncome are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Update user with onboarding data
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        businessType,
        monthlyIncome: parseFloat(monthlyIncome),
        currency: currency || 'USD',
        financialGoals: financialGoals || [],
        displayName: displayName || undefined,
        onboardingCompleted: true,
        lastSyncedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      // If user doesn't exist, sync from Clerk first
      return NextResponse.json(
        { error: 'User not found. Please sync user first.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Onboarding data saved successfully',
        user: {
          id: user._id,
          clerkId: user.clerkId,
          email: user.email,
          displayName: user.displayName,
          businessType: user.businessType,
          monthlyIncome: user.monthlyIncome,
          currency: user.currency,
          financialGoals: user.financialGoals,
          onboardingCompleted: user.onboardingCompleted,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    return NextResponse.json(
      {
        error: 'Failed to save onboarding data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
