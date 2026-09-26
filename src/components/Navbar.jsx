'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, User, Calendar, LogOut, Menu, X, Shield, Gift } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => pathname === path;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-gold/20 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full gold-gradient-bg flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-bronze block leading-none">
                LEMON ELEGANCE
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-gold dark:text-gold-dark block mt-1">
                Your Beauty, Our Care
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-gold ${
                isActive('/') ? 'text-gold font-semibold border-b-2 border-gold pb-1' : 'text-bronze/80'
              }`}
            >
              Home
            </Link>
            <Link
              href="/services"
              className={`text-sm font-medium transition-colors hover:text-gold ${
                isActive('/services') ? 'text-gold font-semibold border-b-2 border-gold pb-1' : 'text-bronze/80'
              }`}
            >
              Services
            </Link>
            <Link
              href="/offers"
              className={`text-sm font-medium transition-colors hover:text-gold flex items-center gap-1 ${
                isActive('/offers') ? 'text-gold font-semibold border-b-2 border-gold pb-1' : 'text-bronze/80'
              }`}
            >
              <Gift className="w-4 h-4 text-gold" />
              Offers
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors hover:text-gold ${
                isActive('/about') ? 'text-gold font-semibold border-b-2 border-gold pb-1' : 'text-bronze/80'
              }`}
            >
              About Us
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold bg-bronze text-cream px-4 py-2 rounded-full hover:bg-bronze/90 transition shadow-sm"
                  >
                    <Shield className="w-4 h-4 text-gold" />
                    Admin Portal
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold border border-gold/40 text-bronze px-4 py-2 rounded-full hover:bg-blush transition"
                  >
                    <User className="w-4 h-4 text-gold" />
                    My Dashboard
                  </Link>
                )}

                <Link
                  href="/book"
                  className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold gold-gradient-bg text-white px-5 py-2.5 rounded-full hover:opacity-95 transition shadow-luxury hover:shadow-lg"
                >
                  <Calendar className="w-4 h-4" />
                  Book Now
                </Link>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-bronze/60 hover:text-red-600 transition rounded-full hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-semibold text-bronze hover:text-gold transition px-3 py-2">
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="text-xs uppercase tracking-wider font-bold gold-gradient-bg text-white px-5 py-2.5 rounded-full hover:opacity-95 transition shadow-luxury"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-bronze hover:text-gold transition focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-cream border-b border-gold/20 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base text-bronze">
            Home
          </Link>
          <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base text-bronze">
            Services
          </Link>
          <Link href="/offers" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base text-bronze">
            Offers
          </Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base text-bronze">
            About Us
          </Link>
          {user ? (
            <div className="pt-2 space-y-2">
              <Link href="/book" onClick={() => setMobileMenuOpen(false)} className="block text-center py-2 bg-gold text-white font-bold rounded-xl">
                Book Now
              </Link>
              <button onClick={handleLogout} className="w-full text-center py-2 text-red-600 font-bold">
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-2 space-y-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block text-center py-2 border border-gold rounded-xl">
                Log In
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block text-center py-2 bg-gold text-white font-bold rounded-xl">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
