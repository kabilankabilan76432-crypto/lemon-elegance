'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles } from 'lucide-react';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (adminOnly && user.role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [user, loading, adminOnly, router]);

  if (loading || !user || (adminOnly && user.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full gold-gradient-bg flex items-center justify-center text-white animate-spin mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="font-serif text-bronze text-lg">Loading Lemon Elegance...</p>
        </div>
      </div>
    );
  }

  return children;
}
