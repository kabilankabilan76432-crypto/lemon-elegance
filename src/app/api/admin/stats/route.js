import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/models/Appointment';
import Service from '@/models/Service';
import User from '@/models/User';
import Offer from '@/models/Offer';
import Reminder from '@/models/Reminder';
import { getAuthUser } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized: Admin role required' }, { status: 403 });
    }

    await connectDB();

    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const confirmedAppointments = await Appointment.countDocuments({ status: 'confirmed' });
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });

    const completedApps = await Appointment.find({ status: 'completed' }).populate('serviceId');
    const totalRevenue = completedApps.reduce((acc, app) => {
      const price = app.finalPrice !== undefined ? app.finalPrice : (app.serviceId ? app.serviceId.price : 0);
      return acc + price;
    }, 0);

    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalServices = await Service.countDocuments();
    const activeOffers = await Offer.countDocuments({ isActive: true });
    const activeReminders = await Reminder.countDocuments({ status: 'active' });

    return NextResponse.json({
      totalRevenue,
      totalAppointments,
      pendingAppointments,
      confirmedAppointments,
      completedAppointments,
      cancelledAppointments,
      totalCustomers,
      totalServices,
      activeOffers,
      activeReminders,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error computing stats', error: error.message }, { status: 500 });
  }
}
