"use client";
import Hero from '@/components/Hero';
import NetworkFilters from '@/components/NetworkFilters';
import NetworkList from '@/components/NetworkList';
import { getFeaturedNetworks, getAllNetworks } from '@/lib/networks-loader';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const allNetworks = getAllNetworks();
  const [filteredNetworks, setFilteredNetworks] = useState<typeof allNetworks>([]);

  // Separate AdBlueMedia and shuffle other networks
  useEffect(() => {
    const adBlueMedia = allNetworks.find(network => network.name === "AdBlueMedia");
    const otherNetworks = allNetworks.filter(network => network.name !== "AdBlueMedia");
    
    // Shuffle other networks
    const shuffledNetworks = [...otherNetworks].sort(() => Math.random() - 0.5);
    
    // Combine AdBlueMedia first, then shuffled networks
    const arrangedNetworks = adBlueMedia ? [adBlueMedia, ...shuffledNetworks] : shuffledNetworks;
    
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
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            View All Networks
          </a>
        </div>
      </div>
    </div>
  );
}
