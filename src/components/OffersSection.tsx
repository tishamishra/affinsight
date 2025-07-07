"use client";
import { useState } from "react";
import { FiExternalLink, FiDollarSign, FiMapPin, FiTag } from "react-icons/fi";

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

  // Filter offers based on selected vertical
  const filteredOffers = selectedVertical === "All" 
    ? offers 
    : offers.filter(offer => offer.vertical === selectedVertical);

  // Get network logo by name
  const getNetworkLogo = (networkName: string) => {
    const network = networks.find(n => n.name === networkName);
    return network?.logo_url || null;
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

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffers.map((offer) => {
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