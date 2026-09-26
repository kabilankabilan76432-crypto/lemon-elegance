const Reminder = require('../models/Reminder');

// @route GET /api/reminders/my-reminders
const getMyReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user._id })
      .populate('serviceId')
      .sort({ nextDueDate: 1 });

    return res.json(reminders);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching customer reminders', error: error.message });
  }
};

// @route POST /api/reminders/set
const createOrUpdateReminder = async (req, res) => {
  try {
    const { serviceId, frequencyDays } = req.body;
    const userId = req.user._id;

    if (!serviceId) {
      return res.status(400).json({ message: 'Service ID is required' });
    }

    const days = frequencyDays || 30;
    const now = new Date();
    const nextDueDate = new Date(now);
    nextDueDate.setDate(nextDueDate.getDate() + parseInt(days));

    const reminder = await Reminder.findOneAndUpdate(
      { userId, serviceId },
      {
        userId,
        serviceId,
        frequencyDays: days,
        lastServiceDate: now,
        nextDueDate,
        status: 'active',
      },
      { upsert: true, new: true }
    ).populate('serviceId');

    return res.status(200).json(reminder);
  } catch (error) {
    return res.status(500).json({ message: 'Error setting beauty reminder', error: error.message });
  }
};

// @route PUT /api/reminders/toggle/:id
const toggleReminderStatus = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    if (reminder.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    reminder.status = reminder.status === 'active' ? 'paused' : 'active';
    await reminder.save();

    const updated = await Reminder.findById(reminder._id).populate('serviceId');
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Error toggling reminder', error: error.message });
  }
};

// @route GET /api/reminders/all (Admin)
const getAllReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find()
      .populate('serviceId')
      .populate('userId', 'name email phone')
      .sort({ nextDueDate: 1 });

    return res.json(reminders);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching all reminders', error: error.message });
  }
};

module.exports = {
  getMyReminders,
  createOrUpdateReminder,
  toggleReminderStatus,
  getAllReminders,
};
