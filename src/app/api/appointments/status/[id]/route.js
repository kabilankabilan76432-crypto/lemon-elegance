import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/models/Appointment';
import Service from '@/models/Service';
import User from '@/models/User';
import Reminder from '@/models/Reminder';
import { getAuthUser } from '@/lib/auth';

export async function PUT(req, { params }) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized: Admin role required' }, { status: 403 });
    }

    await connectDB();
    const { status } = await req.json();

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json({ message: 'Invalid status value' }, { status: 400 });
    }

    const appointment = await Appointment.findById(params.id);
    if (!appointment) {
      return NextResponse.json({ message: 'Appointment not found' }, { status: 404 });
    }

    appointment.status = status;
    await appointment.save();

    if (status === 'completed') {
      const reminder = await Reminder.findOne({ userId: appointment.userId, serviceId: appointment.serviceId });
      if (reminder && reminder.status === 'active') {
        const lastDate = new Date(appointment.date);
        const nextDate = new Date(lastDate);
        nextDate.setDate(nextDate.getDate() + reminder.frequencyDays);

        reminder.lastServiceDate = lastDate;
        reminder.nextDueDate = nextDate;
        await reminder.save();
      }
    }

    const updated = await Appointment.findById(appointment._id)
      .populate('serviceId')
      .populate('userId', 'name email phone');

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating appointment status', error: error.message }, { status: 500 });
  }
}
