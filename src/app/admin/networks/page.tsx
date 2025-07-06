"use client";

import { useState, useEffect, useCallback } from "react";
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
  FiX,
  FiRefreshCw
} from "react-icons/fi";
import { getNetworks, deleteNetwork, type Network } from "@/lib/database";

export default function NetworksPage() {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch real data from Supabase
  const fetchNetworks = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching networks from Supabase...");
      const { data, error } = await getNetworks();
      console.log("Networks fetch response:", { data, error });
      if (error) {
        console.error("Error fetching networks:", error);
        return;
      }
      setNetworks(data || []);
      console.log("Networks set to state:", data || []);
    } catch (error) {
      console.error("Error fetching networks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNetworks();
  }, [fetchNetworks]);

  const filteredNetworks = networks.filter(network => {
    const matchesSearch = network.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (network.category && network.category.toLowerCase().includes(searchTerm.toLowerCase()));
    // Note: status field might not exist in current schema, so we'll show all for now
    return matchesSearch;
  });

  const handleDeleteNetwork = async (id: string) => {
    try {
      const { error } = await deleteNetwork(id);
      if (error) {
        alert("Failed to delete network: " + error.message);
        return;
      }
      await fetchNetworks(); // Refresh the list
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting network:", error);
      alert("Failed to delete network");
    }
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
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={fetchNetworks}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200 font-medium"
          >
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <Link
            href="/admin/networks/add"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Add Network
          </Link>
        </div>
      </div>

      {/* Debug Section */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-yellow-800 mb-2">Debug Info:</h3>
        <div className="text-xs text-yellow-700">
          <p>Total networks in state: {networks.length}</p>
          <p>Filtered networks: {filteredNetworks.length}</p>
          <p>Loading state: {loading ? 'true' : 'false'}</p>
          <details className="mt-2">
            <summary className="cursor-pointer">Raw network data:</summary>
            <pre className="mt-2 bg-white p-2 rounded text-xs overflow-auto max-h-32">
              {JSON.stringify(networks, null, 2)}
            </pre>
          </details>
        </div>
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
                      <img 
                        src={network.logo_url} 
                        alt={network.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log("Image failed to load:", network.logo_url);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
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
              </div>

              {/* Category */}
              <p className="text-sm text-gray-600 mb-4">{network.category}</p>

              {/* Website */}
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-sm text-gray-500">Website:</span>
                <a 
                  href={network.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-700 truncate"
                >
                  {network.website}
                </a>
              </div>

              {/* Countries */}
              <div className="mb-4">
                <span className="text-sm text-gray-500">Countries: </span>
                <span className="text-sm text-gray-900">
                  {Array.isArray(network.countries) 
                    ? network.countries.join(', ') 
                    : network.countries}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.open(network.website, '_blank')}
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
                  Added {formatDate(network.created_at || new Date().toISOString())}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredNetworks.length === 0 && !loading && (
        <div className="text-center py-12">
          <FiGlobe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No networks found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first network.'}
          </p>
          <Link
            href="/admin/networks/add"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Add Network
          </Link>
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