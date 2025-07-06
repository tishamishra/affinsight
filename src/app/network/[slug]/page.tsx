"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FiStar, FiUsers, FiGlobe, FiDollarSign, FiCalendar, FiExternalLink } from "react-icons/fi";
import { getNetworkById } from "@/lib/networks-loader";
import { Network } from "@/data/networks";

export default function NetworkDetailPage() {
  const params = useParams();
  const [network, setNetwork] = useState<Network | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function loadNetwork() {
      try {
        setLoading(true);
        const slug = params?.slug as string;
        const networkId = slug; // Assuming slug is the network ID
        const data = getNetworkById(networkId);
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

  if (loading) {
    return (
      <div className="py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !network) {
    return (
      <div className="py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Network Not Found</h1>
        <p className="text-gray-600 mb-6">{error || 'The requested network could not be found.'}</p>
        <a 
          href="/networks" 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Browse All Networks
        </a>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {network.logo_url && (
            <img
              src={network.logo_url}
              alt={`${network.name} logo`}
              className="w-20 h-20 object-contain rounded-lg"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold mb-2">{network.name}</h1>
            <p className="text-gray-600 text-lg">{network.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-4">Network Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FiStar className="text-yellow-400 text-xl" />
                <div>
                  <div className="font-medium">{network.rating} out of 5</div>
                  <div className="text-sm text-gray-500">Rating</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiDollarSign className="text-green-500 text-xl" />
                <div>
                  <div className="font-medium">{network.commission_rate}</div>
                  <div className="text-sm text-gray-500">Commission rate</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiGlobe className="text-blue-500 text-xl" />
                <div>
                  <div className="font-medium">{network.countries.join(", ")}</div>
                  <div className="text-sm text-gray-500">Available countries</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiUsers className="text-purple-500 text-xl" />
                <div>
                  <div className="font-medium">{network.offers_count?.toLocaleString() || 'N/A'}</div>
                  <div className="text-sm text-gray-500">Number of offers</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiCalendar className="text-orange-500 text-xl" />
                <div>
                  <div className="font-medium">{network.payment_frequency}</div>
                  <div className="text-sm text-gray-500">Payment frequency</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-4">Category</h2>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                {network.category}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-4">Key Features</h2>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Tracking Software: {network.tracking_software}</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Minimum Payout: {network.minimum_payout}</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Payment Frequency: {network.payment_frequency}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">Minimum Payout</div>
                <div className="font-medium">{network.minimum_payout}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Payment Methods</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {network.payment_methods?.map((method: string) => (
                    <span
                      key={method}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {method}
                    </span>
                  )) || <span className="text-gray-500 text-xs">N/A</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a
                href={network.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <FiExternalLink />
                Visit Website
              </a>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                Apply Now
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                Write Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 