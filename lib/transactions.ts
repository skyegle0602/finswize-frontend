import { auth } from '@clerk/nextjs/server';
import connectDB from './mongodb';
import Transaction from '@/models/transaction';

/**
 * Get all transactions for the current user
 */
export async function getUserTransactions(filters?: {
  type?: 'income' | 'expense';
  category?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return null;
    }

    await connectDB();

    const query: any = { userId };

    if (filters?.type) {
      query.type = filters.type;
    }

    if (filters?.category) {
      query.category = filters.category;
    }

    if (filters?.startDate || filters?.endDate) {
      query.date = {};
      if (filters.startDate) {
        query.date.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.date.$lte = filters.endDate;
      }
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1, createdAt: -1 })
      .lean();

    return transactions;
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    return null;
  }
}

/**
 * Get transaction statistics for the current user
 */
export async function getTransactionStats(period?: {
  startDate?: Date;
  endDate?: Date;
}) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return null;
    }

    await connectDB();

    const query: any = { userId };

    if (period?.startDate || period?.endDate) {
      query.date = {};
      if (period.startDate) {
        query.date.$gte = period.startDate;
      }
      if (period.endDate) {
        query.date.$lte = period.endDate;
      }
    }

    const transactions = await Transaction.find(query).lean();

    const stats = {
      totalIncome: 0,
      totalExpense: 0,
      net: 0,
      byCategory: {} as Record<string, { income: number; expense: number }>,
    };

    transactions.forEach((t) => {
      if (t.type === 'income') {
        stats.totalIncome += t.amount;
        if (!stats.byCategory[t.category]) {
          stats.byCategory[t.category] = { income: 0, expense: 0 };
        }
        stats.byCategory[t.category].income += t.amount;
      } else {
        stats.totalExpense += t.amount;
        if (!stats.byCategory[t.category]) {
          stats.byCategory[t.category] = { income: 0, expense: 0 };
        }
        stats.byCategory[t.category].expense += t.amount;
      }
    });

    stats.net = stats.totalIncome - stats.totalExpense;

    return stats;
  } catch (error) {
    console.error('Error fetching transaction stats:', error);
    return null;
  }
}
