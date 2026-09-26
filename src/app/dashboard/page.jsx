'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Calendar, RefreshCw, Power, ArrowRight } from 'lucide-react';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [activeTab, setActiveTab] = useState('appointments');
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [appsRes, remsRes] = await Promise.all([
        axios.get('/api/appointments/my-appointments'),
        axios.get('/api/reminders/my-reminders'),
      ]);
      setAppointments(appsRes.data);
      setReminders(remsRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await axios.put(`/api/appointments/cancel/${id}`);
      setActionMessage('Appointment cancelled successfully.');
      fetchDashboardData();
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const handleToggleReminder = async (id) => {
    try {
      await axios.put(`/api/reminders/toggle/${id}`);
      fetchDashboardData();
    } catch (err) {
      alert('Error updating reminder status');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-200">Confirmed</span>;
      case 'completed':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-blue-200">Completed</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-red-200">Cancelled</span>;
      default:
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-amber-200">Pending</span>;
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div className="bg-gradient-to-r from-blush via-cream to-lavender p-8 rounded-3xl border border-gold/30 shadow-glass flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full gold-gradient-bg text-white font-serif font-bold text-2xl flex items-center justify-center shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-gold bg-white px-3 py-1 rounded-full border border-gold/20">
                Customer Portal
              </span>
              <h1 className="font-serif text-3xl font-extrabold text-bronze mt-1">{user?.name}</h1>
              <p className="text-xs text-warm-gray mt-0.5">{user?.email} • {user?.phone}</p>
            </div>
          </div>

          <Link
            href="/book"
            className="gold-gradient-bg text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-luxury hover:opacity-95 transition shrink-0 flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" /> Book New Ritual
          </Link>
        </div>

        {actionMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-4 rounded-2xl">
            {actionMessage}
          </div>
        )}

        <div className="flex items-center gap-4 border-b border-gold/20 pb-1">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`pb-3 text-sm font-serif font-bold transition-all relative flex items-center gap-2 ${
              activeTab === 'appointments' ? 'text-gold border-b-2 border-gold' : 'text-bronze/60 hover:text-bronze'
            }`}
          >
            <Calendar className="w-4 h-4" /> My Appointments ({appointments.length})
          </button>

          <button
            onClick={() => setActiveTab('routine')}
            className={`pb-3 text-sm font-serif font-bold transition-all relative flex items-center gap-2 ${
              activeTab === 'routine' ? 'text-gold border-b-2 border-gold' : 'text-bronze/60 hover:text-bronze'
            }`}
          >
            <RefreshCw className="w-4 h-4" /> Monthly Care Routines ({reminders.length})
          </button>
        </div>

        {activeTab === 'appointments' && (
          <div className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white h-24 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : appointments.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-gold/20 space-y-3">
                <Calendar className="w-10 h-10 text-gold mx-auto" />
                <h3 className="font-serif text-xl font-bold text-bronze">No Appointments Booked Yet</h3>
                <Link href="/book" className="gold-gradient-bg text-white px-5 py-2 rounded-full text-xs font-bold inline-block">
                  Book First Session
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {appointments.map((app) => (
                  <div key={app._id} className="bg-white p-6 rounded-2xl border border-gold/20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {app.serviceId?.imageUrl && (
                        <img src={app.serviceId.imageUrl} alt={app.serviceId?.name} className="w-16 h-16 rounded-xl object-cover border border-gold/20 shrink-0" />
                      )}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-lg font-bold text-bronze">{app.serviceId?.name || 'Salon Ritual'}</span>
                          {getStatusBadge(app.status)}
                        </div>
                        <p className="text-xs text-warm-gray flex items-center gap-3">
                          <span>🗓 {app.date}</span>
                          <span>⏰ {app.timeSlot}</span>
                          <span>⌛ {app.serviceId?.duration} Mins</span>
                        </p>
                        {app.notes && <p className="text-[11px] text-bronze/70 italic">Notes: "{app.notes}"</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 justify-between">
                      <div>
                        <span className="text-[10px] text-warm-gray block">Price Paid</span>
                        <span className="font-serif text-lg font-bold text-bronze">₹{app.finalPrice !== undefined ? app.finalPrice : app.serviceId?.price}</span>
                      </div>

                      {app.status !== 'cancelled' && app.status !== 'completed' && (
                        <button
                          onClick={() => handleCancelAppointment(app._id)}
                          className="text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-xl transition"
                        >
                          Cancel Slot
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'routine' && (
          <div className="space-y-6">
            <div className="bg-blush/60 p-5 rounded-2xl border border-gold/20 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-serif font-bold text-bronze text-base">Monthly Beauty Routine Tracker</h3>
                <p className="text-xs text-warm-gray">Keep your skin glowing and hair restored with custom routine due tracking.</p>
              </div>
              <Link href="/book" className="bg-white text-bronze border border-gold/40 hover:bg-gold hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition">
                + Add New Routine Ritual
              </Link>
            </div>

            {reminders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-gold/20 space-y-3">
                <RefreshCw className="w-10 h-10 text-gold mx-auto" />
                <h3 className="font-serif text-xl font-bold text-bronze">No Care Routines Configured</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reminders.map((rem) => (
                  <div key={rem._id} className="bg-white p-6 rounded-3xl border border-gold/20 shadow-sm space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-cream text-gold-dark border border-gold/30">
                          Every {rem.frequencyDays} Days Routine
                        </span>
                        <button
                          onClick={() => handleToggleReminder(rem._id)}
                          className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 transition ${
                            rem.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          <Power className="w-3 h-3" /> {rem.status === 'active' ? 'Active' : 'Paused'}
                        </button>
                      </div>

                      <h4 className="font-serif font-bold text-xl text-bronze">{rem.serviceId?.name}</h4>
                      <p className="text-xs text-warm-gray line-clamp-2">{rem.serviceId?.description}</p>
                    </div>

                    <div className="pt-2">
                      <Link href={`/book?serviceId=${rem.serviceId?._id}`} className="w-full gold-gradient-bg text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm text-center flex items-center justify-center gap-2">
                        1-Click Rebook Routine <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
