const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const Offer = require('../models/Offer');
const Reminder = require('../models/Reminder');

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

// @route GET /api/appointments/available-slots?date=YYYY-MM-DD
const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }

    // Find all active/confirmed/pending appointments on this date
    const bookedAppointments = await Appointment.find({
      date,
      status: { $ne: 'cancelled' },
    });

    const bookedSlots = bookedAppointments.map((app) => app.timeSlot);
    const availableSlots = DEFAULT_SLOTS.map((slot) => ({
      slot,
      isBooked: bookedSlots.includes(slot),
    }));

    return res.json({ date, slots: availableSlots });
  } catch (error) {
    return res.status(500).json({ message: 'Error checking slots', error: error.message });
  }
};

// @route POST /api/appointments/book
const bookAppointment = async (req, res) => {
  try {
    const { serviceId, date, timeSlot, notes, promoCode, isMonthlyRoutine, frequencyDays } = req.body;
    const userId = req.user._id;

    if (!serviceId || !date || !timeSlot) {
      return res.status(400).json({ message: 'Service, date, and time slot are required' });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Double-booking check
    const existingSlot = await Appointment.findOne({
      date,
      timeSlot,
      status: { $ne: 'cancelled' },
    });

    if (existingSlot) {
      return res.status(400).json({ message: `Time slot ${timeSlot} on ${date} is already booked. Please pick another slot.` });
    }

    let discountApplied = 0;
    let finalPrice = service.price;

    // Apply promo code if provided
    if (promoCode) {
      const offer = await Offer.findOne({ promoCode: promoCode.toUpperCase(), isActive: true });
      if (offer && new Date(offer.validUntil) >= new Date()) {
        discountApplied = (service.price * offer.discountPercent) / 100;
        finalPrice = service.price - discountApplied;
      }
    }

    const appointment = await Appointment.create({
      userId,
      serviceId,
      date,
      timeSlot,
      notes: notes || '',
      discountApplied,
      finalPrice,
      status: 'pending',
    });

    // If requested monthly routine setting
    if (isMonthlyRoutine) {
      const days = frequencyDays || 30;
      const serviceDate = new Date(date);
      const nextDueDate = new Date(serviceDate);
      nextDueDate.setDate(nextDueDate.getDate() + parseInt(days));

      // Upsert reminder for user and service
      await Reminder.findOneAndUpdate(
        { userId, serviceId },
        {
          userId,
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

    return res.status(201).json(populatedAppointment);
  } catch (error) {
    console.error('Booking error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'This slot is already booked for the selected date.' });
    }
    return res.status(500).json({ message: 'Error booking appointment', error: error.message });
  }
};

// @route GET /api/appointments/my-appointments
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id })
      .populate('serviceId')
      .sort({ date: -1, timeSlot: 1 });
    return res.json(appointments);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

// @route PUT /api/appointments/cancel/:id
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check ownership or admin
    if (appointment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    return res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (error) {
    return res.status(500).json({ message: 'Error cancelling appointment', error: error.message });
  }
};

// @route GET /api/appointments (Admin)
const getAllAppointments = async (req, res) => {
  try {
    const { status, date } = req.query;
    let query = {};
    if (status && status !== 'all') query.status = status;
    if (date) query.date = date;

    const appointments = await Appointment.find(query)
      .populate('serviceId')
      .populate('userId', 'name email phone')
      .sort({ date: -1, timeSlot: 1 });

    return res.json(appointments);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching all appointments', error: error.message });
  }
};

// @route PUT /api/appointments/status/:id (Admin)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    // If marked completed and there's a reminder active, update reminder's lastServiceDate & calculate nextDueDate
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

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating appointment status', error: error.message });
  }
};

module.exports = {
  getAvailableSlots,
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  getAllAppointments,
  updateAppointmentStatus,
};
