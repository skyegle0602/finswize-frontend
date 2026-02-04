import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/transaction';
import { z } from 'zod';

// Validation schema for creating/updating transactions
const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive(),
  category: z.string().min(1),
  date: z.string().or(z.date()),
  note: z.string().optional(),
  source: z.enum(['manual', 'import', 'sync']).optional().default('manual'),
});

/**
 * GET /api/transactions
 * Get all transactions for the current user
 * Query params: ?type=income|expense&category=categoryName&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 */
export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build query
    const query: any = { userId };

    if (type && (type === 'income' || type === 'expense')) {
      query.type = type;
    }

    if (category) {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1, createdAt: -1 }) // Most recent first
      .lean();

    return NextResponse.json(
      {
        transactions: transactions.map((t) => ({
          id: t._id,
          type: t.type,
          amount: t.amount,
          category: t.category,
          date: t.date,
          note: t.note,
          source: t.source,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch transactions',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/transactions
 * Create a new transaction (income or expense)
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validationResult = transactionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid transaction data',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { type, amount, category, date, note, source } = validationResult.data;

    await connectDB();

    // Create transaction
    const transaction = await Transaction.create({
      userId,
      type,
      amount,
      category,
      date: date ? new Date(date) : new Date(),
      note: note || undefined,
      source: source || 'manual',
    });

    return NextResponse.json(
      {
        message: 'Transaction created successfully',
        transaction: {
          id: transaction._id,
          type: transaction.type,
          amount: transaction.amount,
          category: transaction.category,
          date: transaction.date,
          note: transaction.note,
          source: transaction.source,
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      {
        error: 'Failed to create transaction',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
