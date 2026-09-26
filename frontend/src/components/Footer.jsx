import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-bronze text-cream pt-16 pb-12 border-t-4 border-gold mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full gold-gradient-bg flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-cream">
                LEMON ELEGANCE
              </span>
            </div>
            <p className="text-xs text-cream/70 leading-relaxed font-light">
              Your premier sanctuary for high-end luxury beauty treatments, holistic skin therapies, hair spa couture, and customized routine beauty care.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gold hover:bg-gold hover:text-white transition">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gold hover:bg-gold hover:text-white transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gold hover:bg-gold hover:text-white transition">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-gold tracking-wide">Quick Navigation</h4>
            <ul className="space-y-2 text-xs text-cream/80">
              <li>
                <Link to="/" className="hover:text-gold transition">Luxury Landing</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-gold transition">Services Catalog</Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-gold transition">Exclusive Offers & Promos</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold transition">Our Brand Story</Link>
              </li>
              <li>
                <Link to="/book" className="hover:text-gold transition">Book Appointment</Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-gold tracking-wide">Beauty Rituals</h4>
            <ul className="space-y-2 text-xs text-cream/80">
              <li><Link to="/services?category=Facial" className="hover:text-gold transition">24K Gold & Hydra Facials</Link></li>
              <li><Link to="/services?category=Hair Spa" className="hover:text-gold transition">Keratin Hair Spa Therapy</Link></li>
              <li><Link to="/services?category=Bridal Makeup" className="hover:text-gold transition">Royal HD Bridal Couture</Link></li>
              <li><Link to="/services?category=Manicure" className="hover:text-gold transition">Rose Petal Manicure & Pedicure</Link></li>
              <li><Link to="/services?category=Hair Cut" className="hover:text-gold transition">Precision Signature Cuts</Link></li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-gold tracking-wide">Parlour Info</h4>
            <div className="space-y-2 text-xs text-cream/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>124 Elegance Boulevard, Royal Park Avenue, Suite 402</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <span>concierge@lemonelegance.com</span>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <Clock className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>Mon - Sun: 09:00 AM - 08:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 text-center text-[11px] text-cream/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} LEMON ELEGANCE PMS. All rights reserved. "Your Beauty, Our Care"</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gold transition">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-gold transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
