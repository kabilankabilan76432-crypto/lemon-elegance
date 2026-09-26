import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/models/Appointment';

const DEFAULT_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
];

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ message: 'Date parameter is required' }, { status: 400 });
    }

    const bookedAppointments = await Appointment.find({
      date,
      status: { $ne: 'cancelled' },
    });

    const bookedSlots = bookedAppointments.map((app) => app.timeSlot);
    const availableSlots = DEFAULT_SLOTS.map((slot) => ({
      slot,
      isBooked: bookedSlots.includes(slot),
    }));

    return NextResponse.json({ date, slots: availableSlots });
  } catch (error) {
    return NextResponse.json({ message: 'Error checking slots', error: error.message }, { status: 500 });
  }
}
