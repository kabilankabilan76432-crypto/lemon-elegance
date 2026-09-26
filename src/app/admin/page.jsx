'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Shield, DollarSign, Calendar, Users, Sparkles, Gift, RefreshCw, Plus, Edit, Trash2, X } from 'lucide-react';

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

  const [activeTab, setActiveTab] = useState('appointments');
  const [loading, setLoading] = useState(true);

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

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`/api/appointments/status/${id}`, { status: newStatus });
      fetchAdminData();
    } catch (err) {
      alert('Error updating appointment status');
    }
  };

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
        await axios.post('/api/offers/admin/all', offerForm);
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

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div className="bg-bronze text-cream p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs uppercase font-bold tracking-wider">
              <Shield className="w-3.5 h-3.5" /> Super Admin Portal
            </div>
            <h1 className="font-serif text-3xl font-extrabold text-cream">LEMON ELEGANCE Command Center</h1>
            <p className="text-xs text-cream/70">Real-time salon operations, catalog manager & care routine monitor</p>
          </div>
          <button
            onClick={fetchAdminData}
            className="gold-gradient-bg text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-95 transition flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Data
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gold/20 shadow-sm space-y-2">
              <span className="text-xs font-semibold text-warm-gray">Total Revenue</span>
              <span className="font-serif text-3xl font-extrabold text-bronze block">₹{stats.totalRevenue}</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gold/20 shadow-sm space-y-2">
              <span className="text-xs font-semibold text-warm-gray">Appointments</span>
              <span className="font-serif text-3xl font-extrabold text-bronze block">{stats.totalAppointments}</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gold/20 shadow-sm space-y-2">
              <span className="text-xs font-semibold text-warm-gray">Active Customers</span>
              <span className="font-serif text-3xl font-extrabold text-bronze block">{stats.totalCustomers}</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gold/20 shadow-sm space-y-2">
              <span className="text-xs font-semibold text-warm-gray">Routine Schedules</span>
              <span className="font-serif text-3xl font-extrabold text-bronze block">{stats.activeReminders}</span>
            </div>
          </div>
        )}

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
        </div>

        {activeTab === 'appointments' && (
          <div className="bg-white rounded-3xl border border-gold/20 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream/70 font-serif text-bronze border-b border-gold/20">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Date & Slot</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map((app) => (
                  <tr key={app._id} className="hover:bg-cream/20">
                    <td className="p-4 font-bold text-bronze">{app.userId?.name || 'Customer'}</td>
                    <td className="p-4">{app.serviceId?.name}</td>
                    <td className="p-4 font-bold">{app.date} - {app.timeSlot}</td>
                    <td className="p-4 font-serif font-bold">₹{app.finalPrice !== undefined ? app.finalPrice : app.serviceId?.price}</td>
                    <td className="p-4 font-bold uppercase text-[10px]">{app.status}</td>
                    <td className="p-4 text-right space-x-2">
                      {app.status === 'pending' && (
                        <button onClick={() => handleUpdateStatus(app._id, 'confirmed')} className="bg-emerald-600 text-white px-3 py-1 rounded font-bold text-[11px]">
                          Confirm
                        </button>
                      )}
                      {app.status === 'confirmed' && (
                        <button onClick={() => handleUpdateStatus(app._id, 'completed')} className="bg-blue-600 text-white px-3 py-1 rounded font-bold text-[11px]">
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-xl text-bronze">Salon Services Catalog</h3>
              <button onClick={() => handleOpenServiceModal()} className="gold-gradient-bg text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Add New Service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((serv) => (
                <div key={serv._id} className="bg-white rounded-2xl border border-gold/20 shadow-sm p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="font-serif font-bold text-lg text-bronze">{serv.name}</h4>
                    <p className="text-xs text-warm-gray">{serv.description}</p>
                    <span className="font-serif text-lg font-bold block">₹{serv.price}</span>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                    <button onClick={() => handleOpenServiceModal(serv)} className="p-2 text-gold-dark"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteService(serv._id)} className="p-2 text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'offers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-xl text-bronze">Promotions & Vouchers</h3>
              <button onClick={() => handleOpenOfferModal()} className="gold-gradient-bg text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Create Promo Code
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offers.map((off) => (
                <div key={off._id} className="bg-white rounded-3xl p-6 border border-gold/20 shadow-sm space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="font-mono font-bold text-lg text-gold-dark">{off.promoCode} ({off.discountPercent}% OFF)</span>
                    <h4 className="font-serif font-bold text-lg text-bronze mt-1">{off.title}</h4>
                    <p className="text-xs text-warm-gray">{off.description}</p>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                    <button onClick={() => handleOpenOfferModal(off)} className="p-2 text-gold-dark"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteOffer(off._id)} className="p-2 text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal for Service */}
        {serviceModalOpen && (
          <div className="fixed inset-0 z-50 bg-bronze/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4">
              <div className="flex justify-between border-b pb-2">
                <h3 className="font-serif font-bold text-lg">{editingService ? 'Edit Service' : 'Add Service'}</h3>
                <button onClick={() => setServiceModalOpen(false)}><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSaveService} className="space-y-3 text-xs">
                <input type="text" required placeholder="Name" value={serviceForm.name} onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })} className="w-full p-2 border rounded-xl" />
                <select value={serviceForm.category} onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })} className="w-full p-2 border rounded-xl">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="number" required placeholder="Price" value={serviceForm.price} onChange={(e) => setServiceForm({ ...serviceForm, price: Number(e.target.value) })} className="w-full p-2 border rounded-xl" />
                <textarea required placeholder="Description" value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} className="w-full p-2 border rounded-xl" />
                <button type="submit" className="w-full gold-gradient-bg text-white py-2.5 rounded-xl font-bold">Save</button>
              </form>
            </div>
          </div>
        )}

        {/* Modal for Offer */}
        {offerModalOpen && (
          <div className="fixed inset-0 z-50 bg-bronze/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4">
              <div className="flex justify-between border-b pb-2">
                <h3 className="font-serif font-bold text-lg">{editingOffer ? 'Edit Offer' : 'Create Offer'}</h3>
                <button onClick={() => setOfferModalOpen(false)}><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSaveOffer} className="space-y-3 text-xs">
                <input type="text" required placeholder="Title" value={offerForm.title} onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })} className="w-full p-2 border rounded-xl" />
                <input type="text" required placeholder="Promo Code" value={offerForm.promoCode} onChange={(e) => setOfferForm({ ...offerForm, promoCode: e.target.value.toUpperCase() })} className="w-full p-2 border rounded-xl font-mono uppercase" />
                <input type="number" required placeholder="Discount %" value={offerForm.discountPercent} onChange={(e) => setOfferForm({ ...offerForm, discountPercent: Number(e.target.value) })} className="w-full p-2 border rounded-xl" />
                <textarea required placeholder="Description" value={offerForm.description} onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })} className="w-full p-2 border rounded-xl" />
                <button type="submit" className="w-full gold-gradient-bg text-white py-2.5 rounded-xl font-bold">Save</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
