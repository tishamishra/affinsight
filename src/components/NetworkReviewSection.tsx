"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ReviewButton from "./ReviewButton";

interface NetworkReviewSectionProps {
  networkName: string;
  networkSlug: string;
}

interface Review {
  id: string;
  overall_rating: number;
  offers_rating: number;
  payout_rating: number;
  tracking_rating: number;
  support_rating: number;
  review_text: string;
  created_at: string;
  user_name: string;
}

export default function NetworkReviewSection({ networkName, networkSlug }: NetworkReviewSectionProps) {
  const supabase = createClientComponentClient();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('network_slug', networkSlug)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching reviews:', error);
          return;
        }

        if (data && data.length > 0) {
          setReviews(data);
          const avg = data.reduce((sum, review) => sum + review.overall_rating, 0) / data.length;
          setAverageRating(+(avg).toFixed(1));
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [networkSlug, supabase]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-[#e6c77c] p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-[#e6c77c] p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            User Reviews
          </h2>
          <p className="text-gray-600">
            {reviews.length} review{reviews.length !== 1 ? 's' : ''} • Average: {averageRating}★
          </p>
        </div>
        <ReviewButton networkName={networkName} networkSlug={networkName.toLowerCase().replace(/\s+/g, '-')} />
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.slice(0, 3).map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#bfa14a] to-[#e6c77c] rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {review.user_name?.charAt(0) || 'U'}
                  </div>
                  <span className="font-medium text-gray-900">{review.user_name || 'Anonymous'}</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < review.overall_rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4">{review.review_text}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{new Date(review.created_at).toLocaleDateString()}</span>
                <div className="flex items-center gap-4">
                  <span>Offers: {review.offers_rating}★</span>
                  <span>Payout: {review.payout_rating}★</span>
                  <span>Tracking: {review.tracking_rating}★</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-[#e6c77c] to-[#bfa14a] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
          <p className="text-gray-600 mb-4">Be the first to review this network!</p>
          <ReviewButton networkName={networkName} networkSlug={networkName.toLowerCase().replace(/\s+/g, '-')} />
        </div>
      )}
    </div>
  );
} 