import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Offer from '@/models/Offer';
import { getAuthUser } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized: Admin role required' }, { status: 403 });
    }

    await connectDB();
    const offers = await Offer.find().sort({ createdAt: -1 });
    return NextResponse.json(offers);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching offers', error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized: Admin role required' }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();
    body.promoCode = body.promoCode.toUpperCase();
    const offer = await Offer.create(body);
    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating offer', error: error.message }, { status: 500 });
  }
}
