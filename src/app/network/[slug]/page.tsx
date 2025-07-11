"use client";

import { useState, useEffect } from "react";
import { 
  FiStar, 
  FiUsers, 
  FiGlobe, 
  FiDollarSign, 
  FiCalendar, 
  FiExternalLink,
  FiMail,
  FiFacebook,
  FiLinkedin,
  FiMessageCircle,
  FiTrendingUp,
  FiShield,
  FiHeadphones,
  FiBarChart
} from "react-icons/fi";
import { getNetworkByName } from "@/lib/networks-loader";
import { Network } from "@/data/networks";
import { getAllOffers } from '@/lib/offers-loader';
import ReviewModal from "@/components/ReviewModal";
import UserReviews from "@/components/UserReviews";

interface NetworkDetailPageProps {
  params: Promise<{ slug: string }>;
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

// Simple error boundary component
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Network detail page error:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-8">Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default function NetworkDetailPage({ params }: NetworkDetailPageProps) {
  const [network, setNetwork] = useState<Network | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Offers filtering logic
  const allOffers = getAllOffers();
  const [selectedVertical, setSelectedVertical] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const offersPerPage = 6;

  // Filter offers by network name
  const networkOffers = network ? allOffers.filter(offer => 
    offer.network.toLowerCase() === network.name.toLowerCase()
  ) : [];

  // Get unique verticals for filter
  const offerVerticals = [...new Set(networkOffers.map(offer => offer.vertical))];

  // Filter offers by selected vertical
  const filteredOffers = selectedVertical === 'All' 
    ? networkOffers 
    : networkOffers.filter(offer => offer.vertical === selectedVertical);

  // Pagination
  const totalPages = Math.ceil(filteredOffers.length / offersPerPage);
  const paginatedOffers = filteredOffers.slice((currentPage - 1) * offersPerPage, currentPage * offersPerPage);

  // Resolve params Promise
  useEffect(() => {
    params.then((resolved) => {
      setResolvedParams(resolved);
    });
  }, [params]);

  useEffect(() => {
    function loadNetwork() {
      try {
        setLoading(true);
        const slug = resolvedParams?.slug;
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

    if (resolvedParams?.slug) {
      loadNetwork();
    }
  }, [resolvedParams?.slug]);

  // Simple reviews loading without Supabase for now
  useEffect(() => {
    setReviewsLoading(false);
    setReviews([]); // Empty for now, will be implemented later
  }, [resolvedParams?.slug]);

  const avg = (field: string) => {
    if (!reviews || reviews.length === 0) return "-";
    const sum = reviews.reduce((acc, r) => acc + (r[field] || 0), 0);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          {/* Hero Loading */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                <div className="space-y-3">
                  <div className="h-8 bg-gray-200 rounded w-64"></div>
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Metrics Loading */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-wrap gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-8 bg-gray-200 rounded-full w-24"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Loading */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
                <div className="h-32 bg-gray-200 rounded-lg"></div>
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-gray-200 rounded-lg"></div>
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !network) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Network Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The requested network could not be found.'}</p>
          <a
            href="/networks"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200"
          >
            Browse All Networks
          </a>
        </div>
      </div>
    );
  }

  const truncatedDescription = network.description && network.description.length > 200 
    ? network.description.substring(0, 200) + "..."
    : network.description;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-6">
                {/* Network Logo */}
                <div className="flex-shrink-0">
                  {network.logo_url ? (
                    <img
                      src={network.logo_url}
                      alt={`${network.name} logo`}
                      className="w-24 h-24 object-contain rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center border border-gray-200">
                      <span className="text-3xl font-bold text-amber-600">
                        {network.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Network Info */}
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{network.name}</h1>
                  <div className="flex items-center gap-4 mb-3">
                    <StarRating rating={Number(avg("overall_rating")) || network.rating} />
                    <span className="text-gray-600 font-medium">{reviewCount} reviews</span>
                  </div>
                  <p className="text-gray-600 text-lg">{network.category} Network</p>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-4">
                <a href={`mailto:contact@${network.name.toLowerCase().replace(/\s+/g, '')}.com`} className="p-2 text-gray-400 hover:text-amber-600 transition-colors">
                  <FiMail className="w-5 h-5" />
                </a>
                <a href={network.website} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-amber-600 transition-colors">
                  <FiExternalLink className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 text-gray-400 hover:text-amber-600 transition-colors">
                  <FiFacebook className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 text-gray-400 hover:text-amber-600 transition-colors">
                  <FiLinkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Badges Row */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full">
                <FiTrendingUp className="w-4 h-4" />
                <span className="font-medium">OFFERS</span>
                <span className="bg-red-200 px-2 py-1 rounded-full text-xs font-bold">
                  {networkOffers.length}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full">
                <FiDollarSign className="w-4 h-4" />
                <span className="font-medium">PAYOUT</span>
                <span className="bg-blue-200 px-2 py-1 rounded-full text-xs font-bold">
                  {avg("payout_rating")}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full">
                <FiShield className="w-4 h-4" />
                <span className="font-medium">TRACKING</span>
                <span className="bg-green-200 px-2 py-1 rounded-full text-xs font-bold">
                  {avg("tracking_rating")}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full">
                <FiHeadphones className="w-4 h-4" />
                <span className="font-medium">SUPPORT</span>
                <span className="bg-purple-200 px-2 py-1 rounded-full text-xs font-bold">
                  {avg("support_rating")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary CTAs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                onClick={() => setShowReviewModal(true)}
              >
                <FiMessageCircle className="w-5 h-5" />
                Write a Review
              </button>
              <a
                href={network.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 font-medium"
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
            <div className="bg-gray-50 rounded-lg p-6">
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Affiliate Network Details</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Number of Offers</span>
                    <span className="text-gray-900 font-semibold">{networkOffers.length}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Commission Type</span>
                    <span className="text-gray-900 font-semibold">{network.commission_rate || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Minimum Payment</span>
                    <span className="text-gray-900 font-semibold">{network.minimum_payout || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Payment Frequency</span>
                    <span className="text-gray-900 font-semibold">{network.payment_frequency || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Tracking Software</span>
                    <span className="text-gray-900 font-semibold">{network.tracking_software || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Payment Methods</span>
                    <span className="text-gray-900 font-semibold">
                      {network.payment_methods ? network.payment_methods.join(', ') : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Available Countries</span>
                    <span className="text-gray-900 font-semibold">
                      {network.countries ? network.countries.join(', ') : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Offers Section - Auto-filtered by network */}
              {networkOffers.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Offers</h2>
                  
                  {/* Category Filter */}
                  {offerVerticals.length > 1 && (
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setSelectedVertical('All')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedVertical === 'All'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          All ({networkOffers.length})
                        </button>
                        {offerVerticals.map(vertical => (
                          <button
                            key={vertical}
                            onClick={() => setSelectedVertical(vertical)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              selectedVertical === vertical
                                ? 'bg-blue-600 text-white'
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
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
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
              {resolvedParams && <UserReviews networkSlug={resolvedParams.slug} />}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Reviews</span>
                    <span className="font-semibold text-gray-900">{reviewCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Rating</span>
                    <span className="font-semibold text-gray-900">
                      {Number(avg("overall_rating")) || network.rating}/5
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Offers Available</span>
                    <span className="font-semibold text-gray-900">{networkOffers.length}</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FiGlobe className="w-5 h-5 text-gray-400" />
                    <a
                      href={network.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Visit Website
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiMail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600 text-sm">contact@{network.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiUsers className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600 text-sm">Affiliate Managers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {resolvedParams && (
        <ReviewModal
          open={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          networkName={network.name}
          networkSlug={resolvedParams.slug}
          onSubmitted={() => {
            setShowReviewModal(false);
            // Refresh reviews after submission
            window.location.reload();
          }}
        />
      )}
    </ErrorBoundary>
  );
} 