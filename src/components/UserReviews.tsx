'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { FiStar, FiEye, FiUser } from 'react-icons/fi';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Review {
  id: string;
  network_slug: string;
  network_name: string;
  user_name: string;
  overall_rating: number;
  ease_of_use: number;
  payment_speed: number;
  support_quality: number;
  review_text: string;
  screenshot_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface UserReviewsProps {
  networkSlug: string;
  networkName: string;
}

export default function UserReviews({ networkSlug, networkName }: UserReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('network_slug', networkSlug)
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching reviews:', error);
          setError('Failed to load reviews');
        } else {
          setReviews(data || []);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [networkSlug]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e6c77c]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gradient-to-br from-[#e6c77c] to-[#bfa14a] rounded-full flex items-center justify-center mx-auto mb-4">
          <FiUser className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
        <p className="text-gray-600">Be the first to review {networkName}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
          {/* Review Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#e6c77c] to-[#bfa14a] rounded-full flex items-center justify-center">
                <FiUser className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{review.user_name}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-[#bfa14a]">{review.overall_rating}</span>
              <FiStar className="w-5 h-5 text-[#e6c77c]" />
            </div>
          </div>

          {/* Review Text */}
          <div className="mb-4">
            <p className="text-gray-700 leading-relaxed">{review.review_text}</p>
          </div>

          {/* Rating Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ease of Use</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-[#bfa14a]">{review.ease_of_use}</span>
                <FiStar className="w-4 h-4 text-[#e6c77c]" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Payment Speed</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-[#bfa14a]">{review.payment_speed}</span>
                <FiStar className="w-4 h-4 text-[#e6c77c]" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Support Quality</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-[#bfa14a]">{review.support_quality}</span>
                <FiStar className="w-4 h-4 text-[#e6c77c]" />
              </div>
            </div>
          </div>

          {/* Screenshot */}
          {review.screenshot_url && (
            <div className="mt-4">
              <a
                href={review.screenshot_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#bfa14a] hover:text-[#e6c77c] transition-colors"
              >
                <FiEye className="w-4 h-4" />
                <span className="text-sm font-medium">View Screenshot</span>
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 