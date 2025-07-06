"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FiGift, 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiSearch, 
  FiFilter,
  FiEye,
  FiExternalLink,
  FiStar,
  FiTrendingUp,
  FiDollarSign,
  FiX
} from "react-icons/fi";

interface Offer {
  id: string;
  title: string;
  description: string;
  network_name: string;
  commission_rate: string;
  payout_type: "CPA" | "CPL" | "CPS" | "RevShare";
  categories: string[];
  countries: string[];
  status: "active" | "inactive" | "pending";
  created_at: string;
  conversion_rate: number;
  avg_payout: number;
  requirements: string;
  preview_url?: string;
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Mock data - replace with Supabase query
  useEffect(() => {
    const mockOffers: Offer[] = [
      {
        id: "1",
        title: "Gaming Survey - High Payout",
        description: "Complete gaming surveys and earn up to $50 per survey. Available worldwide with instant payout.",
        network_name: "MaxBounty",
        commission_rate: "$25 - $50",
        payout_type: "CPA",
        categories: ["Gaming", "Survey"],
        countries: ["US", "CA", "UK", "AU"],
        status: "active",
        created_at: "2024-01-15T10:30:00Z",
        conversion_rate: 12.5,
        avg_payout: 35.0,
        requirements: "18+ years old, valid email, gaming interest"
      },
      {
        id: "2",
        title: "Shopping Reward Program",
        description: "Earn cashback on your online purchases. Shop at your favorite stores and get rewarded.",
        network_name: "CPAlead",
        commission_rate: "$15 - $30",
        payout_type: "CPS",
        categories: ["Shopping", "Cashback"],
        countries: ["US", "CA", "UK"],
        status: "active",
        created_at: "2024-01-14T15:45:00Z",
        conversion_rate: 8.2,
        avg_payout: 22.5,
        requirements: "Valid payment method, shopping history"
      },
      {
        id: "3",
        title: "Mobile App Download",
        description: "Download and test mobile apps for rewards. Simple tasks with quick payouts.",
        network_name: "AdGate Media",
        commission_rate: "$5 - $15",
        payout_type: "CPA",
        categories: ["Mobile", "App"],
        countries: ["US", "CA", "UK", "AU", "DE"],
        status: "active",
        created_at: "2024-01-13T09:20:00Z",
        conversion_rate: 15.8,
        avg_payout: 10.0,
        requirements: "Android/iOS device, app store account"
      },
      {
        id: "4",
        title: "Email Signup Campaign",
        description: "Sign up for newsletters and receive exclusive offers. Easy money for simple tasks.",
        network_name: "MaxBounty",
        commission_rate: "$2 - $8",
        payout_type: "CPL",
        categories: ["Email", "Newsletter"],
        countries: ["US", "CA", "UK", "AU"],
        status: "pending",
        created_at: "2024-01-12T14:10:00Z",
        conversion_rate: 6.4,
        avg_payout: 5.0,
        requirements: "Valid email address, newsletter interest"
      }
    ];

    setOffers(mockOffers);
    setLoading(false);
  }, []);

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.network_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || offer.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || offer.categories.includes(categoryFilter);
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleDeleteOffer = (id: string) => {
    setOffers(prev => prev.filter(offer => offer.id !== id));
    setShowDeleteModal(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPayoutTypeColor = (type: string) => {
    switch (type) {
      case 'CPA':
        return 'bg-blue-100 text-blue-800';
      case 'CPL':
        return 'bg-green-100 text-green-800';
      case 'CPS':
        return 'bg-purple-100 text-purple-800';
      case 'RevShare':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Offers</h1>
          <p className="mt-2 text-gray-600">
            Manage your affiliate offers and campaigns
          </p>
        </div>
        <Link
          href="/admin/offers/add"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Add Offer
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search offers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Categories</option>
            <option value="Gaming">Gaming</option>
            <option value="Survey">Survey</option>
            <option value="Shopping">Shopping</option>
            <option value="Mobile">Mobile</option>
            <option value="Email">Email</option>
          </select>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOffers.map((offer) => (
          <div key={offer.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">{offer.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{offer.network_name}</p>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(offer.status)}`}>
                      {offer.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPayoutTypeColor(offer.payout_type)}`}>
                      {offer.payout_type}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <FiDollarSign className="w-5 h-5 text-green-600" />
                  <span className="text-lg font-semibold text-green-600">{offer.avg_payout}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{offer.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">{offer.commission_rate}</p>
                  <p className="text-xs text-gray-500">Commission</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-blue-600">{offer.conversion_rate}%</p>
                  <p className="text-xs text-gray-500">Conv. Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">{offer.countries.length}</p>
                  <p className="text-xs text-gray-500">Countries</p>
                </div>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-1 mb-4">
                {offer.categories.map((category, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>

              {/* Requirements */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-1">Requirements:</p>
                <p className="text-xs text-gray-600">{offer.requirements}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  {offer.preview_url && (
                    <button
                      onClick={() => window.open(offer.preview_url, '_blank')}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Preview offer"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                  )}
                  <Link
                    href={`/admin/offers/edit/${offer.id}`}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit offer"
                  >
                    <FiEdit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedOffer(offer);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete offer"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-gray-500">
                  Added {formatDate(offer.created_at)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredOffers.length === 0 && (
        <div className="text-center py-12">
          <FiGift className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No offers found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
              ? 'No offers match your filters.' 
              : 'Get started by adding your first offer.'}
          </p>
          {!searchTerm && statusFilter === "all" && categoryFilter === "all" && (
            <div className="mt-6">
              <Link
                href="/admin/offers/add"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                Add Offer
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedOffer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDeleteModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Delete Offer</h3>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to delete <strong>{selectedOffer.title}</strong>? This action cannot be undone.
                </p>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteOffer(selectedOffer.id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 