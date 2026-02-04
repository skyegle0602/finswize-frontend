import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import SavingGoal from '@/models/saving-goal';
import { z } from 'zod';

// Validation schema for saving goal
const savingGoalSchema = z.object({
  name: z.string().min(1),
  targetAmount: z.number().positive(),
  savedAmount: z.number().min(0).default(0),
  monthlyContribution: z.number().min(0),
  targetDate: z.string().optional(),
  isPaused: z.boolean().default(false),
});

/**
 * GET /api/saving-goals
 * Get all saving goals for the current user
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const goals = await SavingGoal.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        goals: goals.map((g) => ({
          id: g._id.toString(),
          name: g.name,
          targetAmount: g.targetAmount,
          savedAmount: g.savedAmount,
          monthlyContribution: g.monthlyContribution,
          targetDate: g.targetDate ? g.targetDate.toISOString().split('T')[0] : undefined,
          isPaused: g.isPaused,
          createdAt: g.createdAt,
          updatedAt: g.updatedAt,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching saving goals:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch saving goals',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/saving-goals
 * Create a new saving goal
 * Body: { name, targetAmount, savedAmount?, monthlyContribution, targetDate?, isPaused? }
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validationResult = savingGoalSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid saving goal data',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Convert targetDate string to Date if provided
    const goalData = {
      ...validationResult.data,
      userId,
      targetDate: validationResult.data.targetDate
        ? new Date(validationResult.data.targetDate)
        : undefined,
    };

    const goal = new SavingGoal(goalData);
    await goal.save();

    return NextResponse.json(
      {
        message: 'Saving goal created successfully',
        goal: {
          id: goal._id.toString(),
          name: goal.name,
          targetAmount: goal.targetAmount,
          savedAmount: goal.savedAmount,
          monthlyContribution: goal.monthlyContribution,
          targetDate: goal.targetDate ? goal.targetDate.toISOString().split('T')[0] : undefined,
          isPaused: goal.isPaused,
          createdAt: goal.createdAt,
          updatedAt: goal.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating saving goal:', error);
    return NextResponse.json(
      {
        error: 'Failed to create saving goal',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
