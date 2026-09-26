import React from 'react';
import { Sparkles, Heart, ShieldCheck, Award, Smile, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-blush via-cream to-lavender py-16 border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest font-bold text-gold">The Lemon Elegance Story</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-bronze">
            Crafting Timeless <span className="gold-gradient-text italic font-normal">Beauty & Wellness</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-bronze/70 leading-relaxed font-light">
            Founded with a passion for holistic beauty, skin radiance, and hair spa luxury. We fuse world-class aesthetic techniques with personalized routine care.
          </p>
        </div>
      </section>

      {/* Brand Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-gold/20 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-full gold-gradient-bg text-white flex items-center justify-center mx-auto shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-bronze">Luxury Rituals</h3>
            <p className="text-xs text-bronze/70 leading-relaxed">
              Formulated with 24K gold foil, organic honey, and dermatologically tested botanical extracts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gold/20 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-full gold-gradient-bg text-white flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-bronze">Strict Hygiene</h3>
            <p className="text-xs text-bronze/70 leading-relaxed">
              Sterilized equipment, single-use kit disposables, and pristine salon ambiance guaranteed.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gold/20 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-full gold-gradient-bg text-white flex items-center justify-center mx-auto shadow-md">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-bronze">Personalized Care</h3>
            <p className="text-xs text-bronze/70 leading-relaxed">
              Smart beauty routine tracker ensures your hair and skin care schedule is always maintained.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gold/20 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-full gold-gradient-bg text-white flex items-center justify-center mx-auto shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-bronze">Master Artists</h3>
            <p className="text-xs text-bronze/70 leading-relaxed">
              Certified senior estheticians and hair couturiers with over 10+ years of mastery.
            </p>
          </div>
        </div>
      </section>

      {/* Parlour Ambience Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest font-bold text-gold">Sanctuary Ambience</span>
          <h2 className="font-serif text-3xl font-bold text-bronze">Step Into Pure Luxury</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl overflow-hidden shadow-md group relative">
            <img
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600"
              alt="Hair Spa Suite"
              className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bronze/80 via-transparent to-transparent flex items-end p-5">
              <span className="font-serif text-cream font-bold text-lg">Hair Spa Couture Lounge</span>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-md group relative">
            <img
              src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600"
              alt="Facial Suite"
              className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bronze/80 via-transparent to-transparent flex items-end p-5">
              <span className="font-serif text-cream font-bold text-lg">Skin Therapy & Facial Suites</span>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-md group relative">
            <img
              src="https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=600"
              alt="Nail Spa"
              className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bronze/80 via-transparent to-transparent flex items-end p-5">
              <span className="font-serif text-cream font-bold text-lg">Nail Care & Pedicure Sanctuary</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center pt-8">
        <Link
          to="/book"
          className="gold-gradient-bg text-white px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-luxury hover:shadow-xl transition"
        >
          Book Your Appointment <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
