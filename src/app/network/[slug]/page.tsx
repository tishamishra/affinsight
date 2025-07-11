"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
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
import ReviewModal from "@/components/ReviewModal";
import UserReviews from "@/components/UserReviews";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);
import { getAllOffers } from '@/lib/offers-loader';

export default function NetworkDetailPage() {
  // All hooks at the top!
  const params = useParams();
  const [network, setNetwork] = useState<Network | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const supabase = createClientComponentClient();
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const allOffers = getAllOffers();
  const networkOffers = useMemo(() => {
    if (!network) return [];
    return allOffers.filter(o => o.network === network.name);
  }, [allOffers, network?.name]);
  const offerVerticals = useMemo(() => {
    if (!networkOffers) return [];
    return Array.from(new Set(networkOffers.map(o => o.vertical)));
  }, [networkOffers]);
  const [selectedVertical, setSelectedVertical] = useState('All');
  const filteredOffers = useMemo(() => selectedVertical === 'All' ? networkOffers : networkOffers.filter(o => o.vertical === selectedVertical), [networkOffers, selectedVertical]);
  const offersPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = useMemo(() => Math.ceil(filteredOffers.length / offersPerPage), [filteredOffers.length]);
  const paginatedOffers = useMemo(() => filteredOffers.slice((currentPage - 1) * offersPerPage, currentPage * offersPerPage), [filteredOffers, currentPage, offersPerPage]);

  useEffect(() => {
    function loadNetwork() {
      try {
        setLoading(true);
        const slug = params?.slug as string;
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

  useEffect(() => {
    async function fetchReviews() {
      setReviewsLoading(true);
      const { data, error } = await supabase
        .from("reviews")
        .select("overall_rating, offers_rating, payout_rating, tracking_rating, support_rating")
        .eq("network_slug", params?.slug as string)
        .eq("status", "approved");
      if (!error && data) setReviews(data);
      setReviewsLoading(false);
    }
    if (params?.slug) fetchReviews();
  }, [params?.slug]);

  const avg = (field: string) =>
    reviews.length ? (reviews.reduce((sum, r) => sum + (r[field] || 0), 0) / reviews.length).toFixed(1) : "-";
  const reviewCount = reviews.length;

  // Mock data for enhanced features
  const mockData = {
    reviews: 14,
    offersCount: network?.offers_count || 0,
    trackingSoftwareRating: 4.2,
    supportRating: 4.5,
    referralCommission: "5%",
    trackingLink: "https://tracking.example.com",
    affiliateManagers: "John Smith, Sarah Johnson"
  };

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

  const donutData = {
    labels: ['Offers', 'Payout', 'Tracking', 'Support'],
    datasets: [
      {
        data: [
          Number(avg('offers_rating')) || 0,
          Number(avg('payout_rating')) || 0,
          Number(avg('tracking_rating')) || 0,
          Number(avg('support_rating')) || 0,
        ],
        backgroundColor: [
          '#f87171', // red-400
          '#60a5fa', // blue-400
          '#34d399', // green-400
          '#a78bfa', // purple-400
        ],
        borderWidth: 2,
      },
    ],
  };
  const donutOptions = {
    cutout: '70%',
    plugins: {
      legend: { display: true, position: 'bottom' as const },
      tooltip: { enabled: true },
    },
  };

  // Now, after all hooks, do the early returns:
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

  console.log('network.name', network?.name);
  console.log('networkOffers', networkOffers);

  return (
    <div className="min-h-screen bg-gray-50">
      <ReviewModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        networkName={network.name}
        networkSlug={params?.slug as string}
      />
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
                {network.offers_count?.toLocaleString() || "-"}
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
              onClick={() => setReviewModalOpen(true)}
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
                  <span className="text-gray-900 font-semibold">{network.offers_count?.toLocaleString() || 'N/A'}</span>
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
                  <span className="text-gray-600 font-medium">Payment Methods</span>
                  <div className="flex flex-wrap gap-1">
                    {network.payment_methods?.map((method: string) => (
                      <span key={method} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {method}
                      </span>
                    )) || <span className="text-gray-500">N/A</span>}
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Referral Commission</span>
                  <span className="text-gray-900 font-semibold">{mockData.referralCommission}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Tracking Software</span>
                  <span className="text-gray-900 font-semibold">{network.tracking_software || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Tracking Link</span>
                  <a href={mockData.trackingLink} className="text-amber-600 hover:text-amber-700 font-medium">
                    View Link
                  </a>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-600 font-medium">Affiliate Managers</span>
                  <span className="text-gray-900 font-semibold">{mockData.affiliateManagers}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Rating Distribution */}
          <div className="space-y-6">
            {/* Rating Distribution Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Rating Distribution</h3>
              <div className="space-y-4">
                {/* Donut Chart Placeholder */}
                <div className="flex flex-col items-center justify-center h-32 bg-gray-50 rounded-lg">
                  <span className="text-5xl font-bold text-blue-600">{avg("overall_rating")}</span>
                  <div className="flex gap-1 mt-2">
                    {[1,2,3,4,5].map(i => (
                      <FiStar key={i} className={`w-6 h-6 ${i <= Math.round(Number(avg("overall_rating"))) ? "text-blue-400 fill-current" : "text-gray-300"}`} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 mt-1">Overall Network Rating</span>
                </div>
                
                {/* Rating Bars */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Offers</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">4.2</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Payout</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">4.5</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tracking</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '84%' }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">4.2</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Support</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">4.5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href={network.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 font-medium"
                >
                  <FiExternalLink className="w-5 h-5" />
                  Visit Website
                </a>
                <button className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  <FiMessageCircle className="w-5 h-5" />
                  Contact Network
                </button>
                                 <button className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                   <FiBarChart className="w-5 h-5" />
                   View Analytics
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {networkOffers.length > 0 ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Offers from {network.name}</h2>
          {offerVerticals.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedVertical === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => { setSelectedVertical('All'); setCurrentPage(1); }}
              >
                All
              </button>
              {offerVerticals.map(v => (
                <button
                  key={v}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedVertical === v ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  onClick={() => { setSelectedVertical(v); setCurrentPage(1); }}
                >
                  {v}
                </button>
              ))}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {paginatedOffers.map(offer => (
              <div key={offer.id} className="bg-white rounded-xl shadow-md border border-amber-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-200">
                <div>
                  <div className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
                    <span>{offer.offerName}</span>
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 ml-2">{offer.vertical}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">Country: <span className="font-medium">{offer.country}</span></div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-amber-600 font-bold text-xl">{offer.payout}</span>
                  <a href="/offers" className="text-blue-600 hover:underline text-sm font-medium">View Details</a>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-8 gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded bg-gray-100 text-gray-700 font-medium disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded font-medium ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded bg-gray-100 text-gray-700 font-medium disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </section>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-500">
          No offers found for this network.
        </div>
      )}
      <UserReviews networkSlug={params?.slug as string} />
      {/* Footer */}
    </div>
  );
} 