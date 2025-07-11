"use client";

import { useState, useEffect } from "react";
import { FiStar, FiExternalLink, FiMessageCircle, FiTrendingUp, FiUsers, FiAward, FiZap } from "react-icons/fi";
import { getNetworkByName, getNetworkSlug } from "@/lib/networks-loader";
import { getOffersByNetwork } from "@/lib/offers-loader";
import ReviewModal from "@/components/ReviewModal";
import UserReviews from "@/components/UserReviews";

interface NetworkDetailPageProps {
  params: { slug: string };
}

interface Review {
  id: string;
  overall_rating: number;
  offers_rating: number;
  payout_rating: number;
  tracking_rating: number;
  support_rating: number;
  review_text: string;
  screenshot_url?: string;
  name: string;
  created_at: string;
}

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const handleError = (error: ErrorEvent) => {
    console.error('Network detail page error:', error);
  };

  useEffect(() => {
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return <>{children}</>;
};

export default function NetworkDetailPage({ params }: NetworkDetailPageProps) {
  const [network, setNetwork] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [networkOffers, setNetworkOffers] = useState<any[]>([]);
  const [selectedVertical, setSelectedVertical] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const itemsPerPage = 9;
  const truncatedDescription = network?.description?.length > 200 
    ? network.description.substring(0, 200) + '...' 
    : network.description;

  useEffect(() => {
    function loadNetwork() {
      try {
        setLoading(true);
        const slug = params?.slug as string;
        if (!slug) {
          setError('Network slug is required');
          return;
        }
        
        const data = getNetworkByName(slug);
        if (data) {
          setNetwork(data);
        } else {
          setError('Network not found');
        }
      } catch (err) {
        setError('Failed to load network details');
        console.error('Error loading network:', err);
      } finally {
        setLoading(false);
      }
    }

    if (params?.slug) {
      loadNetwork();
    }
  }, [params?.slug]);

  // Load offers for this network
  useEffect(() => {
    if (network) {
      const offers = getOffersByNetwork(network.name);
      setNetworkOffers(offers);
    }
  }, [network]);

  const avg = (field: keyof Review) => {
    if (!reviews || reviews.length === 0) return "-";
    const sum = reviews.reduce((acc, r) => acc + (Number(r[field]) || 0), 0);
    return (sum / reviews.length).toFixed(1);
  };
  
  const reviewCount = reviews.length;

  const StarRating = ({ rating }: { rating: number }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <FiStar className="w-5 h-5 text-gray-300" />
            <FiStar className="w-5 h-5 text-yellow-400 fill-current absolute inset-0" style={{ clipPath: 'inset(0 50% 0 0)' }} />
          </div>
        );
      } else {
        stars.push(
          <FiStar key={i} className="w-5 h-5 text-gray-300" />
        );
      }
    }

    return <div className="flex items-center space-x-1">{stars}</div>;
  };

  // Filter offers by selected vertical
  const filteredOffers = selectedVertical === 'All' 
    ? networkOffers 
    : networkOffers.filter(offer => offer.vertical === selectedVertical);

  // Get unique verticals for filter
  const offerVerticals = [...new Set(networkOffers.map(offer => offer.vertical))];

  // Pagination
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOffers = filteredOffers.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading network details...</p>
        </div>
      </div>
    );
  }

  if (error || !network) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Network Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested network could not be found.'}</p>
          <a
            href="/networks"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse All Networks
          </a>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-amber-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Left Column - Network Info */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-4 mb-6">
                  {network.logo && (
                    <img
                      src={network.logo}
                      alt={`${network.name} logo`}
                      className="w-16 h-16 rounded-lg shadow-sm"
                    />
                  )}
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{network.name}</h1>
                    <div className="flex items-center gap-4">
                      <StarRating rating={network.rating || 0} />
                      <span className="text-gray-600">({network.rating || 0}/5)</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-600">{network.offers_count?.toLocaleString() || 'N/A'} offers</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  {network.description || 'No description available.'}
                </p>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiTrendingUp className="text-green-500" />
                    <span>Commission: {network.commission_rate || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiZap className="text-blue-500" />
                    <span>Min Payout: {network.minimum_payout || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiUsers className="text-purple-500" />
                    <span>{reviewCount} reviews</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Quick Stats */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiAward className="text-amber-500" />
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <span className="text-gray-700 font-medium">Average Rating</span>
                    <span className="font-bold text-blue-600 text-lg">
                      {Number(avg("overall_rating")) || network.rating}/5
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                    <span className="text-gray-700 font-medium">Total Reviews</span>
                    <span className="font-bold text-green-600 text-lg">{reviewCount}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                    <span className="text-gray-700 font-medium">Offers Available</span>
                    <span className="font-bold text-purple-600 text-lg">{network.offers_count?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg">
                    <span className="text-gray-700 font-medium">Commission Rate</span>
                    <span className="font-bold text-amber-600 text-lg">{network.commission_rate || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Primary CTAs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                onClick={() => setShowReviewModal(true)}
              >
                <FiMessageCircle className="w-5 h-5" />
                Write a Review
              </button>
              <a
                href={network.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FiExternalLink className="w-5 h-5" />
                Join Now
              </a>
            </div>
          </div>
        </div>

        {/* Truncated Overview */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed">
                {showFullDescription ? network.description : truncatedDescription}
              </p>
              {network.description && network.description.length > 200 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-amber-600 hover:text-amber-700 font-medium mt-2"
                >
                  {showFullDescription ? "[Show Less]" : "[More]"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Network Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FiTrendingUp className="text-blue-500" />
                  Network Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <span className="text-gray-700 font-medium">Number of Offers</span>
                    <span className="text-gray-900 font-bold">{network.offers_count?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                    <span className="text-gray-700 font-medium">Commission Type</span>
                    <span className="text-gray-900 font-bold">{network.commission_rate || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                    <span className="text-gray-700 font-medium">Minimum Payment</span>
                    <span className="text-gray-900 font-bold">{network.minimum_payout || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg">
                    <span className="text-gray-700 font-medium">Payment Frequency</span>
                    <span className="text-gray-900 font-bold">{network.payment_frequency || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg">
                    <span className="text-gray-700 font-medium">Tracking Software</span>
                    <span className="text-gray-900 font-bold">{network.tracking_software || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg">
                    <span className="text-gray-700 font-medium">Payment Methods</span>
                    <span className="text-gray-900 font-bold">
                      {network.payment_methods ? network.payment_methods.join(', ') : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Offers Section */}
              {networkOffers.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FiZap className="text-green-500" />
                    Available Offers
                  </h2>
                  
                  {/* Category Filter */}
                  {offerVerticals.length > 1 && (
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setSelectedVertical('All')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            selectedVertical === 'All'
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          All ({networkOffers.length})
                        </button>
                        {offerVerticals.map(vertical => (
                          <button
                            key={vertical}
                            onClick={() => setSelectedVertical(vertical)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              selectedVertical === vertical
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {vertical} ({networkOffers.filter(o => o.vertical === vertical).length})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Offers Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {paginatedOffers.map((offer, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm">{offer.offerName}</h3>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {offer.vertical}
                          </span>
                        </div>
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex justify-between">
                            <span>Payout:</span>
                            <span className="font-medium text-green-600">{offer.payout}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Country:</span>
                            <span>{offer.country}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-2 text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Reviews Section */}
              <UserReviews networkSlug={params.slug} />
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Additional Stats */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiUsers className="text-purple-500" />
                  Network Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <span className="text-gray-700">Available Countries</span>
                    <span className="font-bold text-blue-600">
                      {network.countries ? network.countries.length : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                    <span className="text-gray-700">Payment Methods</span>
                    <span className="font-bold text-green-600">
                      {network.payment_methods ? network.payment_methods.length : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                    <span className="text-gray-700">Tracking Software</span>
                    <span className="font-bold text-purple-600">
                      {network.tracking_software ? 'Yes' : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <FiMessageCircle className="w-4 h-4" />
                    Write Review
                  </button>
                  <a
                    href={network.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 font-medium"
                  >
                    <FiExternalLink className="w-4 h-4" />
                    Visit Website
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        open={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        networkName={network.name}
        networkSlug={params.slug}
        onSubmitted={() => {
          setShowReviewModal(false);
          // Refresh reviews after submission
          window.location.reload();
        }}
      />
    </ErrorBoundary>
  );
} 