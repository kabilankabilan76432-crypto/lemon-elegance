import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/models/Appointment';
import Service from '@/models/Service';
import { getAuthUser } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();
    const appointments = await Appointment.find({ userId: user._id })
      .populate('serviceId')
      .sort({ date: -1, timeSlot: 1 });

    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching appointments', error: error.message }, { status: 500 });
  }
}
