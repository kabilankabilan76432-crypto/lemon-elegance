const Offer = require('../models/Offer');

// @route GET /api/offers
const getActiveOffers = async (req, res) => {
  try {
    const currentDate = new Date();
    const offers = await Offer.find({
      isActive: true,
      validUntil: { $gte: currentDate },
    }).sort({ discountPercent: -1 });

    return res.json(offers);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching active offers', error: error.message });
  }
};

// @route GET /api/offers/admin (Admin)
const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    return res.json(offers);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching all offers', error: error.message });
  }
};

// @route POST /api/offers (Admin)
const createOffer = async (req, res) => {
  try {
    const { title, description, promoCode, discountPercent, validUntil, isActive } = req.body;
    if (!title || !description || !promoCode || !discountPercent || !validUntil) {
      return res.status(400).json({ message: 'Please provide all required offer fields' });
    }

    const existingCode = await Offer.findOne({ promoCode: promoCode.toUpperCase() });
    if (existingCode) {
      return res.status(400).json({ message: 'Promo code already exists' });
    }

    const offer = await Offer.create({
      title,
      description,
      promoCode: promoCode.toUpperCase(),
      discountPercent,
      validUntil,
      isActive: isActive !== undefined ? isActive : true,
    });

    return res.status(201).json(offer);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating offer', error: error.message });
  }
};

// @route PUT /api/offers/:id (Admin)
const updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    if (req.body.promoCode) {
      req.body.promoCode = req.body.promoCode.toUpperCase();
    }

    const updated = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating offer', error: error.message });
  }
};

// @route DELETE /api/offers/:id (Admin)
const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    await Offer.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Offer deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting offer', error: error.message });
  }
};

module.exports = {
  getActiveOffers,
  getAllOffers,
  createOffer,
  updateOffer,
  deleteOffer,
};
