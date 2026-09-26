const Service = require('../models/Service');

// @route GET /api/services
const getAllServices = async (req, res) => {
  try {
    const { category, search, activeOnly } = req.query;
    let query = {};

    if (activeOnly !== 'false') {
      query.isActive = true;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const services = await Service.find(query).sort({ category: 1, name: 1 });
    return res.json(services);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
};

// @route GET /api/services/:id
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    return res.json(service);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching service', error: error.message });
  }
};

// @route POST /api/services (Admin)
const createService = async (req, res) => {
  try {
    const { name, category, description, price, duration, imageUrl, isActive } = req.body;
    if (!name || !category || !description || price === undefined) {
      return res.status(400).json({ message: 'Missing required service fields' });
    }

    const service = await Service.create({
      name,
      category,
      description,
      price,
      duration: duration || 30,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=600',
      isActive: isActive !== undefined ? isActive : true,
    });

    return res.status(201).json(service);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating service', error: error.message });
  }
};

// @route PUT /api/services/:id (Admin)
const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating service', error: error.message });
  }
};

// @route DELETE /api/services/:id (Admin)
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await Service.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
