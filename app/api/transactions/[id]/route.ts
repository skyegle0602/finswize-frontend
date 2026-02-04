import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/transaction';
import { z } from 'zod';

// Validation schema for updating transactions
const updateTransactionSchema = z.object({
  type: z.enum(['income', 'expense']).optional(),
  amount: z.number().positive().optional(),
  category: z.string().min(1).optional(),
  date: z.string().or(z.date()).optional(),
  note: z.string().optional(),
});

/**
 * GET /api/transactions/[id]
 * Get a specific transaction by ID
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

    const { id } = await params;
    await connectDB();

    const transaction = await Transaction.findOne({ _id: id, userId });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
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
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch transaction',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/transactions/[id]
 * Update a transaction
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

    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validationResult = updateTransactionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid transaction data',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Build update object
    const updateData: any = {};
    if (validationResult.data.type !== undefined) {
      updateData.type = validationResult.data.type;
    }
    if (validationResult.data.amount !== undefined) {
      updateData.amount = validationResult.data.amount;
    }
    if (validationResult.data.category !== undefined) {
      updateData.category = validationResult.data.category;
    }
    if (validationResult.data.date !== undefined) {
      updateData.date = new Date(validationResult.data.date);
    }
    if (validationResult.data.note !== undefined) {
      updateData.note = validationResult.data.note || undefined;
    }

    // Update transaction (only if it belongs to the user)
    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Transaction updated successfully',
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
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      {
        error: 'Failed to update transaction',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/transactions/[id]
 * Delete a transaction
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

    const { id } = await params;
    await connectDB();

    // Delete transaction (only if it belongs to the user)
    const transaction = await Transaction.findOneAndDelete({ _id: id, userId });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Transaction deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete transaction',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
