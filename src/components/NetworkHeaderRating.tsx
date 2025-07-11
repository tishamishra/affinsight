"use client";

import { useState, useEffect } from "react";

interface NetworkHeaderRatingProps {
  networkSlug: string;
  compact?: boolean;
}

export default function NetworkHeaderRating({ networkSlug, compact = false }: NetworkHeaderRatingProps) {
  const [ratings, setRatings] = useState({
    overallAvg: 0,
    offersAvg: 0,
    payoutAvg: 0,
    trackingAvg: 0,
    supportAvg: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRatings() {
      try {
        // Check if Supabase is available
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey) {
          // Try to fetch from Supabase
          const { createClientComponentClient } = await import("@supabase/auth-helpers-nextjs");
          const supabase = createClientComponentClient();
          
          const { data, error } = await supabase
            .from('reviews')
            .select('overall_rating, offers_rating, payout_rating, tracking_rating, support_rating')
            .eq('network_slug', networkSlug);

          if (!error && data && data.length > 0) {
            const totalOverall = data.reduce((sum, review) => sum + (review.overall_rating || 0), 0);
            const totalOffers = data.reduce((sum, review) => sum + (review.offers_rating || 0), 0);
            const totalPayout = data.reduce((sum, review) => sum + (review.payout_rating || 0), 0);
            const totalTracking = data.reduce((sum, review) => sum + (review.tracking_rating || 0), 0);
            const totalSupport = data.reduce((sum, review) => sum + (review.support_rating || 0), 0);
            
            const averageOverall = totalOverall / data.length;
            const averageOffers = totalOffers / data.length;
            const averagePayout = totalPayout / data.length;
            const averageTracking = totalTracking / data.length;
            const averageSupport = totalSupport / data.length;
            
            setRatings({
              overallAvg: +(averageOverall).toFixed(1),
              offersAvg: +(averageOffers).toFixed(1),
              payoutAvg: +(averagePayout).toFixed(1),
              trackingAvg: +(averageTracking).toFixed(1),
              supportAvg: +(averageSupport).toFixed(1)
            });
          } else {
            // Fallback to default ratings
            setRatings({
              overallAvg: 0,
              offersAvg: 0,
              payoutAvg: 0,
              trackingAvg: 0,
              supportAvg: 0
            });
          }
        } else {
          // No Supabase available, use fallback
          setRatings({
            overallAvg: 0,
            offersAvg: 0,
            payoutAvg: 0,
            trackingAvg: 0,
            supportAvg: 0
          });
        }
      } catch (error) {
        console.error('Error fetching ratings:', error);
        // Fallback to default ratings
        setRatings({
          overallAvg: 0,
          offersAvg: 0,
          payoutAvg: 0,
          trackingAvg: 0,
          supportAvg: 0
        });
      } finally {
        setLoading(false);
      }
    }

    fetchRatings();
  }, [networkSlug]);

  if (loading) {
    if (compact) {
      return <span className="text-xs">-</span>;
    }
    return (
      <div className="flex gap-1">
        <div className="bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] rounded px-2 py-1 text-center min-w-[45px]">
          <div className="text-xs text-white mb-0.5">OFFERS</div>
          <div className="text-xs font-semibold text-white">-</div>
        </div>
        <div className="bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] rounded px-2 py-1 text-center min-w-[45px]">
          <div className="text-xs text-white mb-0.5">PAYOUT</div>
          <div className="text-xs font-semibold text-white">-</div>
        </div>
        <div className="bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] rounded px-2 py-1 text-center min-w-[45px]">
          <div className="text-xs text-white mb-0.5">TRACKING</div>
          <div className="text-xs font-semibold text-white">-</div>
        </div>
        <div className="bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] rounded px-2 py-1 text-center min-w-[45px]">
          <div className="text-xs text-white mb-0.5">SUPPORT</div>
          <div className="text-xs font-semibold text-white">-</div>
        </div>
      </div>
    );
  }

  if (compact) {
    return <span className="text-xs">{ratings.overallAvg > 0 ? ratings.overallAvg : '-'}</span>;
  }

  return (
    <div className="flex gap-1">
      <div className="bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] rounded px-2 py-1 text-center min-w-[45px]">
        <div className="text-xs text-white mb-0.5">OFFERS</div>
        <div className="text-xs font-semibold text-white">
          {ratings.offersAvg > 0 ? ratings.offersAvg : '-'}
        </div>
      </div>
      <div className="bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] rounded px-2 py-1 text-center min-w-[45px]">
        <div className="text-xs text-white mb-0.5">PAYOUT</div>
        <div className="text-xs font-semibold text-white">
          {ratings.payoutAvg > 0 ? ratings.payoutAvg : '-'}
        </div>
      </div>
      <div className="bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] rounded px-2 py-1 text-center min-w-[45px]">
        <div className="text-xs text-white mb-0.5">TRACKING</div>
        <div className="text-xs font-semibold text-white">
          {ratings.trackingAvg > 0 ? ratings.trackingAvg : '-'}
        </div>
      </div>
      <div className="bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] rounded px-2 py-1 text-center min-w-[45px]">
        <div className="text-xs text-white mb-0.5">SUPPORT</div>
        <div className="text-xs font-semibold text-white">
          {ratings.supportAvg > 0 ? ratings.supportAvg : '-'}
        </div>
      </div>
    </div>
  );
} 