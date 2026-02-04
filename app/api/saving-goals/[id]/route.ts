import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import SavingGoal from '@/models/saving-goal';
import { z } from 'zod';
import mongoose from 'mongoose';

// Validation schema for updating saving goal
const updateSavingGoalSchema = z.object({
  name: z.string().min(1).optional(),
  targetAmount: z.number().positive().optional(),
  savedAmount: z.number().min(0).optional(),
  monthlyContribution: z.number().min(0).optional(),
  targetDate: z.string().optional(),
  isPaused: z.boolean().optional(),
});

/**
 * GET /api/saving-goals/[id]
 * Get a specific saving goal by ID
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid goal ID' }, { status: 400 });
    }

    const goal = await SavingGoal.findOne({
      _id: id,
      userId,
    }).lean();

    if (!goal) {
      return NextResponse.json({ error: 'Saving goal not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
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
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching saving goal:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch saving goal',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/saving-goals/[id]
 * Update a specific saving goal
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validationResult = updateSavingGoalSchema.safeParse(body);
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

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid goal ID' }, { status: 400 });
    }

    // Prepare update data
    const updateData: any = { ...validationResult.data };
    if (updateData.targetDate) {
      updateData.targetDate = new Date(updateData.targetDate);
    }

    const goal = await SavingGoal.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!goal) {
      return NextResponse.json({ error: 'Saving goal not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: 'Saving goal updated successfully',
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
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating saving goal:', error);
    return NextResponse.json(
      {
        error: 'Failed to update saving goal',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/saving-goals/[id]
 * Delete a specific saving goal
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid goal ID' }, { status: 400 });
    }

    const goal = await SavingGoal.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!goal) {
      return NextResponse.json({ error: 'Saving goal not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: 'Saving goal deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting saving goal:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete saving goal',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
