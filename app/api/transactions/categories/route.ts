import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/transaction';

/**
 * GET /api/transactions/categories
 * Get all unique categories used by the current user
 * Query params: ?type=income|expense (optional filter)
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

    // Build query
    const query: any = { userId };
    if (type && (type === 'income' || type === 'expense')) {
      query.type = type;
    }

    // Get distinct categories
    const categories = await Transaction.distinct('category', query);

    return NextResponse.json(
      {
        categories: categories.sort(), // Sort alphabetically
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch categories',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
