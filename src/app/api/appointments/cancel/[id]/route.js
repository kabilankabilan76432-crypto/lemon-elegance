import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/models/Appointment';
import { getAuthUser } from '@/lib/auth';

export async function PUT(req, { params }) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();
    const appointment = await Appointment.findById(params.id);
    if (!appointment) {
      return NextResponse.json({ message: 'Appointment not found' }, { status: 404 });
    }

    if (appointment.userId.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized to cancel this appointment' }, { status: 403 });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    return NextResponse.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (error) {
    return NextResponse.json({ message: 'Error cancelling appointment', error: error.message }, { status: 500 });
  }
}
