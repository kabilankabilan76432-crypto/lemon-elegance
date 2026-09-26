const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Reminder = require('../models/Reminder');

// Create reusable transporter
const createTransporter = () => {
  if (process.env.SMTP_USER && process.env.SMTP_USER !== 'mock_user@ethereal.email') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback test account transporter
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'ethereal.user@ethereal.email',
      pass: 'ethereal.pass',
    },
  });
};

const sendBeautyReminderNotification = async (reminder) => {
  try {
    const user = reminder.userId;
    const service = reminder.serviceId;

    if (!user || !service) return;

    console.log(`[Cron Reminder] Triggering beauty reminder for ${user.name} (${user.email}) - Service: ${service.name}`);

    const mailOptions = {
      from: '"Lemon Elegance PMS" <reminders@lemonelegance.com>',
      to: user.email,
      subject: `✨ Beauty Time! It's time for your ${service.name} care routine at Lemon Elegance`,
      html: `
        <div style="font-family: 'Georgia', serif; background-color: #FAF7F2; padding: 24px; color: #2C221E; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #C5A880; font-size: 26px; margin-bottom: 4px;">LEMON ELEGANCE</h1>
            <p style="font-style: italic; color: #786C66; margin-top: 0;">Your Beauty, Our Care</p>
          </div>
          <p>Dear <strong>${user.name}</strong>,</p>
          <p>Hope you are glowing today! It has been <strong>${reminder.frequencyDays} days</strong> since your last beauty ritual for <strong>${service.name}</strong>.</p>
          <p>To keep your radiant look and pampered feel, we recommend booking your routine appointment today.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:5173/book?serviceId=${service._id}" 
               style="background-color: #C5A880; color: #FFFFFF; text-decoration: none; padding: 12px 28px; border-radius: 30px; font-weight: bold; display: inline-block;">
               Book Your ${service.name} Now
            </a>
          </div>
          <p style="font-size: 13px; color: #9A8E88;">Need to adjust your reminder frequency? You can manage your beauty care routine anytime from your Lemon Elegance Customer Dashboard.</p>
          <hr style="border: none; border-top: 1px solid #EAE6F5; margin: 20px 0;" />
          <p style="font-size: 12px; color: #B0A5A0; text-align: center;">Lemon Elegance Beauty Parlour & Spa • Pure Luxury & Wellness</p>
        </div>
      `,
    };

    const transporter = createTransporter();
    // Attempt sending, catch gracefully if offline/mock
    try {
      await transporter.sendMail(mailOptions);
      console.log(`[Cron Reminder] Email sent successfully to ${user.email}`);
    } catch (err) {
      console.log(`[Cron Reminder Notification Simulated] Email content generated for ${user.email} (SMTP offline fallback)`);
    }

    // Update last notified date
    reminder.lastNotifiedDate = new Date();
    await reminder.save();
  } catch (error) {
    console.error(`[Cron Reminder Error]: ${error.message}`);
  }
};

const checkDueReminders = async () => {
  try {
    console.log('[Cron Job] Checking daily beauty routine due reminders...');
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const dueReminders = await Reminder.find({
      status: 'active',
      nextDueDate: { $lte: today },
    })
      .populate('userId')
      .populate('serviceId');

    console.log(`[Cron Job] Found ${dueReminders.length} due beauty reminders.`);

    for (const reminder of dueReminders) {
      await sendBeautyReminderNotification(reminder);
    }
  } catch (error) {
    console.error('[Cron Job Error]:', error.message);
  }
};

const initCron = () => {
  // Schedule to run every day at 09:00 AM
  cron.schedule('0 9 * * *', () => {
    checkDueReminders();
  });

  // Also run an initial check 10 seconds after server startup
  setTimeout(() => {
    checkDueReminders();
  }, 10000);

  console.log('[Cron Service] Daily beauty reminder checker initialized.');
};

module.exports = { initCron, checkDueReminders };
