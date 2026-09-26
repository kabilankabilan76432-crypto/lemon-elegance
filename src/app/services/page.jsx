'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Search, Clock, Sparkles, Calendar, ArrowUpDown } from 'lucide-react';

const CATEGORIES = [
  'All',
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

function ServicesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, [selectedCategory, searchQuery]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/services', {
        params: {
          category: selectedCategory === 'All' ? '' : selectedCategory,
          search: searchQuery,
          activeOnly: 'true',
        },
      });
      setServices(res.data);
    } catch (err) {
      console.error('Error loading services:', err);
    } finally {
      setLoading(false);
    }
  };

  const sortedServices = [...services].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'duration') return a.duration - b.duration;
    return 0;
  });

  return (
    <div className="space-y-10 pb-16">
      <section className="bg-gradient-to-r from-blush via-cream to-lavender py-14 border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest font-bold text-gold">Exclusive Menu</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-bronze">
            Beauty & Pampering <span className="gold-gradient-text italic font-normal">Catalog</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm text-bronze/70 leading-relaxed font-light">
            Select from our 10 signature service categories crafted for your aesthetic perfection.
          </p>

          <div className="max-w-xl mx-auto pt-2">
            <div className="relative">
              <Search className="w-5 h-5 text-gold absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search services (e.g. Gold Facial, Keratin Hair Spa)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white pl-12 pr-4 py-3.5 rounded-full border border-gold/30 shadow-sm focus:outline-none focus:ring-2 focus:ring-gold text-sm text-bronze placeholder:text-warm-gray"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-gold/15">
          <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'gold-gradient-bg text-white shadow-md'
                    : 'bg-white text-bronze/80 hover:bg-blush border border-gold/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-4 h-4 text-gold" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gold/30 rounded-xl px-3 py-1.5 text-xs font-medium text-bronze focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="popular">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="duration">Duration: Shortest</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white h-80 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : sortedServices.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-gold/20 space-y-3">
            <Sparkles className="w-10 h-10 text-gold mx-auto" />
            <h3 className="font-serif text-xl font-bold text-bronze">No Services Found</h3>
            <p className="text-xs text-warm-gray">Try resetting your search query or selecting a different category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedServices.map((service) => (
              <div key={service._id} className="bg-white rounded-2xl overflow-hidden border border-gold/20 shadow-sm hover:shadow-luxury transition flex flex-col group">
                <div className="relative h-52 overflow-hidden">
                  <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute top-3 left-3 bg-bronze/85 text-cream text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full">
                    {service.category}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif font-bold text-xl text-bronze group-hover:text-gold transition">{service.name}</h3>
                    <p className="text-xs text-bronze/70 leading-relaxed">{service.description}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="font-serif text-2xl font-extrabold text-bronze">₹{service.price}</span>
                      <span className="text-[11px] text-warm-gray block flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gold" /> {service.duration} Mins Ritual
                      </span>
                    </div>

                    <Link href={`/book?serviceId=${service._id}`} className="gold-gradient-bg text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full hover:opacity-95 transition shadow-sm flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function Services() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading services...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
