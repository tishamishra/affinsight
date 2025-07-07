"use client";

import React, { useState } from "react";
import { FiSearch, FiTrendingUp, FiStar } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { getNetworkById, getFeaturedNetworks } from "@/lib/networks-loader";

const trendingTags = [
  "ClickBank", "AdCombo", "Mobidea", "MaxBounty", "CJ Affiliate", 
  "ShareASale", "Amazon Associates", "Commission Junction", "Awin", "Rakuten"
];

// Mapping of trending tag names to network IDs
const tagToNetworkId: { [key: string]: string } = {
  "ClickBank": "clickbank",
  "AdCombo": "adcombo", 
  "Mobidea": "mobidea",
  "MaxBounty": "maxbounty",
  "CJ Affiliate": "cj-affiliate",
  "Commission Junction": "cj-affiliate",
  "ShareASale": "shareasale"
};

const searchSuggestions = [
  "Weight loss offers",
  "Crypto trading",
  "Insurance leads",
  "Ecommerce stores",
  "Health supplements",
  "Financial services"
];

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const trendingNetworks = getFeaturedNetworks(5);

  const filteredSuggestions = searchSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTrendingTagClick = (tag: string) => {
    const networkId = tagToNetworkId[tag];
    if (networkId) {
      const network = getNetworkById(networkId);
      if (network) {
        router.push(`/network/${networkId}`);
      }
    }
  };

  const handleNetworkClick = (networkId: string) => {
    router.push(`/network/${networkId}`);
  };

  return (
    <section className="relative flex flex-col items-center justify-center py-16 md:py-24 px-4 text-center bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl shadow-lg overflow-hidden border border-gray-100">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
      <div className="relative z-10">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900 drop-shadow-sm">
          Find The Perfect{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Affiliate Network
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Browse affiliate networks and find the perfect partner to monetize your traffic and boost your affiliate marketing success.
        </p>
        
        <div className="relative w-full max-w-2xl mx-auto mb-8">
          <form className="flex items-center bg-white rounded-full shadow-lg border border-gray-200 px-4 py-3">
            <FiSearch className="text-gray-400 text-xl mr-3 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search affiliate networks, offers, programs..."
              className="flex-1 bg-transparent outline-none text-base md:text-lg px-2 py-1"
            />
            <button 
              type="submit" 
              className="ml-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Search
            </button>
          </form>
          
          {/* Search Suggestions */}
          {showSuggestions && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  onClick={() => setSearchQuery(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Trending Networks Section */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 text-lg font-semibold text-gray-700 mb-4">
            <FiTrendingUp className="text-blue-500" />
            <span>Trending Networks</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {trendingNetworks.map((network) => (
              <button
                key={network.id}
                onClick={() => handleNetworkClick(network.id)}
                className="group flex flex-col items-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md hover:bg-blue-50/50"
              >
                <div className="w-16 h-16 mb-3 flex items-center justify-center">
                  <img
                    src={network.logo_url}
                    alt={`${network.name} logo`}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                  {network.name}
                </h3>
                <div className="flex items-center gap-1">
                  <FiStar className="text-yellow-400 text-xs" />
                  <span className="text-xs text-gray-600">{network.rating}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <FiTrendingUp className="text-blue-500" />
            <span>Trending:</span>
          </div>
          {trendingTags.map((tag) => {
            const networkId = tagToNetworkId[tag];
            const isClickable = networkId && getNetworkById(networkId);
            
            return (
              <button
                key={tag}
                onClick={() => handleTrendingTagClick(tag)}
                disabled={!isClickable}
                className={`px-4 py-2 bg-white/80 backdrop-blur-sm text-blue-700 rounded-full text-sm font-medium border border-blue-100 transition-all duration-200 shadow-sm ${
                  isClickable 
                    ? 'hover:bg-blue-50 hover:shadow-md cursor-pointer' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
} 