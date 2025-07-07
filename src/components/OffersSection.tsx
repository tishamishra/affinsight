"use client";
import { useState, useEffect } from "react";
import { FiExternalLink, FiDollarSign, FiMapPin, FiTag, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Offer {
  id: string;
  offerName: string;
  payout: string;
  vertical: string;
  country: string;
  network: string;
}

interface Network {
  id: string;
  name: string;
  logo_url?: string;
}

interface OffersSectionProps {
  offers: Offer[];
  networks: Network[];
}

export default function OffersSection({ offers, networks }: OffersSectionProps) {
  const [selectedVertical, setSelectedVertical] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Predefined verticals list
  const verticals = [
    "All",
    "Nutra", 
    "Crypto",
    "Dating",
    "Gambling",
    "Game",
    "COD",
    "Sweepstakes",
    "Smartlink",
    "Pay per Call",
    "Mobile Offers",
    "Weight Loss",
    "SOI",
    "Gift Card",
    "Skin",
    "Health",
    "Free Trial"
  ];

  // Filter offers based on selected vertical from complete list
  const filteredOffers = selectedVertical === "All" 
    ? offers 
    : offers.filter(offer => offer.vertical === selectedVertical);

  // Calculate pagination
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOffers = filteredOffers.slice(startIndex, endIndex);

  // Reset to first page when vertical changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedVertical]);

  // Get network logo by name
  const getNetworkLogo = (networkName: string) => {
    const network = networks.find(n => n.name === networkName);
    return network?.logo_url || null;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          All Networks Offers
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover high-paying offers from top affiliate networks. 
          Filter by category and find the perfect opportunities to maximize your earnings.
        </p>
      </div>

      {/* Tab Selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {verticals.map((vertical) => (
          <button
            key={vertical}
            onClick={() => setSelectedVertical(vertical)}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedVertical === vertical
                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md"
                : "bg-white text-gray-700 border border-amber-200 hover:bg-amber-50 hover:border-amber-300"
            }`}
          >
            {vertical}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="text-center mb-6">
        <p className="text-gray-600">
          Showing <span className="font-semibold text-amber-600">{startIndex + 1}</span> to{" "}
          <span className="font-semibold text-amber-600">{Math.min(endIndex, filteredOffers.length)}</span> of{" "}
          <span className="font-semibold text-amber-600">{filteredOffers.length}</span> offers
          {selectedVertical !== "All" && (
            <span className="text-gray-500"> in {selectedVertical}</span>
          )}
        </p>
      </div>

      {/* Desktop List View */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-amber-200 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-amber-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Network</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payout</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-amber-200">
              {currentOffers.map((offer) => {
                const networkLogo = getNetworkLogo(offer.network);
                return (
                  <tr key={offer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">{offer.offerName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {networkLogo ? (
                          <img
                            src={networkLogo}
                            alt={`${offer.network} logo`}
                            className="w-8 h-8 object-contain rounded"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-amber-100 rounded flex items-center justify-center">
                            <span className="text-amber-600 font-semibold text-sm">{offer.network.charAt(0)}</span>
                          </div>
                        )}
                        <span className="text-gray-900 font-medium">{offer.network}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{offer.vertical}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{offer.country}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-amber-600 font-semibold">{offer.payout}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-1 px-3 rounded font-medium text-xs hover:from-amber-600 hover:to-orange-700 transition-all duration-200">
                          View Offer
                        </button>
                        <button className="p-2 text-amber-600 hover:text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors">
                          <FiExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Grid View */}
      <div className="lg:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {currentOffers.map((offer) => {
            const networkLogo = getNetworkLogo(offer.network);
            return (
              <div
                key={offer.id}
                className="bg-white rounded-xl shadow-sm border border-amber-200 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Network Logo and Info */}
                <div className="p-6 border-b border-amber-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 flex items-center justify-center">
                        {networkLogo ? (
                          <img
                            src={networkLogo}
                            alt={`${offer.network} logo`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        {/* Fallback */}
                        <div 
                          className={`w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center ${
                            networkLogo ? 'hidden' : ''
                          }`}
                        >
                          <span className="text-amber-600 font-semibold text-sm">
                            {offer.network.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{offer.network}</h3>
                        <p className="text-sm text-gray-500">Network</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-amber-600 font-semibold">
                        <FiDollarSign className="w-4 h-4 mr-1" />
                        {offer.payout}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Offer Details */}
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    {offer.offerName}
                  </h4>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <FiTag className="w-4 h-4 mr-2 text-amber-500" />
                      <span className="font-medium">{offer.vertical}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FiMapPin className="w-4 h-4 mr-2 text-amber-500" />
                      <span>{offer.country}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:from-amber-600 hover:to-orange-700 transition-all duration-200">
                      View Offer
                    </button>
                    <button className="p-2 text-amber-600 hover:text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors">
                      <FiExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-8">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-amber-300 rounded-md hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentPage === page
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                      : "text-gray-700 bg-white border border-amber-300 hover:bg-amber-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-amber-300 rounded-md hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <FiChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* View All Offers Button */}
      <div className="text-center mt-12">
        <a 
          href="/offers" 
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          View All Offers
        </a>
      </div>
    </div>
  );
} 