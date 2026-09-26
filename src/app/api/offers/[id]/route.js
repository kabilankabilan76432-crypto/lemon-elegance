import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Offer from '@/models/Offer';
import { getAuthUser } from '@/lib/auth';

export async function PUT(req, { params }) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized: Admin role required' }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();
    if (body.promoCode) body.promoCode = body.promoCode.toUpperCase();
    const offer = await Offer.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    return NextResponse.json(offer);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating offer', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized: Admin role required' }, { status: 403 });
    }

    await connectDB();
    await Offer.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Offer deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting offer', error: error.message }, { status: 500 });
  }
}
