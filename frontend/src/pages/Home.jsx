import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, Calendar, Clock, Star, ShieldCheck, Heart, Award, ArrowRight, CheckCircle2, Copy, Check } from 'lucide-react';

export default function Home() {
  const [featuredServices, setFeaturedServices] = useState([]);
  const [offers, setOffers] = useState([]);
  const [copiedCode, setCopiedCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [servicesRes, offersRes] = await Promise.all([
        axios.get('/api/services?activeOnly=true'),
        axios.get('/api/offers'),
      ]);
      setFeaturedServices(servicesRes.data.slice(0, 4));
      setOffers(offersRes.data);
    } catch (err) {
      console.error('Error loading homepage data:', err);
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2500);
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-[url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center">
        {/* Dark Luxury Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-bronze/95 via-bronze/80 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-cream w-full">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
              <Sparkles className="w-4 h-4" /> Premier Beauty & Spa Sanctuary
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-extrabold leading-tight text-cream">
              Indulge in <span className="gold-gradient-text italic font-normal">Pure Elegance</span> & Rejuvenation
            </h1>

            <p className="text-base sm:text-lg text-cream/80 font-light leading-relaxed">
              Step into a realm of luxury wellness. From 24K Gold Glow Facials to Keratin Hair Spa rituals and automated monthly care routines — experience beauty crafted exclusively for you.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/book"
                className="gold-gradient-bg text-white px-8 py-3.5 rounded-full font-bold text-sm tracking-wider uppercase shadow-luxury hover:shadow-xl transition transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" /> Book Appointment
              </Link>
              <Link
                to="/services"
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-cream px-8 py-3.5 rounded-full font-bold text-sm tracking-wider uppercase backdrop-blur-md transition flex items-center gap-2"
              >
                Explore Services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/15">
              <div>
                <span className="font-serif text-2xl font-bold text-gold block">10,000+</span>
                <span className="text-xs text-cream/70">Happy Glow Clients</span>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-gold block">15+ Yrs</span>
                <span className="text-xs text-cream/70">Excellence & Luxury</span>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-gold block">100%</span>
                <span className="text-xs text-cream/70">Organic & Premium</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offers Banner Carousel / Highlights */}
      {offers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blush via-cream to-lavender rounded-3xl p-8 sm:p-10 border border-gold/30 shadow-glass relative overflow-hidden">
            <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-48 h-48 rounded-full gold-gradient-bg opacity-10 blur-2xl pointer-events-none"></div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-xl">
                <span className="text-xs uppercase font-bold tracking-widest text-gold bg-white px-3 py-1 rounded-full border border-gold/30 shadow-xs">
                  Limited Time Exclusive Offer
                </span>
                <h2 className="font-serif text-3xl font-bold text-bronze">
                  {offers[0].title}
                </h2>
                <p className="text-sm text-bronze/70 leading-relaxed">
                  {offers[0].description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-gold/20 shadow-sm shrink-0">
                <div className="text-center sm:text-left">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-warm-gray block">Promo Code</span>
                  <span className="font-mono text-xl font-bold text-bronze tracking-widest">{offers[0].promoCode}</span>
                </div>
                <button
                  onClick={() => copyCode(offers[0].promoCode)}
                  className="flex items-center gap-1.5 text-xs font-bold bg-gold/10 text-gold-dark hover:bg-gold hover:text-white px-4 py-2.5 rounded-xl transition"
                >
                  {copiedCode === offers[0].promoCode ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy Code
                    </>
                  )}
                </button>
                <Link
                  to={`/book?promoCode=${offers[0].promoCode}`}
                  className="gold-gradient-bg text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:opacity-95 transition shadow-sm"
                >
                  Apply & Book
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-gold">Curated Signature Rituals</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bronze">
            Featured Salon Treatments
          </h2>
          <p className="text-sm text-bronze/70">
            Immerse yourself in our most popular beauty therapies designed for maximum glow, scalp restoration, and relaxation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredServices.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-2xl overflow-hidden border border-gold/20 shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-bronze/80 text-cream text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full backdrop-blur-sm">
                  {service.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-lg text-bronze group-hover:text-gold transition">
                    {service.name}
                  </h3>
                  <p className="text-xs text-bronze/70 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="font-serif text-xl font-extrabold text-bronze">₹{service.price}</span>
                    <span className="text-[11px] text-warm-gray block flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gold" /> {service.duration} mins
                    </span>
                  </div>
                  <Link
                    to={`/book?serviceId=${service._id}`}
                    className="gold-gradient-bg text-white text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 transition shadow-xs"
                  >
                    Book
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 border-2 border-gold text-gold hover:bg-gold hover:text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition"
          >
            View Full 10-Category Service Menu <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Routine Care Feature Highlight */}
      <section className="bg-blush border-y border-gold/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase font-bold tracking-widest text-gold bg-white px-3 py-1 rounded-full border border-gold/30">
                Automated Care System
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bronze leading-tight">
                Never Miss Your Monthly <span className="gold-gradient-text italic font-normal">Beauty Rituals</span>
              </h2>
              <p className="text-sm text-bronze/80 leading-relaxed">
                Consistent beauty care is key to glowing skin and luscious hair. With Lemon Elegance PMS, set your custom routine frequency (30, 45, or 60 days) during booking, and receive smart automated email notices when your routine is due!
              </p>

              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-xs font-semibold text-bronze">
                  <CheckCircle2 className="w-5 h-5 text-gold shrink-0" />
                  <span>1-Click Rebooking from your Personal Customer Dashboard</span>
                </li>
                <li className="flex items-center gap-3 text-xs font-semibold text-bronze">
                  <CheckCircle2 className="w-5 h-5 text-gold shrink-0" />
                  <span>Automated email reminder triggers powered by Node-Cron</span>
                </li>
                <li className="flex items-center gap-3 text-xs font-semibold text-bronze">
                  <CheckCircle2 className="w-5 h-5 text-gold shrink-0" />
                  <span>Flexible pause/resume toggles for your routine schedules</span>
                </li>
              </ul>

              <div className="pt-2">
                <Link
                  to="/dashboard"
                  className="gold-gradient-bg text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-md hover:opacity-95"
                >
                  Manage Your Care Routine <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800"
                  alt="Spa Routine Ritual"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bronze/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 p-5 bg-white/90 backdrop-blur-md rounded-2xl border border-gold/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gold-gradient-bg flex items-center justify-center text-white">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-bronze text-sm">Monthly Hydra Care Tracker</h4>
                      <p className="text-[11px] text-warm-gray">Next Due: In 5 Days • Automated Reminder Active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest font-bold text-gold">Client Experience</span>
          <h2 className="font-serif text-3xl font-bold text-bronze">Loved by Elegance Seekers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-gold/20 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-gold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-gold" />
              ))}
            </div>
            <p className="text-xs text-bronze/80 italic leading-relaxed">
              "The 24K Gold Facial transformed my skin right before my wedding! And the online slot booking system was so seamless — no waiting at all."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <div className="w-8 h-8 rounded-full bg-gold/20 text-gold font-bold text-xs flex items-center justify-center">
                PS
              </div>
              <div>
                <h4 className="text-xs font-bold text-bronze">Priya Sharma</h4>
                <span className="text-[10px] text-warm-gray">Regular Customer</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gold/20 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-gold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-gold" />
              ))}
            </div>
            <p className="text-xs text-bronze/80 italic leading-relaxed">
              "The monthly hair spa routine tracker is a game changer! I get email reminders right on time so my hair always stays soft and Keratin glossy."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <div className="w-8 h-8 rounded-full bg-lavender text-bronze font-bold text-xs flex items-center justify-center">
                AM
              </div>
              <div>
                <h4 className="text-xs font-bold text-bronze">Ananya Mehta</h4>
                <span className="text-[10px] text-warm-gray">Hair Care Subscriber</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gold/20 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-gold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-gold" />
              ))}
            </div>
            <p className="text-xs text-bronze/80 italic leading-relaxed">
              "The Royal HD Bridal makeup team made me feel like royalty on my big day. The ambience and luxury treatment at Lemon Elegance are unmatched."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <div className="w-8 h-8 rounded-full bg-blush text-gold-dark font-bold text-xs flex items-center justify-center">
                RK
              </div>
              <div>
                <h4 className="text-xs font-bold text-bronze">Rhea Kapoor</h4>
                <span className="text-[10px] text-warm-gray">Bridal Package Client</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-bronze rounded-3xl p-10 sm:p-14 text-center text-cream relative overflow-hidden space-y-6">
          <div className="max-w-xl mx-auto space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Ready to Experience Ultimate <span className="text-gold italic">Beauty & Care</span>?
            </h2>
            <p className="text-xs sm:text-sm text-cream/75">
              Book your session today with guaranteed time slots and instant promo discount application.
            </p>
            <Link
              to="/book"
              className="gold-gradient-bg text-white px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-luxury hover:shadow-xl transition"
            >
              <Calendar className="w-4 h-4" /> Book Appointment Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
