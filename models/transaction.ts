import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITransaction extends Document {
  userId: string; // Clerk user ID
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: Date;
  note?: string;
  source: 'manual' | 'import' | 'sync'; // For future expansion
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true, // Index for faster queries by user
    },
    type: {
      type: String,
      required: true,
      enum: ['income', 'expense'],
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      required: true,
      enum: ['manual', 'import', 'sync'],
      default: 'manual',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create indexes for better query performance
TransactionSchema.index({ userId: 1, date: -1 }); // For user transactions sorted by date
TransactionSchema.index({ userId: 1, category: 1 }); // For filtering by category
TransactionSchema.index({ userId: 1, type: 1 }); // For filtering by type

// Prevent re-compilation during development
const Transaction: Model<ITransaction> =
  mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
