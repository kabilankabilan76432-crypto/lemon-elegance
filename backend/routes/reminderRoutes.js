const express = require('express');
const router = express.Router();
const {
  getMyReminders,
  createOrUpdateReminder,
  toggleReminderStatus,
  getAllReminders,
} = require('../controllers/reminderController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/my-reminders', protect, getMyReminders);
router.post('/set', protect, createOrUpdateReminder);
router.put('/toggle/:id', protect, toggleReminderStatus);

// Admin route
router.get('/admin/all', protect, adminOnly, getAllReminders);

module.exports = router;
