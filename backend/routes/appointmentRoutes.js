const express = require('express');
const router = express.Router();
const {
  getAvailableSlots,
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  getAllAppointments,
  updateAppointmentStatus,
} = require('../controllers/appointmentController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/available-slots', getAvailableSlots);
router.post('/book', protect, bookAppointment);
router.get('/my-appointments', protect, getMyAppointments);
router.put('/cancel/:id', protect, cancelAppointment);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllAppointments);
router.put('/status/:id', protect, adminOnly, updateAppointmentStatus);

module.exports = router;
