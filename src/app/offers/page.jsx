'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Gift, Copy, Check } from 'lucide-react';

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [copiedCode, setCopiedCode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/offers');
      setOffers(res.data);
    } catch (err) {
      console.error('Error fetching offers:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2500);
  };

  return (
    <div className="space-y-12 pb-16">
      <section className="bg-gradient-to-r from-blush via-cream to-lavender py-14 border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest font-bold text-gold flex items-center justify-center gap-1">
            <Gift className="w-4 h-4" /> Exclusive Deals & Promo Codes
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-bronze">
            Special Pampering <span className="gold-gradient-text italic font-normal">Packages</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm text-bronze/70 leading-relaxed font-light">
            Enjoy luxury beauty treatments at exceptional values with our valid promotional voucher codes.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white h-48 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : offers.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-gold/20 space-y-3">
            <Gift className="w-10 h-10 text-gold mx-auto" />
            <h3 className="font-serif text-xl font-bold text-bronze">No Active Deals Right Now</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offers.map((offer) => (
              <div key={offer._id} className="bg-white rounded-3xl p-8 border border-gold/30 shadow-glass relative overflow-hidden flex flex-col justify-between space-y-6">
                <div className="absolute top-0 right-0 gold-gradient-bg text-white font-serif font-bold text-sm px-6 py-2 rounded-bl-2xl">
                  {offer.discountPercent}% OFF
                </div>

                <div className="space-y-3 max-w-md">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gold bg-blush px-3 py-1 rounded-full border border-gold/20 inline-block">
                    Active Voucher
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-bronze">{offer.title}</h3>
                  <p className="text-xs text-bronze/70 leading-relaxed">{offer.description}</p>
                </div>

                <div className="pt-4 border-t border-gold/15 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-warm-gray block">Promo Code</span>
                    <span className="font-mono text-xl font-extrabold text-bronze tracking-widest">{offer.promoCode}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => copyCode(offer.promoCode)}
                      className="flex items-center gap-1.5 text-xs font-bold border border-gold/40 text-gold-dark hover:bg-gold hover:text-white px-4 py-2.5 rounded-xl transition"
                    >
                      {copiedCode === offer.promoCode ? <><Check className="w-4 h-4 text-emerald-600" /> Copied</> : <><Copy className="w-4 h-4" /> Copy Code</>}
                    </button>

                    <Link href={`/book?promoCode=${offer.promoCode}`} className="gold-gradient-bg text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-sm">
                      Use & Book
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
