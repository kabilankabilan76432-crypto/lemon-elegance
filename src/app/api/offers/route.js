import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Offer from '@/models/Offer';
import { seedDB, sampleOffers } from '@/lib/seed';

export async function GET() {
  let offers = [];

  try {
    await connectDB();
    await seedDB();

    const currentDate = new Date();
    offers = await Offer.find({
      isActive: true,
      validUntil: { $gte: currentDate },
    }).sort({ discountPercent: -1 });
  } catch (error) {
    console.warn('[Offers API] Database fetch error, using static fallback:', error.message);
  }

  if (!offers || offers.length === 0) {
    offers = sampleOffers.map((o, idx) => ({ ...o, _id: `offer_${idx + 1}` }));
  }

  return NextResponse.json(offers);
}
