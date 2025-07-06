"use client";

import { useEffect, useState } from "react";
import { FiStar, FiUsers, FiGlobe, FiDollarSign } from "react-icons/fi";
import { fetchNetworks, type AffiliateNetwork } from "@/lib/api";

export default function NetworkGrid() {
  const [networks, setNetworks] = useState<AffiliateNetwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNetworks() {
      try {
        setLoading(true);
        const data = await fetchNetworks();
        setNetworks(data);
      } catch (err) {
        setError('Failed to load networks');
        console.error('Error loading networks:', err);
      } finally {
        setLoading(false);
      }
    }

    loadNetworks();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {networks.map((network) => (
        <div
          key={network.id}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                {network.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{network.name}</h3>
                <div className="flex items-center gap-1">
                  <FiStar className="text-yellow-400 text-sm" />
                  <span className="text-sm text-gray-600">{network.rating}</span>
                  <span className="text-sm text-gray-400">({network.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{network.description}</p>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiDollarSign className="text-green-500" />
              <span className="font-medium">{network.payout}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiGlobe className="text-blue-500" />
              <span>{network.countries.join(", ")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiUsers className="text-purple-500" />
              <span>Min payout: {network.minPayout}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {network.categories.slice(0, 3).map((category) => (
              <span
                key={category}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
          
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
              View Details
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
              Visit Site
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 