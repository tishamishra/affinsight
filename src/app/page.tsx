"use client";
import Hero from '@/components/Hero';
import NetworkFilters from '@/components/NetworkFilters';
import NetworkList from '@/components/NetworkList';
import { getFeaturedNetworks, getAllNetworks } from '@/lib/networks-loader';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const allNetworks = getAllNetworks();
  const [filteredNetworks, setFilteredNetworks] = useState<typeof allNetworks>([]);

  // Separate Ad Gain Media and shuffle other networks
  useEffect(() => {
    const adGainMedia = allNetworks.find(network => network.name === "Ad Gain Media");
    const otherNetworks = allNetworks.filter(network => network.name !== "Ad Gain Media");
    
    // Shuffle other networks
    const shuffledNetworks = [...otherNetworks].sort(() => Math.random() - 0.5);
    
    // Combine Ad Gain Media first, then shuffled networks
    const arrangedNetworks = adGainMedia ? [adGainMedia, ...shuffledNetworks] : shuffledNetworks;
    
    setFilteredNetworks(arrangedNetworks);
  }, [allNetworks]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            All Affiliate Networks
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover all affiliate networks trusted by marketers worldwide. 
            Browse through our comprehensive list and find the perfect platform for your affiliate marketing journey.
          </p>
        </div>
        
        <NetworkFilters 
          networks={allNetworks} 
          onFilterChange={setFilteredNetworks} 
        />
        
        <NetworkList networks={filteredNetworks} />
        
        <div className="text-center mt-12">
          <a 
            href="/networks" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            View All Networks
          </a>
        </div>
      </div>
    </div>
  );
}
