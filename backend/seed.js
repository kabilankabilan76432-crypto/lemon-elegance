require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Service = require('./models/Service');
const Offer = require('./models/Offer');
const Appointment = require('./models/Appointment');
const Reminder = require('./models/Reminder');

const sampleServices = [
  {
    name: 'Gold Glow Radiance Facial',
    category: 'Facial',
    description: 'Enriched with 24K gold foil particles and nourishing essential oils for ultimate skin rejuvenation and youthful glow.',
    price: 1800,
    duration: 60,
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600',
    isActive: true,
  },
  {
    name: 'Hydra-Boost Herbal Facial',
    category: 'Facial',
    description: 'Deep moisturizing herbal formulation targeting dullness, fine lines, and restoring natural skin elasticity.',
    price: 1400,
    duration: 45,
    imageUrl: 'https://images.unsplash.com/photo-1512290900673-04284d72d6ff?auto=format&fit=crop&q=80&w=600',
    isActive: true,
  },
  {
    name: 'Precision Signature Hair Cut & Blowdry',
    category: 'Hair Cut',
    description: 'Bespoke precision haircut styled by expert senior artists tailored to your face structure.',
    price: 850,
    duration: 45,
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600',
    isActive: true,
  },
  {
    name: 'Keratin Nourishing Hair Spa',
    category: 'Hair Spa',
    description: 'Intense keratin conditioning ritual with scalp massage, steam treatment, and glossy serum lock.',
    price: 2200,
    duration: 75,
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600',
    isActive: true,
  },
  {
    name: 'Detoxifying Charcoal Cleanup',
    category: 'Cleanup',
    description: 'Deep pore extraction and activated charcoal mask to remove impurities, blackheads, and excess oil.',
    price: 750,
    duration: 35,
    imageUrl: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=600',
    isActive: true,
  },
  {
    name: 'Rose Petal Luxury Manicure',
    category: 'Manicure',
    description: 'Exfoliating rose scrub, cuticle restoration, hand paraffin dip, and premium polish application.',
    price: 950,
    duration: 45,
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=600',
    isActive: true,
  },
  {
    name: 'Aroma Relaxation Pedicure',
    category: 'Pedicure',
    description: 'Soothing foot soak in organic essential oils, heel softening scrub, hot stone massage, and polish.',
    price: 1100,
    duration: 50,
    imageUrl: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&q=80&w=600',
    isActive: true,
  },
  {
    name: 'Full Body Organic Honey Waxing',
    category: 'Waxing',
    description: 'Gentle organic honey wax suitable for sensitive skin, leaving skin silky smooth and hydrated.',
    price: 1950,
    duration: 60,
    imageUrl: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=600',
    isActive: true,
  },
  {
    name: 'Precision Eyebrow & Upper Lip Threading',
    category: 'Threading',
    description: 'Expert facial hair shaping with aloe vera soothing gel finish.',
    price: 250,
    duration: 15,
    imageUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80&w=600',
    isActive: true,
  },
  {
    name: 'Glamour Curls & Red Carpet Styling',
    category: 'Hair Styling',
    description: 'Elegant waves, intricate braids, or sleek Hollywood straight styling for special evening events.',
    price: 1600,
    duration: 50,
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600',
    isActive: true,
  },
  {
    name: 'Royal HD Bridal Makeup & Hair Ritual',
    category: 'Bridal Makeup',
    description: 'High-definition airbrush wedding makeup, drape styling, lashes, hair couture, and touch-up kit.',
    price: 12500,
    duration: 180,
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=600',
    isActive: true,
  },
];

const sampleOffers = [
  {
    title: 'First Beauty Glow Deal',
    description: 'Enjoy 20% flat discount on your very first booking at Lemon Elegance!',
    promoCode: 'GLOW20',
    discountPercent: 20,
    validUntil: new Date('2027-12-31'),
    isActive: true,
  },
  {
    title: 'Royal Bridal Care Package',
    description: 'Get 15% off on all luxury Bridal Makeup & pre-wedding facial packages.',
    promoCode: 'BRIDAL15',
    discountPercent: 15,
    validUntil: new Date('2027-12-31'),
    isActive: true,
  },
  {
    title: 'Weekend Spa Pamper Delight',
    description: 'Relax with 25% off on Keratin Hair Spa and Rose Petal Manicure combos.',
    promoCode: 'SPA25',
    discountPercent: 25,
    validUntil: new Date('2027-12-31'),
    isActive: true,
  },
];

const seedDB = async (shouldExit = false) => {
  try {
    console.log('[Seed] Clearing old database collections...');
    await User.deleteMany({});
    await Service.deleteMany({});
    await Offer.deleteMany({});
    await Appointment.deleteMany({});
    await Reminder.deleteMany({});

    console.log('[Seed] Creating default users...');
    const admin = await User.create({
      name: 'Elegance Admin',
      email: 'admin@lemonelegance.com',
      phone: '+91 9876543210',
      password: 'admin123',
      role: 'admin',
    });

    const customer = await User.create({
      name: 'Priya Sharma',
      email: 'priya@gmail.com',
      phone: '+91 9123456789',
      password: 'client123',
      role: 'customer',
    });

    console.log(`[Seed] Created Admin (${admin.email}) and Customer (${customer.email})`);

    console.log('[Seed] Seeding salon services...');
    const createdServices = await Service.insertMany(sampleServices);

    console.log('[Seed] Seeding promo offers...');
    await Offer.insertMany(sampleOffers);

    console.log('[Seed] Creating sample appointments & routine reminders...');
    const facialService = createdServices.find((s) => s.category === 'Facial');
    const spaService = createdServices.find((s) => s.category === 'Hair Spa');
    const hairCutService = createdServices.find((s) => s.category === 'Hair Cut');

    const todayStr = new Date().toISOString().split('T')[0];

    // Seed Appointments
    await Appointment.create([
      {
        userId: customer._id,
        serviceId: facialService._id,
        date: todayStr,
        timeSlot: '11:00 AM',
        notes: 'Sensitive skin. Prefer organic products.',
        status: 'confirmed',
        discountApplied: 360,
        finalPrice: 1440,
      },
      {
        userId: customer._id,
        serviceId: spaService._id,
        date: '2026-10-15',
        timeSlot: '02:00 PM',
        notes: 'Monthly scalp care',
        status: 'pending',
        discountApplied: 0,
        finalPrice: 2200,
      },
    ]);

    // Seed Reminders
    const nextDue = new Date();
    nextDue.setDate(nextDue.getDate() - 2); // Past due to trigger cron test!

    await Reminder.create({
      userId: customer._id,
      serviceId: facialService._id,
      frequencyDays: 30,
      lastServiceDate: new Date('2026-08-25'),
      nextDueDate: nextDue,
      status: 'active',
    });

    await Reminder.create({
      userId: customer._id,
      serviceId: hairCutService._id,
      frequencyDays: 45,
      lastServiceDate: new Date('2026-09-01'),
      nextDueDate: new Date('2026-10-16'),
      status: 'active',
    });

    console.log('✅ [Seed] Database seeded successfully!');
    if (shouldExit) process.exit(0);
  } catch (error) {
    console.error('❌ [Seed Error]:', error);
    if (shouldExit) process.exit(1);
  }
};

if (require.main === module) {
  const connectDB = require('./config/db');
  connectDB().then(() => seedDB(true));
}

module.exports = seedDB;
