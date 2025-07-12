'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { FiStar, FiEye, FiUser, FiFilter, FiChevronDown, FiImage } from 'react-icons/fi';

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

type FilterType = 'all' | 'payment-proofs';
type SortType = 'recent' | 'oldest' | 'popular';

export default function UserReviews({ networkSlug, networkName }: UserReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('recent');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

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

  // Filter reviews based on selected filter
  const filteredReviews = reviews.filter(review => {
    if (filter === 'payment-proofs') {
      return review.screenshot_url && review.screenshot_url.trim() !== '';
    }
    return true;
  });

  // Sort reviews based on selected sort option
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'popular':
        return b.overall_rating - a.overall_rating;
      default:
        return 0;
    }
  });

  const reviewsWithProofs = reviews.filter(review => review.screenshot_url && review.screenshot_url.trim() !== '').length;

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
      {/* Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-gradient-to-r from-[#fef7e6] to-[#fdf4d9] rounded-xl p-4 border border-[#e6c77c]">
        {/* Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === 'all'
                ? 'bg-[#e6c77c] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-[#fef7e6] border border-[#e6c77c]'
            }`}
          >
            All Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setFilter('payment-proofs')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === 'payment-proofs'
                ? 'bg-[#e6c77c] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-[#fef7e6] border border-[#e6c77c]'
            }`}
          >
            Payment Proofs ({reviewsWithProofs})
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-[#e6c77c] hover:bg-[#fef7e6] transition-all duration-200"
          >
            <FiFilter className="w-4 h-4" />
            <span>
              {sortBy === 'recent' && 'Most Recent'}
              {sortBy === 'oldest' && 'Oldest First'}
              {sortBy === 'popular' && 'Most Popular'}
            </span>
            <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${showSortDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showSortDropdown && (
            <div className="absolute right-0 top-full mt-2 bg-white border border-[#e6c77c] rounded-lg shadow-lg z-10 min-w-[160px]">
              <button
                onClick={() => { setSortBy('recent'); setShowSortDropdown(false); }}
                className={`w-full text-left px-4 py-2 hover:bg-[#fef7e6] transition-colors ${
                  sortBy === 'recent' ? 'bg-[#fef7e6] text-[#bfa14a]' : 'text-gray-700'
                }`}
              >
                Most Recent
              </button>
              <button
                onClick={() => { setSortBy('oldest'); setShowSortDropdown(false); }}
                className={`w-full text-left px-4 py-2 hover:bg-[#fef7e6] transition-colors ${
                  sortBy === 'oldest' ? 'bg-[#fef7e6] text-[#bfa14a]' : 'text-gray-700'
                }`}
              >
                Oldest First
              </button>
              <button
                onClick={() => { setSortBy('popular'); setShowSortDropdown(false); }}
                className={`w-full text-left px-4 py-2 hover:bg-[#fef7e6] transition-colors ${
                  sortBy === 'popular' ? 'bg-[#fef7e6] text-[#bfa14a]' : 'text-gray-700'
                }`}
              >
                Most Popular
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {sortedReviews.map((review) => (
          <div key={review.id} className="bg-gradient-to-br from-white to-[#fef7e6] rounded-xl p-6 border border-[#e6c77c] shadow-sm hover:shadow-md transition-all duration-300">
            {/* Review Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#e6c77c] to-[#bfa14a] rounded-full flex items-center justify-center shadow-sm">
                  <FiUser className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">{review.user_name}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] text-white px-3 py-1 rounded-full">
                <span className="text-lg font-bold">{review.overall_rating}</span>
                <FiStar className="w-5 h-5" />
              </div>
            </div>

            {/* Review Text */}
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed text-base">{review.review_text}</p>
            </div>

            {/* Rating Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-white rounded-lg border border-[#e6c77c]/30">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Ease of Use</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-[#bfa14a]">{review.ease_of_use}</span>
                  <FiStar className="w-4 h-4 text-[#e6c77c]" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Payment Speed</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-[#bfa14a]">{review.payment_speed}</span>
                  <FiStar className="w-4 h-4 text-[#e6c77c]" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Support Quality</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-[#bfa14a]">{review.support_quality}</span>
                  <FiStar className="w-4 h-4 text-[#e6c77c]" />
                </div>
              </div>
            </div>

            {/* Screenshot Preview */}
            {review.screenshot_url && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <FiImage className="w-5 h-5 text-[#bfa14a]" />
                  <span className="text-sm font-medium text-gray-700">Payment Proof</span>
                </div>
                <div className="relative group">
                  <img
                    src={review.screenshot_url}
                    alt="Payment proof"
                    className="w-full max-w-md h-auto rounded-lg border-2 border-[#e6c77c] shadow-sm cursor-pointer transition-transform duration-200 hover:scale-105"
                    onClick={() => window.open(review.screenshot_url, '_blank')}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <FiEye className="w-8 h-8 text-white drop-shadow-lg" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {sortedReviews.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-[#e6c77c] to-[#bfa14a] rounded-full flex items-center justify-center mx-auto mb-4">
            <FiFilter className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {filter === 'payment-proofs' ? 'No Payment Proofs Found' : 'No Reviews Found'}
          </h3>
          <p className="text-gray-600">
            {filter === 'payment-proofs' 
              ? 'No reviews with payment proofs found for this filter.'
              : 'No reviews match the current filter.'
            }
          </p>
        </div>
      )}
    </div>
  );
} 