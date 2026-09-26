import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Offer from '@/models/Offer';
import { seedDB } from '@/lib/seed';

export async function GET() {
  try {
    await connectDB();
    await seedDB();

    const currentDate = new Date();
    const offers = await Offer.find({
      isActive: true,
      validUntil: { $gte: currentDate },
    }).sort({ discountPercent: -1 });

    return NextResponse.json(offers);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching offers', error: error.message }, { status: 500 });
  }
}
