import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  clerkId: string; // Clerk user ID (unique identifier)
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  imageUrl?: string;
  
  // Onboarding data
  businessType?: 'freelancer' | 'small-business' | 'startup' | 'other';
  monthlyIncome?: number;
  currency?: string;
  financialGoals?: string[];
  onboardingCompleted?: boolean;
  
  // Metadata
  lastSyncedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true, // unique automatically creates an index
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    displayName: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    businessType: {
      type: String,
      enum: ['freelancer', 'small-business', 'startup', 'other'],
    },
    monthlyIncome: {
      type: Number,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    financialGoals: {
      type: [String],
      default: [],
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    lastSyncedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create indexes for better query performance
// Note: clerkId already has an index from unique: true
UserSchema.index({ email: 1 });

// Prevent re-compilation during development
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
