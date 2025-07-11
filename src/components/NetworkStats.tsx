"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import offers from '@/data/offers.json';

interface NetworkStatsProps {
  networkSlug: string;
}

interface Review {
  id: string;
  overall_rating: number;
  offers_rating: number;
  payout_rating: number;
  tracking_rating: number;
  support_rating: number;
}

export default function NetworkStats({ networkSlug }: NetworkStatsProps) {
  const supabase = createClientComponentClient();
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
        const { data, error } = await supabase
          .from('reviews')
          .select('overall_rating, offers_rating, payout_rating, tracking_rating, support_rating')
          .eq('network_slug', networkSlug)
          .eq('status', 'approved');

        if (data && data.length > 0) {
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
            offersCount: 0, // Will be calculated below
            offersAvg: +(averageOffers).toFixed(1),
            payoutAvg: +(averagePayout).toFixed(1),
            trackingAvg: +(averageTracking).toFixed(1),
            supportAvg: +(averageSupport).toFixed(1)
          });
        }
        
        // Calculate offers count for this network
        const networkOffers = offers.filter(offer => 
          offer.network.toLowerCase().includes(networkSlug.replace(/-/g, ' ').toLowerCase()) ||
          networkSlug.replace(/-/g, ' ').toLowerCase().includes(offer.network.toLowerCase())
        );
        
        setStats(prev => ({
          ...prev,
          offersCount: networkOffers.length
        }));
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [networkSlug, supabase]);

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#bfa14a]">...</div>
          <div className="text-xs text-gray-500 font-medium">Reviews</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[#bfa14a]">...</div>
          <div className="text-xs text-gray-500 font-medium">Offers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[#bfa14a]">...</div>
          <div className="text-xs text-gray-500 font-medium">Payout</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[#bfa14a]">...</div>
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