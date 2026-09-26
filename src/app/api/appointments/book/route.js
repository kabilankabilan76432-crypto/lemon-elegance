import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/models/Appointment';
import Service from '@/models/Service';
import Offer from '@/models/Offer';
import Reminder from '@/models/Reminder';
import { getAuthUser } from '@/lib/auth';

export async function POST(req) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();
    const { serviceId, date, timeSlot, notes, promoCode, isMonthlyRoutine, frequencyDays } = await req.json();

    if (!serviceId || !date || !timeSlot) {
      return NextResponse.json({ message: 'Service, date, and time slot are required' }, { status: 400 });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }

    const existingSlot = await Appointment.findOne({
      date,
      timeSlot,
      status: { $ne: 'cancelled' },
    });

    if (existingSlot) {
      return NextResponse.json(
        { message: `Time slot ${timeSlot} on ${date} is already booked.` },
        { status: 400 }
      );
    }

    let discountApplied = 0;
    let finalPrice = service.price;

    if (promoCode) {
      const offer = await Offer.findOne({ promoCode: promoCode.toUpperCase(), isActive: true });
      if (offer && new Date(offer.validUntil) >= new Date()) {
        discountApplied = (service.price * offer.discountPercent) / 100;
        finalPrice = service.price - discountApplied;
      }
    }

    const appointment = await Appointment.create({
      userId: user._id,
      serviceId,
      date,
      timeSlot,
      notes: notes || '',
      discountApplied,
      finalPrice,
      status: 'pending',
    });

    if (isMonthlyRoutine) {
      const days = frequencyDays || 30;
      const serviceDate = new Date(date);
      const nextDueDate = new Date(serviceDate);
      nextDueDate.setDate(nextDueDate.getDate() + parseInt(days));

      await Reminder.findOneAndUpdate(
        { userId: user._id, serviceId },
        {
          userId: user._id,
          serviceId,
          frequencyDays: days,
          lastServiceDate: serviceDate,
          nextDueDate,
          status: 'active',
        },
        { upsert: true, new: true }
      );
    }

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('serviceId')
      .populate('userId', 'name email phone');

    return NextResponse.json(populatedAppointment, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ message: 'This slot is already booked for the selected date.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error booking appointment', error: error.message }, { status: 500 });
  }
}
