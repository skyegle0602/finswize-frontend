import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json(
      { message: 'MongoDB connected successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to MongoDB', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
