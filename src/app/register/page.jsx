'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Mail, Lock, User, Phone, UserPlus, AlertCircle } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await register(
        formData.name,
        formData.email,
        formData.phone,
        formData.password,
        formData.role
      );
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-gold/30 shadow-glass space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full gold-gradient-bg flex items-center justify-center text-white mx-auto shadow-md">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="font-serif text-3xl font-extrabold text-bronze">Create Account</h2>
          <p className="text-xs text-bronze/70">Join Lemon Elegance for personalized beauty treatments</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-bronze">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Priya Sharma"
                className="w-full bg-cream/50 pl-10 pr-4 py-2.5 rounded-xl border border-gold/30 text-xs text-bronze focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-bronze">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="priya@example.com"
                className="w-full bg-cream/50 pl-10 pr-4 py-2.5 rounded-xl border border-gold/30 text-xs text-bronze focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-bronze">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full bg-cream/50 pl-10 pr-4 py-2.5 rounded-xl border border-gold/30 text-xs text-bronze focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-bronze">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full bg-cream/50 pl-10 pr-4 py-2.5 rounded-xl border border-gold/30 text-xs text-bronze focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-bronze">Register As</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-cream/50 px-3 py-2.5 rounded-xl border border-gold/30 text-xs text-bronze focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="customer">Customer (Book appointments & routine tracker)</option>
              <option value="admin">Salon Admin (Manage services, appointments, offers)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gold-gradient-bg text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:opacity-95 transition flex items-center justify-center gap-2"
          >
            {loading ? 'Creating Account...' : <><UserPlus className="w-4 h-4" /> Create Account</>}
          </button>
        </form>

        <div className="text-center text-xs text-bronze/70">
          Already registered?{' '}
          <Link href="/login" className="font-bold text-gold-dark hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
