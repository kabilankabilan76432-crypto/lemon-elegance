const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Service = require('../models/Service');
const Offer = require('../models/Offer');
const Reminder = require('../models/Reminder');

// @route GET /api/admin/stats (Admin)
const getDashboardStats = async (req, res) => {
  try {
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const confirmedAppointments = await Appointment.countDocuments({ status: 'confirmed' });
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });

    // Calculate total revenue from completed appointments
    const completedApps = await Appointment.find({ status: 'completed' }).populate('serviceId');
    const totalRevenue = completedApps.reduce((acc, app) => {
      const price = app.finalPrice !== undefined ? app.finalPrice : (app.serviceId ? app.serviceId.price : 0);
      return acc + price;
    }, 0);

    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalServices = await Service.countDocuments();
    const activeOffers = await Offer.countDocuments({ isActive: true });
    const activeReminders = await Reminder.countDocuments({ status: 'active' });

    // Category distribution
    const services = await Service.find();
    const categoryCounts = {};
    services.forEach((s) => {
      categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
    });

    return res.json({
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
      categoryCounts,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error computing dashboard stats', error: error.message });
  }
};

module.exports = { getDashboardStats };
