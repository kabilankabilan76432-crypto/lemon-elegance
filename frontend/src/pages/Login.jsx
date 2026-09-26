import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, LogIn, Shield, UserCheck, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-gold/30 shadow-glass space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full gold-gradient-bg flex items-center justify-center text-white mx-auto shadow-md">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="font-serif text-3xl font-extrabold text-bronze">Welcome Back</h2>
          <p className="text-xs text-bronze/70">Sign in to manage your appointments & beauty care routines</p>
        </div>

        {/* Quick Demo Login Preset Buttons */}
        <div className="bg-blush/60 p-4 rounded-2xl border border-gold/20 space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gold-dark block text-center">
            Quick Demo Credentials Fill
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@lemonelegance.com', 'admin123')}
              className="flex items-center justify-center gap-1.5 bg-bronze text-cream text-[11px] font-bold py-2 rounded-xl hover:bg-bronze/90 transition shadow-xs"
            >
              <Shield className="w-3.5 h-3.5 text-gold" /> Admin Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('priya@gmail.com', 'client123')}
              className="flex items-center justify-center gap-1.5 bg-white text-bronze border border-gold/40 text-[11px] font-bold py-2 rounded-xl hover:bg-gold/10 transition shadow-xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-gold" /> Customer Demo
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-bronze">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-cream/50 pl-10 pr-4 py-2.5 rounded-xl border border-gold/30 text-xs text-bronze focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gold-gradient-bg text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:opacity-95 transition flex items-center justify-center gap-2 pt-3"
          >
            {loading ? 'Authenticating...' : <><LogIn className="w-4 h-4" /> Sign In</>}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-bronze/70">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-gold-dark hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}
