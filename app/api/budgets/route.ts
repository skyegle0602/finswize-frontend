import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Budget from '@/models/budget';
import { z } from 'zod';

// Validation schema for budget
const budgetSchema = z.object({
  category: z.string().min(1),
  monthlyLimit: z.number().positive(),
});

const budgetsArraySchema = z.array(budgetSchema);

/**
 * GET /api/budgets
 * Get all budgets for the current user
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const budgets = await Budget.find({ userId })
      .sort({ category: 1 })
      .lean();

    return NextResponse.json(
      {
        budgets: budgets.map((b) => ({
          id: b._id.toString(),
          category: b.category,
          monthlyLimit: b.monthlyLimit,
          createdAt: b.createdAt,
          updatedAt: b.updatedAt,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch budgets',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/budgets
 * Save/update multiple budgets (bulk upsert)
 * Body: { budgets: [{ category: string, monthlyLimit: number }] }
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { budgets } = body;

    // Validate input
    const validationResult = budgetsArraySchema.safeParse(budgets);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid budget data',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Upsert each budget (create or update)
    const savedBudgets = await Promise.all(
      validationResult.data.map(async (budget) => {
        const saved = await Budget.findOneAndUpdate(
          { userId, category: budget.category },
          {
            userId,
            category: budget.category,
            monthlyLimit: budget.monthlyLimit,
          },
          {
            upsert: true,
            new: true,
            runValidators: true,
          }
        );
        return saved;
      })
    );

    return NextResponse.json(
      {
        message: 'Budgets saved successfully',
        budgets: savedBudgets.map((b) => ({
          id: b._id.toString(),
          category: b.category,
          monthlyLimit: b.monthlyLimit,
          createdAt: b.createdAt,
          updatedAt: b.updatedAt,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving budgets:', error);
    return NextResponse.json(
      {
        error: 'Failed to save budgets',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
