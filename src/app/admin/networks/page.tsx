"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FiGlobe, 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiSearch, 
  FiFilter,
  FiEye,
  FiExternalLink,
  FiStar,
  FiTrendingUp,
  FiX
} from "react-icons/fi";

interface Network {
  id: string;
  name: string;
  description: string;
  logo_url?: string;
  website_url: string;
  commission_rate: string;
  payment_methods: string[];
  categories: string[];
  status: "active" | "inactive";
  created_at: string;
  offers_count: number;
  rating: number;
}

export default function NetworksPage() {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Mock data - replace with Supabase query
  useEffect(() => {
    const mockNetworks: Network[] = [
      {
        id: "1",
        name: "MaxBounty",
        description: "Leading CPA network with high-paying offers across multiple verticals",
        logo_url: "https://via.placeholder.com/60x60/3B82F6/FFFFFF?text=MB",
        website_url: "https://maxbounty.com",
        commission_rate: "Up to $50",
        payment_methods: ["PayPal", "Bank Transfer", "Check"],
        categories: ["Gaming", "Finance", "Health"],
        status: "active",
        created_at: "2024-01-15T10:30:00Z",
        offers_count: 24,
        rating: 4.8
      },
      {
        id: "2",
        name: "CPAlead",
        description: "Premium affiliate network specializing in mobile and desktop offers",
        logo_url: "https://via.placeholder.com/60x60/10B981/FFFFFF?text=CP",
        website_url: "https://cpalead.com",
        commission_rate: "Up to $35",
        payment_methods: ["PayPal", "Skrill", "Bank Transfer"],
        categories: ["Mobile", "Desktop", "Gaming"],
        status: "active",
        created_at: "2024-01-14T15:45:00Z",
        offers_count: 18,
        rating: 4.6
      },
      {
        id: "3",
        name: "AdGate Media",
        description: "Innovative performance marketing network with global reach",
        logo_url: "https://via.placeholder.com/60x60/8B5CF6/FFFFFF?text=AG",
        website_url: "https://adgatemedia.com",
        commission_rate: "Up to $40",
        payment_methods: ["PayPal", "Bank Transfer", "Crypto"],
        categories: ["Technology", "Education", "Entertainment"],
        status: "active",
        created_at: "2024-01-13T09:20:00Z",
        offers_count: 32,
        rating: 4.7
      }
    ];

    setNetworks(mockNetworks);
    setLoading(false);
  }, []);

  const filteredNetworks = networks.filter(network => {
    const matchesSearch = network.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         network.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || network.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteNetwork = (id: string) => {
    setNetworks(prev => prev.filter(network => network.id !== id));
    setShowDeleteModal(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
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
          <h1 className="text-3xl font-bold text-gray-900">Networks</h1>
          <p className="mt-2 text-gray-600">
            Manage your affiliate networks and partnerships
          </p>
        </div>
        <Link
          href="/admin/networks/add"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Add Network
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search networks..."
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
          </select>
        </div>
      </div>

      {/* Networks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNetworks.map((network) => (
          <div key={network.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                    {network.logo_url ? (
                      <img src={network.logo_url} alt={network.name} className="w-full h-full object-cover" />
                    ) : (
                      <FiGlobe className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{network.name}</h3>
                    <div className="flex items-center space-x-1 mt-1">
                      {renderStars(network.rating)}
                      <span className="text-sm text-gray-500 ml-1">({network.rating})</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    network.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {network.status}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{network.description}</p>

              {/* Stats */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">{network.offers_count}</p>
                  <p className="text-xs text-gray-500">Offers</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-green-600">{network.commission_rate}</p>
                  <p className="text-xs text-gray-500">Commission</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">{network.categories.length}</p>
                  <p className="text-xs text-gray-500">Categories</p>
                </div>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-1 mb-4">
                {network.categories.slice(0, 3).map((category, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full"
                  >
                    {category}
                  </span>
                ))}
                {network.categories.length > 3 && (
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    +{network.categories.length - 3}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.open(network.website_url, '_blank')}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Visit website"
                  >
                    <FiExternalLink className="w-4 h-4" />
                  </button>
                  <Link
                    href={`/admin/networks/edit/${network.id}`}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit network"
                  >
                    <FiEdit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedNetwork(network);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete network"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-gray-500">
                  Added {formatDate(network.created_at)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredNetworks.length === 0 && (
        <div className="text-center py-12">
          <FiGlobe className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No networks found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== "all" 
              ? 'No networks match your filters.' 
              : 'Get started by adding your first network.'}
          </p>
          {!searchTerm && statusFilter === "all" && (
            <div className="mt-6">
              <Link
                href="/admin/networks/add"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                Add Network
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedNetwork && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDeleteModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Delete Network</h3>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to delete <strong>{selectedNetwork.name}</strong>? This action cannot be undone.
                </p>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteNetwork(selectedNetwork.id)}
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