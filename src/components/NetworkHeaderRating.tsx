"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface NetworkHeaderRatingProps {
  networkSlug: string;
  compact?: boolean;
}

interface Review {
  id: string;
  overall_rating: number;
  offers_rating: number;
  payout_rating: number;
  tracking_rating: number;
  support_rating: number;
}

export default function NetworkHeaderRating({ networkSlug, compact = false }: NetworkHeaderRatingProps) {
  const supabase = createClientComponentClient();
  const [rating, setRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [offersAvg, setOffersAvg] = useState(0);
  const [payoutAvg, setPayoutAvg] = useState(0);
  const [trackingAvg, setTrackingAvg] = useState(0);
  const [supportAvg, setSupportAvg] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRating() {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('overall_rating, offers_rating, payout_rating, tracking_rating, support_rating')
          .eq('network_slug', networkSlug)
          .eq('status', 'approved');

        if (data && data.length > 0) {
          const totalRating = data.reduce((sum, review) => sum + (review.overall_rating || 0), 0);
          const totalOffers = data.reduce((sum, review) => sum + (review.offers_rating || 0), 0);
          const totalPayout = data.reduce((sum, review) => sum + (review.payout_rating || 0), 0);
          const totalTracking = data.reduce((sum, review) => sum + (review.tracking_rating || 0), 0);
          const totalSupport = data.reduce((sum, review) => sum + (review.support_rating || 0), 0);
          
          const averageRating = totalRating / data.length;
          const averageOffers = totalOffers / data.length;
          const averagePayout = totalPayout / data.length;
          const averageTracking = totalTracking / data.length;
          const averageSupport = totalSupport / data.length;
          
          setRating(+(averageRating).toFixed(1));
          setOffersAvg(+(averageOffers).toFixed(1));
          setPayoutAvg(+(averagePayout).toFixed(1));
          setTrackingAvg(+(averageTracking).toFixed(1));
          setSupportAvg(+(averageSupport).toFixed(1));
          setReviewCount(data.length);
        }
      } catch (error) {
        console.error('Error fetching rating:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRating();
  }, [networkSlug, supabase]);

  if (loading) {
    if (compact) {
      return <span className="text-white text-xs">...</span>;
    }
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1 mb-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className="w-5 h-5 text-gray-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
            </svg>
          ))}
          <span className="ml-2 text-gray-400">Loading...</span>
        </div>
              <div className="flex gap-1">
        <div className="bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] border border-[#bfa14a] rounded px-2 py-1 text-center min-w-[45px]">
          <div className="text-xs text-white mb-0.5 font-medium">OFFERS</div>
          <div className="text-xs font-semibold text-white">-</div>
        </div>
        <div className="bg-gradient-to-r from-[#bfa14a] to-[#e6c77c] border border-[#bfa14a] rounded px-2 py-1 text-center min-w-[45px]">
          <div className="text-xs text-white mb-0.5 font-medium">PAYOUT</div>
          <div className="text-xs font-semibold text-white">-</div>
        </div>
        <div className="bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] border border-[#bfa14a] rounded px-2 py-1 text-center min-w-[45px]">
          <div className="text-xs text-white mb-0.5 font-medium">TRACKING</div>
          <div className="text-xs font-semibold text-white">-</div>
        </div>
        <div className="bg-gradient-to-r from-[#bfa14a] to-[#e6c77c] border border-[#bfa14a] rounded px-2 py-1 text-center min-w-[45px]">
          <div className="text-xs text-white mb-0.5 font-medium">SUPPORT</div>
          <div className="text-xs font-semibold text-white">-</div>
        </div>
      </div>
      </div>
    );
  }

  if (compact) {
    return (
      <span className="text-white text-xs font-medium">
        {rating > 0 ? `${rating}★` : 'N/A'}
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1 mb-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
          </svg>
        ))}
        <span className="ml-2 text-gray-600">
          {rating > 0 ? `${rating} (${reviewCount} reviews)` : 'No reviews yet'}
        </span>
      </div>
      <div className="flex gap-1">
        <div className="bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] border border-[#bfa14a] rounded px-2 py-1 text-center min-w-[45px]">
          <div className="text-xs text-white mb-0.5 font-medium">OFFERS</div>
          <div className="text-xs font-semibold text-white">
            {offersAvg > 0 ? offersAvg : '-'}
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#bfa14a] to-[#e6c77c] border border-[#bfa14a] rounded px-2 py-1 text-center min-w-[45px]">
          <div className="text-xs text-white mb-0.5 font-medium">PAYOUT</div>
          <div className="text-xs font-semibold text-white">
            {payoutAvg > 0 ? payoutAvg : '-'}
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] border border-[#bfa14a] rounded px-2 py-1 text-center min-w-[45px]">
          <div className="text-xs text-white mb-0.5 font-medium">TRACKING</div>
          <div className="text-xs font-semibold text-white">
            {trackingAvg > 0 ? trackingAvg : '-'}
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#bfa14a] to-[#e6c77c] border border-[#bfa14a] rounded px-2 py-1 text-center min-w-[45px]">
          <div className="text-xs text-white mb-0.5 font-medium">SUPPORT</div>
          <div className="text-xs font-semibold text-white">
            {supportAvg > 0 ? supportAvg : '-'}
          </div>
        </div>
      </div>
    </div>
  );
} 