"use client";

import { useEffect, useState } from "react";
import { FiDollarSign, FiTrendingUp, FiGlobe, FiClock } from "react-icons/fi";
import { fetchOffers, type Offer } from "@/lib/api";

export default function OfferGrid() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOffers() {
      try {
        setLoading(true);
        const data = await fetchOffers();
        setOffers(data);
      } catch (err) {
        setError('Failed to load offers');
        console.error('Error loading offers:', err);
      } finally {
        setLoading(false);
      }
    }

    loadOffers();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow border border-gray-100 p-5 animate-pulse">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {offers.map((offer) => (
        <div
          key={offer.id}
          className="bg-white rounded-xl shadow border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-lg transition-all duration-200"
        >
          <div className="font-semibold text-lg text-gray-900 line-clamp-2">{offer.title}</div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiDollarSign className="text-green-500" />
              <span className="font-medium">{offer.network}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiGlobe className="text-blue-500" />
              <span>{offer.category}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiTrendingUp className="text-purple-500" />
              <span>{offer.country}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiClock className="text-orange-500" />
              <span>{offer.paymentSchedule}</span>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 line-clamp-2 mt-2">
            {offer.description}
          </div>
          
          <div className="mt-auto space-y-2">
            <div className="text-blue-700 font-bold text-lg">{offer.payout}</div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Conv: {offer.conversionRate}</span>
              <span>EPC: {offer.epc}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {offer.creatives.slice(0, 2).map((creative) => (
                <span
                  key={creative}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {creative}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 