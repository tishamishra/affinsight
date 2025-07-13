"use client";

import { useEffect, useState } from "react";
import offers from '@/data/offers.json';

interface NetworkStatsProps {
  networkSlug: string;
}

export default function NetworkStats({ networkSlug }: NetworkStatsProps) {
  const [stats, setStats] = useState({
    reviewCount: 0,
    offersCount: 0,
    paymentSpeed: 0,
    supportQuality: 0,
    overallRating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Count offers for this network
        const networkOffers = offers.filter(offer => 
          offer.network.toLowerCase().includes(networkSlug.toLowerCase()) ||
          networkSlug.toLowerCase().includes(offer.network.toLowerCase())
        );

        // Check if Supabase is available
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey) {
          // Try to fetch from Supabase
          const { createClientComponentClient } = await import("@supabase/auth-helpers-nextjs");
          const supabase = createClientComponentClient();
          
          const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('network_slug', networkSlug);

          if (!error && data && data.length > 0) {
            const totalPaymentSpeed = data.reduce((sum, review) => sum + (review.payment_speed || 0), 0);
            const totalSupportQuality = data.reduce((sum, review) => sum + (review.support_quality || 0), 0);
            const totalOverallRating = data.reduce((sum, review) => sum + (review.overall_rating || 0), 0);
            
            const averagePaymentSpeed = totalPaymentSpeed / data.length;
            const averageSupportQuality = totalSupportQuality / data.length;
            const averageOverallRating = totalOverallRating / data.length;
            
            setStats({
              reviewCount: data.length,
              offersCount: networkOffers.length,
              paymentSpeed: +(averagePaymentSpeed).toFixed(1),
              supportQuality: +(averageSupportQuality).toFixed(1),
              overallRating: +(averageOverallRating).toFixed(1)
            });
          } else {
            // Fallback to default stats
            setStats({
              reviewCount: 0,
              offersCount: networkOffers.length,
              paymentSpeed: 0,
              supportQuality: 0,
              overallRating: 0
            });
          }
        } else {
          // No Supabase available, use fallback
          setStats({
            reviewCount: 0,
            offersCount: networkOffers.length,
            paymentSpeed: 0,
            supportQuality: 0,
            overallRating: 0
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Fallback to default stats
        const networkOffers = offers.filter(offer => 
          offer.network.toLowerCase().includes(networkSlug.toLowerCase()) ||
          networkSlug.toLowerCase().includes(offer.network.toLowerCase())
        );
        setStats({
          reviewCount: 0,
          offersCount: networkOffers.length,
          paymentSpeed: 0,
          supportQuality: 0,
          overallRating: 0
        });
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [networkSlug]);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
          <div className="text-center">
            <div className="text-sm font-bold">-</div>
            <div className="text-xs opacity-90">Reviews</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
          <div className="text-center">
            <div className="text-sm font-bold">-</div>
            <div className="text-xs opacity-90">Offers</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
          <div className="text-center">
            <div className="text-sm font-bold">-</div>
            <div className="text-xs opacity-90">Payment</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
          <div className="text-center">
            <div className="text-sm font-bold">-</div>
            <div className="text-xs opacity-90">Support</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-1 overflow-x-auto w-full pb-1">
      {/* Reviews */}
      <div className="flex items-center gap-1 border-l-4 border-[#bfa14a] bg-[#fff9ec] text-[#bfa14a] rounded-full text-[11px] px-2 py-0.5 shadow-sm min-w-[54px] sm:text-xs sm:px-3 sm:py-1">
        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="#bfa14a" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 17.75l-6.172 3.245 1.179-6.873L2 9.755l6.908-1.004L12 2.5l3.092 6.251L22 9.755l-5.007 4.367 1.179 6.873z"/></svg>
        <span className="font-bold">{stats.reviewCount}</span>
        <span className="font-normal opacity-80 hidden sm:inline">Reviews</span>
      </div>
      {/* Offers */}
      <div className="flex items-center gap-1 border-l-4 border-blue-400 bg-blue-50 text-blue-500 rounded-full text-[11px] px-2 py-0.5 shadow-sm min-w-[54px] sm:text-xs sm:px-3 sm:py-1">
        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 17.75l-6.172 3.245 1.179-6.873L2 9.755l6.908-1.004L12 2.5l3.092 6.251L22 9.755l-5.007 4.367 1.179 6.873z"/></svg>
        <span className="font-bold">{stats.offersCount}</span>
        <span className="font-normal opacity-80 hidden sm:inline">Offers</span>
      </div>
      {/* Payment */}
      <div className="flex items-center gap-1 border-l-4 border-green-400 bg-green-50 text-green-600 rounded-full text-[11px] px-2 py-0.5 shadow-sm min-w-[54px] sm:text-xs sm:px-3 sm:py-1">
        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="#22c55e" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 17.75l-6.172 3.245 1.179-6.873L2 9.755l6.908-1.004L12 2.5l3.092 6.251L22 9.755l-5.007 4.367 1.179 6.873z"/></svg>
        <span className="font-bold">{stats.paymentSpeed > 0 ? stats.paymentSpeed : '-'}</span>
        <span className="font-normal opacity-80 hidden sm:inline">Payment</span>
      </div>
      {/* Support */}
      <div className="flex items-center gap-1 border-l-4 border-purple-400 bg-purple-50 text-purple-600 rounded-full text-[11px] px-2 py-0.5 shadow-sm min-w-[54px] sm:text-xs sm:px-3 sm:py-1">
        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="#a78bfa" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 17.75l-6.172 3.245 1.179-6.873L2 9.755l6.908-1.004L12 2.5l3.092 6.251L22 9.755l-5.007 4.367 1.179 6.873z"/></svg>
        <span className="font-bold">{stats.supportQuality > 0 ? stats.supportQuality : '-'}</span>
        <span className="font-normal opacity-80 hidden sm:inline">Support</span>
      </div>
    </div>
  );
} 