import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISavingGoal extends Document {
  userId: string; // Clerk user ID
  name: string;
  targetAmount: number;
  savedAmount: number;
  monthlyContribution: number;
  targetDate?: Date; // Optional target date
  isPaused: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SavingGoalSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    savedAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    monthlyContribution: {
      type: Number,
      required: true,
      min: 0,
    },
    targetDate: {
      type: Date,
      required: false,
    },
    isPaused: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create index for user queries
SavingGoalSchema.index({ userId: 1, createdAt: -1 });

// Prevent re-compilation during development
const SavingGoal: Model<ISavingGoal> =
  mongoose.models.SavingGoal || mongoose.model<ISavingGoal>('SavingGoal', SavingGoalSchema, 'saving_goal');

export default SavingGoal;
