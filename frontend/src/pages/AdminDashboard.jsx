import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  DollarSign,
  Calendar,
  Users,
  Sparkles,
  Gift,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  AlertCircle,
  X,
} from 'lucide-react';

const CATEGORIES = [
  'Facial',
  'Hair Cut',
  'Hair Spa',
  'Cleanup',
  'Manicure',
  'Pedicure',
  'Waxing',
  'Threading',
  'Hair Styling',
  'Bridal Makeup',
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [offers, setOffers] = useState([]);
  const [reminders, setReminders] = useState([]);

  const [activeTab, setActiveTab] = useState('appointments'); // appointments | services | offers | reminders
  const [loading, setLoading] = useState(true);

  // Filters for Appointments
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Service Modal State
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    category: 'Facial',
    description: '',
    price: '',
    duration: 30,
    imageUrl: '',
    isActive: true,
  });

  // Offer Modal State
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    promoCode: '',
    discountPercent: 10,
    validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    isActive: true,
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, appsRes, servsRes, offersRes, remsRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/appointments/admin/all'),
        axios.get('/api/services?activeOnly=false'),
        axios.get('/api/offers/admin/all'),
        axios.get('/api/reminders/admin/all'),
      ]);

      setStats(statsRes.data);
      setAppointments(appsRes.data);
      setServices(servsRes.data);
      setOffers(offersRes.data);
      setReminders(remsRes.data);
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Appointment Actions
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`/api/appointments/status/${id}`, { status: newStatus });
      fetchAdminData();
    } catch (err) {
      alert('Error updating appointment status');
    }
  };

  // Service CRUD
  const handleOpenServiceModal = (serv = null) => {
    if (serv) {
      setEditingService(serv);
      setServiceForm({
        name: serv.name,
        category: serv.category,
        description: serv.description,
        price: serv.price,
        duration: serv.duration,
        imageUrl: serv.imageUrl,
        isActive: serv.isActive,
      });
    } else {
      setEditingService(null);
      setServiceForm({
        name: '',
        category: 'Facial',
        description: '',
        price: '',
        duration: 30,
        imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600',
        isActive: true,
      });
    }
    setServiceModalOpen(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await axios.put(`/api/services/${editingService._id}`, serviceForm);
      } else {
        await axios.post('/api/services', serviceForm);
      }
      setServiceModalOpen(false);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving service');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete this service permanently?')) return;
    try {
      await axios.delete(`/api/services/${id}`);
      fetchAdminData();
    } catch (err) {
      alert('Error deleting service');
    }
  };

  // Offer CRUD
  const handleOpenOfferModal = (off = null) => {
    if (off) {
      setEditingOffer(off);
      setOfferForm({
        title: off.title,
        description: off.description,
        promoCode: off.promoCode,
        discountPercent: off.discountPercent,
        validUntil: off.validUntil ? new Date(off.validUntil).toISOString().split('T')[0] : '',
        isActive: off.isActive,
      });
    } else {
      setEditingOffer(null);
      setOfferForm({
        title: '',
        description: '',
        promoCode: '',
        discountPercent: 15,
        validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        isActive: true,
      });
    }
    setOfferModalOpen(true);
  };

  const handleSaveOffer = async (e) => {
    e.preventDefault();
    try {
      if (editingOffer) {
        await axios.put(`/api/offers/${editingOffer._id}`, offerForm);
      } else {
        await axios.post('/api/offers', offerForm);
      }
      setOfferModalOpen(false);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving offer');
    }
  };

  const handleDeleteOffer = async (id) => {
    if (!window.confirm('Delete this offer code permanently?')) return;
    try {
      await axios.delete(`/api/offers/${id}`);
      fetchAdminData();
    } catch (err) {
      alert('Error deleting offer');
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    const matchStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchQuery =
      !searchQuery ||
      app.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.serviceId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.date?.includes(searchQuery);
    return matchStatus && matchQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Admin Header */}
      <div className="bg-bronze text-cream p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs uppercase font-bold tracking-wider">
            <Shield className="w-3.5 h-3.5" /> Super Admin Portal
          </div>
          <h1 className="font-serif text-3xl font-extrabold text-cream">LEMON ELEGANCE Command Center</h1>
          <p className="text-xs text-cream/70">Real-time salon operations, catalog manager & care routine monitor</p>
        </div>
        <div className="flex items-center gap-3 z-10">
          <button
            onClick={fetchAdminData}
            className="gold-gradient-bg text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-95 transition flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gold/20 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-warm-gray">Total Revenue</span>
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <span className="font-serif text-3xl font-extrabold text-bronze block">₹{stats.totalRevenue}</span>
            <span className="text-[10px] text-emerald-700 font-semibold">From completed rituals</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gold/20 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-warm-gray">Appointments</span>
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <span className="font-serif text-3xl font-extrabold text-bronze block">{stats.totalAppointments}</span>
            <span className="text-[10px] text-amber-700 font-semibold">{stats.pendingAppointments} Pending slots</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gold/20 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-warm-gray">Active Customers</span>
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <span className="font-serif text-3xl font-extrabold text-bronze block">{stats.totalCustomers}</span>
            <span className="text-[10px] text-warm-gray font-semibold">Registered clients</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gold/20 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-warm-gray">Routine Schedules</span>
              <div className="w-8 h-8 rounded-full bg-gold/20 text-gold-dark flex items-center justify-center">
                <RefreshCw className="w-4 h-4" />
              </div>
            </div>
            <span className="font-serif text-3xl font-extrabold text-bronze block">{stats.activeReminders}</span>
            <span className="text-[10px] text-gold-dark font-semibold">Automated beauty routines</span>
          </div>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="flex items-center gap-4 border-b border-gold/20 pb-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-3 text-sm font-serif font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'appointments' ? 'text-gold border-b-2 border-gold' : 'text-bronze/60 hover:text-bronze'
          }`}
        >
          <Calendar className="w-4 h-4" /> Appointments ({appointments.length})
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`pb-3 text-sm font-serif font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'services' ? 'text-gold border-b-2 border-gold' : 'text-bronze/60 hover:text-bronze'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Service Catalog ({services.length})
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`pb-3 text-sm font-serif font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'offers' ? 'text-gold border-b-2 border-gold' : 'text-bronze/60 hover:text-bronze'
          }`}
        >
          <Gift className="w-4 h-4" /> Offers & Vouchers ({offers.length})
        </button>

        <button
          onClick={() => setActiveTab('reminders')}
          className={`pb-3 text-sm font-serif font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'reminders' ? 'text-gold border-b-2 border-gold' : 'text-bronze/60 hover:text-bronze'
          }`}
        >
          <RefreshCw className="w-4 h-4" /> Routine Monitor ({reminders.length})
        </button>
      </div>

      {/* Tab 1: Appointments Manager */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-gold/20 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-gold absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search customer, service or date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-cream/50 rounded-xl border border-gold/30 text-xs text-bronze focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                    statusFilter === st
                      ? 'gold-gradient-bg text-white shadow-xs'
                      : 'bg-cream text-bronze/70 hover:bg-blush'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gold/20 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream/70 font-serif text-bronze border-b border-gold/20">
                  <tr>
                    <th className="p-4">Customer Info</th>
                    <th className="p-4">Service</th>
                    <th className="p-4">Date & Slot</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-warm-gray">
                        No appointments found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((app) => (
                      <tr key={app._id} className="hover:bg-cream/20 transition">
                        <td className="p-4 font-medium">
                          <div className="font-bold text-bronze">{app.userId?.name || 'Customer'}</div>
                          <div className="text-[11px] text-warm-gray">{app.userId?.email} • {app.userId?.phone}</div>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-bronze">{app.serviceId?.name}</span>
                          <span className="text-[10px] text-warm-gray block">{app.serviceId?.category}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-bronze block">{app.date}</span>
                          <span className="text-gold-dark font-medium">{app.timeSlot}</span>
                        </td>
                        <td className="p-4 font-serif font-bold text-bronze">
                          ₹{app.finalPrice !== undefined ? app.finalPrice : app.serviceId?.price}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              app.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : app.status === 'completed'
                                ? 'bg-blue-100 text-blue-800'
                                : app.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {app.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateStatus(app._id, 'confirmed')}
                              className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold text-[11px] hover:bg-emerald-700 transition"
                            >
                              Confirm
                            </button>
                          )}
                          {app.status === 'confirmed' && (
                            <button
                              onClick={() => handleUpdateStatus(app._id, 'completed')}
                              className="bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold text-[11px] hover:bg-blue-700 transition"
                            >
                              Mark Done
                            </button>
                          )}
                          {app.status !== 'cancelled' && app.status !== 'completed' && (
                            <button
                              onClick={() => handleUpdateStatus(app._id, 'cancelled')}
                              className="text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg font-semibold text-[11px] transition"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Service Catalog CRUD */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-xl text-bronze">Salon Services Catalog</h3>
            <button
              onClick={() => handleOpenServiceModal()}
              className="gold-gradient-bg text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add New Service
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((serv) => (
              <div key={serv._id} className="bg-white rounded-2xl border border-gold/20 shadow-sm p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="relative h-40 rounded-xl overflow-hidden">
                    <img src={serv.imageUrl} alt={serv.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-bronze/80 text-cream text-[10px] uppercase font-bold px-3 py-0.5 rounded-full">
                      {serv.category}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-lg text-bronze">{serv.name}</h4>
                  <p className="text-xs text-warm-gray line-clamp-2">{serv.description}</p>
                  <div className="flex items-center justify-between text-xs font-bold text-bronze pt-2 border-t border-gray-100">
                    <span className="font-serif text-lg">₹{serv.price}</span>
                    <span className="text-warm-gray">{serv.duration} Mins</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleOpenServiceModal(serv)}
                    className="p-2 text-gold-dark hover:bg-gold/10 rounded-lg transition"
                    title="Edit Service"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(serv._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete Service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Offers CRUD */}
      {activeTab === 'offers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-xl text-bronze">Promotions & Discount Vouchers</h3>
            <button
              onClick={() => handleOpenOfferModal()}
              className="gold-gradient-bg text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create Promo Code
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offers.map((off) => (
              <div key={off._id} className="bg-white rounded-3xl p-6 border border-gold/20 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-lg text-gold-dark tracking-widest">{off.promoCode}</span>
                    <span className="bg-gold/20 text-gold-dark text-xs font-bold px-3 py-1 rounded-full">
                      {off.discountPercent}% OFF
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-lg text-bronze">{off.title}</h4>
                  <p className="text-xs text-warm-gray">{off.description}</p>
                  <p className="text-[11px] text-warm-gray">Valid Until: {new Date(off.validUntil).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleOpenOfferModal(off)}
                    className="p-2 text-gold-dark hover:bg-gold/10 rounded-lg transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteOffer(off._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Beauty Care Reminders Monitor */}
      {activeTab === 'reminders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-xl text-bronze">Customer Beauty Care Routines Monitor</h3>
          </div>

          <div className="bg-white rounded-3xl border border-gold/20 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream/70 font-serif text-bronze border-b border-gold/20">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Service Routine</th>
                  <th className="p-4">Frequency</th>
                  <th className="p-4">Next Due Date</th>
                  <th className="p-4">Cron Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reminders.map((rem) => (
                  <tr key={rem._id} className="hover:bg-cream/20">
                    <td className="p-4 font-bold text-bronze">
                      {rem.userId?.name}
                      <span className="text-[10px] text-warm-gray block font-normal">{rem.userId?.email}</span>
                    </td>
                    <td className="p-4 font-medium text-bronze">{rem.serviceId?.name}</td>
                    <td className="p-4">Every {rem.frequencyDays} Days</td>
                    <td className="p-4 font-bold text-gold-dark">
                      {rem.nextDueDate ? new Date(rem.nextDueDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${rem.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                        {rem.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Service Modal */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 bg-bronze/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <h3 className="font-serif font-bold text-xl text-bronze">
                {editingService ? 'Edit Salon Service' : 'Add New Service'}
              </h3>
              <button onClick={() => setServiceModalOpen(false)} className="p-1 text-warm-gray hover:text-bronze">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-bronze">Service Name</label>
                <input
                  type="text"
                  required
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  placeholder="e.g. 24K Gold Glow Facial"
                  className="w-full bg-cream/50 p-2.5 rounded-xl border border-gold/30 text-bronze"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-bronze">Category</label>
                <select
                  value={serviceForm.category}
                  onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                  className="w-full bg-cream/50 p-2.5 rounded-xl border border-gold/30 text-bronze"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-bronze">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: Number(e.target.value) })}
                    className="w-full bg-cream/50 p-2.5 rounded-xl border border-gold/30 text-bronze"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-bronze">Duration (Minutes)</label>
                  <input
                    type="number"
                    required
                    min="5"
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration: Number(e.target.value) })}
                    className="w-full bg-cream/50 p-2.5 rounded-xl border border-gold/30 text-bronze"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-bronze">Image URL</label>
                <input
                  type="url"
                  value={serviceForm.imageUrl}
                  onChange={(e) => setServiceForm({ ...serviceForm, imageUrl: e.target.value })}
                  className="w-full bg-cream/50 p-2.5 rounded-xl border border-gold/30 text-bronze"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-bronze">Description</label>
                <textarea
                  rows={3}
                  required
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="w-full bg-cream/50 p-2.5 rounded-xl border border-gold/30 text-bronze"
                ></textarea>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-warm-gray font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="gold-gradient-bg text-white px-6 py-2 rounded-xl font-bold shadow-sm">
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Offer Modal */}
      {offerModalOpen && (
        <div className="fixed inset-0 z-50 bg-bronze/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <h3 className="font-serif font-bold text-xl text-bronze">
                {editingOffer ? 'Edit Promo Offer' : 'Create Promo Offer'}
              </h3>
              <button onClick={() => setOfferModalOpen(false)} className="p-1 text-warm-gray hover:text-bronze">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-bronze">Offer Title</label>
                <input
                  type="text"
                  required
                  value={offerForm.title}
                  onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                  placeholder="e.g. Festive Spa Glow"
                  className="w-full bg-cream/50 p-2.5 rounded-xl border border-gold/30 text-bronze"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-bronze">Promo Code</label>
                  <input
                    type="text"
                    required
                    value={offerForm.promoCode}
                    onChange={(e) => setOfferForm({ ...offerForm, promoCode: e.target.value.toUpperCase() })}
                    placeholder="GLOW20"
                    className="w-full bg-cream/50 p-2.5 rounded-xl border border-gold/30 font-mono text-bronze uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-bronze">Discount (%)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={offerForm.discountPercent}
                    onChange={(e) => setOfferForm({ ...offerForm, discountPercent: Number(e.target.value) })}
                    className="w-full bg-cream/50 p-2.5 rounded-xl border border-gold/30 text-bronze"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-bronze">Valid Until Date</label>
                <input
                  type="date"
                  required
                  value={offerForm.validUntil}
                  onChange={(e) => setOfferForm({ ...offerForm, validUntil: e.target.value })}
                  className="w-full bg-cream/50 p-2.5 rounded-xl border border-gold/30 text-bronze"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-bronze">Description</label>
                <textarea
                  rows={2}
                  required
                  value={offerForm.description}
                  onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                  className="w-full bg-cream/50 p-2.5 rounded-xl border border-gold/30 text-bronze"
                ></textarea>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOfferModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-warm-gray font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="gold-gradient-bg text-white px-6 py-2 rounded-xl font-bold shadow-sm">
                  Save Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
