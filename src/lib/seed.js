import connectDB from '@/lib/db';
import User from '@/models/User';
import Service from '@/models/Service';
import Offer from '@/models/Offer';
import Appointment from '@/models/Appointment';
import Reminder from '@/models/Reminder';

export const sampleServices = [
  // Facials
  {
    name: 'Gold Glow Radiance Facial',
    category: 'Facial',
    description: 'Enriched with 24K gold foil particles and nourishing essential oils for ultimate skin rejuvenation and youthful glow.',
    price: 1800,
    duration: 60,
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800',
    isActive: true,
  },
  {
    name: 'Hydra-Boost Herbal Facial',
    category: 'Facial',
    description: 'Deep moisturizing herbal formulation targeting dullness, fine lines, and restoring natural skin elasticity.',
    price: 1400,
    duration: 45,
    imageUrl: 'https://images.unsplash.com/photo-1512290900673-04284d72d6ff?auto=format&fit=crop&q=80&w=800',
    isActive: true,
  },
  {
    name: 'Diamond Brightening Facial',
    category: 'Facial',
    description: 'Micro-diamond exfoliation and botanical brightening serum for crystal clear skin tone and radiance.',
    price: 2200,
    duration: 75,
    imageUrl: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800',
    isActive: true,
  },
  {
    name: 'Anti-Aging Collagen Lift Facial',
    category: 'Facial',
    description: 'Firming collagen mask and jade roller lymphatic drainage massage to reduce fine lines and firm facial contours.',
    price: 2500,
    duration: 75,
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
    isActive: true,
  },

  // Hair Cut
  {
    name: 'Precision Signature Hair Cut & Blowdry',
    category: 'Hair Cut',
    description: 'Bespoke precision haircut styled by expert senior artists tailored to your face structure.',
    price: 850,
    duration: 45,
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800',
    isActive: true,
  },
  {
    name: 'Layered Bob & Feather Cut',
    category: 'Hair Cut',
    description: 'Modern volumetric layers designed for dynamic movement, feathering, and easy daily styling.',
    price: 950,
    duration: 50,
    imageUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=800',
    isActive: true,
  },
  {
    name: 'Split Ends Trimming & Texture Gloss',
    category: 'Hair Cut',
    description: 'Micro-trimming damaged ends combined with a high-shine hair conditioning gloss treatment.',
    price: 600,
    duration: 30,
    imageUrl: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&q=80&w=800',
    isActive: true,
  },

  // Hair Spa
  {
    name: 'Keratin Nourishing Hair Spa',
    category: 'Hair Spa',
    description: 'Intense keratin conditioning ritual with scalp massage, steam treatment, and glossy serum lock.',
    price: 2200,
    duration: 75,
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800',
    isActive: true,
  },
  {
    name: 'Argan Oil Deep Repair Spa',
    category: 'Hair Spa',
    description: 'Moroccan argan oil therapy to repair heat-damaged strands, frizz control, and deep follicle nourishment.',
    price: 1900,
    duration: 60,
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800',
    isActive: true,
  },
  {
    name: 'Anti-Dandruff Scalp Detox Treatment',
    category: 'Hair Spa',
    description: 'Tea tree oil scalp scrub and cooling botanical mask to eliminate flakes and relieve itchiness.',
    price: 1600,
    duration: 50,
    imageUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80&w=800',
    isActive: true,
  },

  // Cleanup
  {
    name: 'Detoxifying Charcoal Cleanup',
    category: 'Cleanup',
    description: 'Deep pore extraction and activated charcoal mask to remove impurities, blackheads, and excess oil.',
    price: 750,
    duration: 35,
    imageUrl: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=800',
    isActive: true,
  },
  {
    name: 'Fruit Enzyme Instant Glow Cleanup',
    category: 'Cleanup',
    description: 'Organic papaya & orange enzyme pack for instant skin brightening and dead cell exfoliation.',
    price: 650,
    duration: 30,
    imageUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=800',
    isActive: true,
  },

  // Manicure
  {
    name: 'Rose Petal Luxury Manicure',
    category: 'Manicure',
    description: 'Exfoliating rose scrub, cuticle restoration, hand paraffin dip, and premium polish application.',
    price: 950,
    duration: 45,
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=800',
    isActive: true,
  },
  {
    name: 'French Gel Polish Manicure',
    category: 'Manicure',
    description: 'Classic long-lasting French gel lacquer with UV cured topcoat and moisturizing hand rub.',
    price: 1200,
    duration: 50,
    imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=800',
    isActive: true,
  },

  // Pedicure
  {
    name: 'Aroma Relaxation Pedicure',
    category: 'Pedicure',
    description: 'Soothing foot soak in organic essential oils, heel softening scrub, hot stone massage, and polish.',
    price: 1100,
    duration: 50,
    imageUrl: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&q=80&w=800',
    isActive: true,
  },
  {
    name: 'Paraffin Wax Deep Moisture Foot Spa',
    category: 'Pedicure',
    description: 'Warm paraffin dip targeting cracked heels, reflexology pressure massage, and nail shaping.',
    price: 1400,
    duration: 60,
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800',
    isActive: true,
  },

  // Waxing
  {
    name: 'Full Body Organic Honey Waxing',
    category: 'Waxing',
    description: 'Gentle organic honey wax suitable for sensitive skin, leaving skin silky smooth and hydrated.',
    price: 1950,
    duration: 60,
    imageUrl: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800',
    isActive: true,
  },
  {
    name: 'RICA Chocolate Waxing (Arms & Legs)',
    category: 'Waxing',
    description: 'Italian RICA lipo wax with soothing cocoa extracts for painless hair removal and soft skin texture.',
    price: 1250,
    duration: 45,
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800',
    isActive: true,
  },

  // Threading
  {
    name: 'Precision Eyebrow & Upper Lip Threading',
    category: 'Threading',
    description: 'Expert facial hair shaping with aloe vera soothing gel finish.',
    price: 250,
    duration: 15,
    imageUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80&w=800',
    isActive: true,
  },
  {
    name: 'Full Face Threading & Aloe Soothing Pack',
    category: 'Threading',
    description: 'Complete face hair removal (brows, chin, forehead, sides) followed by cooling aloe vera pack.',
    price: 450,
    duration: 25,
    imageUrl: 'https://images.unsplash.com/photo-1512290900673-04284d72d6ff?auto=format&fit=crop&q=80&w=800',
    isActive: true,
  },

  // Hair Styling
  {
    name: 'Glamour Curls & Red Carpet Styling',
    category: 'Hair Styling',
    description: 'Elegant waves, intricate braids, or sleek Hollywood straight styling for special evening events.',
    price: 1600,
    duration: 50,
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800',
    isActive: true,
  },
  {
    name: 'Sleek Hollywood Blowout & Shine Finish',
    category: 'Hair Styling',
    description: 'High-volume thermal blowout with protective heat serum and crystal shine spray.',
    price: 1100,
    duration: 40,
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800',
    isActive: true,
  },

  // Bridal Makeup
  {
    name: 'Royal HD Airbrush Bridal Ritual',
    category: 'Bridal Makeup',
    description: 'High-definition airbrush wedding makeup, drape styling, lashes, hair couture, and touch-up kit.',
    price: 12500,
    duration: 180,
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800',
    isActive: true,
  },
  {
    name: 'Pre-Wedding Glow Package',
    category: 'Bridal Makeup',
    description: 'Complete pre-bridal package including Gold Facial, Argan Hair Spa, Rose Manicure, and Full Body Polish.',
    price: 6800,
    duration: 150,
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800',
    isActive: true,
  },
];

export const sampleOffers = [
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

export async function seedDB() {
  await connectDB();

  // Upsert Services to ensure all 22+ services are present in DB
  for (const s of sampleServices) {
    await Service.updateOne(
      { name: s.name },
      { $set: s },
      { upsert: true }
    );
  }

  // Upsert Offers
  for (const o of sampleOffers) {
    await Offer.updateOne(
      { promoCode: o.promoCode },
      { $set: o },
      { upsert: true }
    );
  }

  const userCount = await User.countDocuments();
  if (userCount === 0) {
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

    const facialService = await Service.findOne({ category: 'Facial' });
    const spaService = await Service.findOne({ category: 'Hair Spa' });
    const hairCutService = await Service.findOne({ category: 'Hair Cut' });

    const todayStr = new Date().toISOString().split('T')[0];

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

    const nextDue = new Date();
    nextDue.setDate(nextDue.getDate() - 2);

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
  }

  return { message: 'Database services & offers synchronized successfully.' };
}
