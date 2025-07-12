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
            console.log('Reviews found for network:', networkSlug, 'Count:', data.length);
            console.log('Sample review data:', data[0]);
            
            // Filter out reviews with null/undefined ratings
            const validReviews = data.filter(review => 
              review.overall_rating != null && 
              review.overall_rating > 0
            );
            
            console.log('Valid reviews with ratings:', validReviews.length);
            
            if (validReviews.length > 0) {
              const totalOverall = validReviews.reduce((sum, review) => sum + (review.overall_rating || 0), 0);
              const totalOffers = validReviews.reduce((sum, review) => sum + (review.offers_rating || 0), 0);
              const totalPayout = validReviews.reduce((sum, review) => sum + (review.payout_rating || 0), 0);
              const totalTracking = validReviews.reduce((sum, review) => sum + (review.tracking_rating || 0), 0);
              const totalSupport = validReviews.reduce((sum, review) => sum + (review.support_rating || 0), 0);
              
              const averageOverall = totalOverall / validReviews.length;
              const averageOffers = totalOffers / validReviews.length;
              const averagePayout = totalPayout / validReviews.length;
              const averageTracking = totalTracking / validReviews.length;
              const averageSupport = totalSupport / validReviews.length;
              
              console.log('Calculated averages:', {
                overall: averageOverall,
                offers: averageOffers,
                payout: averagePayout,
                tracking: averageTracking,
                support: averageSupport
              });
              
              setRatings({
                overallAvg: +(averageOverall).toFixed(1),
                offersAvg: +(averageOffers).toFixed(1),
                payoutAvg: +(averagePayout).toFixed(1),
                trackingAvg: +(averageTracking).toFixed(1),
                supportAvg: +(averageSupport).toFixed(1)
              });
            } else {
              console.log('No valid reviews with ratings found');
              setRatings({
                overallAvg: 0,
                offersAvg: 0,
                payoutAvg: 0,
                trackingAvg: 0,
                supportAvg: 0
              });
            }
          } else {
            console.log('No reviews found or error:', error);
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
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] text-white text-base font-bold shadow-md border-2 border-white">
        {ratings.overallAvg > 0 ? ratings.overallAvg : (loading ? '-' : '0')}
      </span>
    );
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