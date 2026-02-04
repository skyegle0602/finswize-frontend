import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBudget extends Document {
  userId: string; // Clerk user ID
  category: string;
  monthlyLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    monthlyLimit: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create compound index for user + category (one budget per category per user)
BudgetSchema.index({ userId: 1, category: 1 }, { unique: true });

// Prevent re-compilation during development
const Budget: Model<IBudget> =
  mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema);

export default Budget;
