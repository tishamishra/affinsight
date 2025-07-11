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
    offersAvg: 0,
    payoutAvg: 0,
    trackingAvg: 0,
    supportAvg: 0
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
            const totalOffers = data.reduce((sum, review) => sum + (review.offers_rating || 0), 0);
            const totalPayout = data.reduce((sum, review) => sum + (review.payout_rating || 0), 0);
            const totalTracking = data.reduce((sum, review) => sum + (review.tracking_rating || 0), 0);
            const totalSupport = data.reduce((sum, review) => sum + (review.support_rating || 0), 0);
            
            const averageOffers = totalOffers / data.length;
            const averagePayout = totalPayout / data.length;
            const averageTracking = totalTracking / data.length;
            const averageSupport = totalSupport / data.length;
            
            setStats({
              reviewCount: data.length,
              offersCount: networkOffers.length,
              offersAvg: +(averageOffers).toFixed(1),
              payoutAvg: +(averagePayout).toFixed(1),
              trackingAvg: +(averageTracking).toFixed(1),
              supportAvg: +(averageSupport).toFixed(1)
            });
          } else {
            // Fallback to default stats
            setStats({
              reviewCount: 0,
              offersCount: networkOffers.length,
              offersAvg: 0,
              payoutAvg: 0,
              trackingAvg: 0,
              supportAvg: 0
            });
          }
        } else {
          // No Supabase available, use fallback
          setStats({
            reviewCount: 0,
            offersCount: networkOffers.length,
            offersAvg: 0,
            payoutAvg: 0,
            trackingAvg: 0,
            supportAvg: 0
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
          offersAvg: 0,
          payoutAvg: 0,
          trackingAvg: 0,
          supportAvg: 0
        });
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [networkSlug]);

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#bfa14a]">-</div>
          <div className="text-xs text-gray-500 font-medium">Reviews</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[#bfa14a]">-</div>
          <div className="text-xs text-gray-500 font-medium">Offers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[#bfa14a]">-</div>
          <div className="text-xs text-gray-500 font-medium">Payout</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[#bfa14a]">-</div>
          <div className="text-xs text-gray-500 font-medium">Tracking</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-[#bfa14a]">{stats.reviewCount}</div>
        <div className="text-xs text-gray-500 font-medium">Reviews</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-[#bfa14a]">{stats.offersCount}</div>
        <div className="text-xs text-gray-500 font-medium">Offers</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-[#bfa14a]">{stats.payoutAvg > 0 ? stats.payoutAvg : 'N/A'}</div>
        <div className="text-xs text-gray-500 font-medium">Payout</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-[#bfa14a]">{stats.trackingAvg > 0 ? stats.trackingAvg : 'N/A'}</div>
        <div className="text-xs text-gray-500 font-medium">Tracking</div>
      </div>
    </div>
  );
} 