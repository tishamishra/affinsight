"use client";
import Hero from '@/components/Hero';
import NetworkFilters from '@/components/NetworkFilters';
import NetworkList from '@/components/NetworkList';
import FeaturedNetworks from '@/components/FeaturedNetworks';
import { getFeaturedNetworks } from '@/lib/networks-loader';

export default function HomePage() {
  const featuredNetworks = getFeaturedNetworks(6);

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Affiliate Networks
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the top affiliate networks trusted by marketers worldwide. 
            Start your affiliate marketing journey with these proven platforms.
          </p>
        </div>
        
        <FeaturedNetworks networks={featuredNetworks} />
        
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
