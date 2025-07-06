"use client";
import { useState, useEffect } from 'react';
import { getAllNetworks } from '@/lib/networks-loader';
import { Network } from '@/data/networks';
import NetworkGrid from '@/components/NetworkGrid';
import Filters from '@/components/Filters';
import Tabs from '@/components/Tabs';

export default function NetworksPage() {
  const allNetworks = getAllNetworks();
  const [filteredNetworks, setFilteredNetworks] = useState<Network[]>(allNetworks);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('grid');

  const categories = ['all', ...Array.from(new Set(allNetworks.map((n: Network) => n.category)))];
  const allCountries = Array.from(new Set(allNetworks.flatMap((n: Network) => n.countries))).sort();

  useEffect(() => {
    let filtered = allNetworks;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(network => network.category === selectedCategory);
    }

    // Filter by countries
    if (selectedCountries.length > 0) {
      filtered = filtered.filter(network =>
        network.countries.some(country => selectedCountries.includes(country))
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(network =>
        network.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        network.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNetworks(filtered);
  }, [selectedCategory, selectedCountries, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Affiliate Networks
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the best affiliate networks to grow your business. 
            Compare features, commission rates, and find the perfect partner for your affiliate marketing strategy.
          </p>
        </div>

        <Filters
          categories={categories}
          countries={allCountries}
          selectedCategory={selectedCategory}
          selectedCountries={selectedCountries}
          searchTerm={searchTerm}
          onCategoryChange={setSelectedCategory}
          onCountriesChange={setSelectedCountries}
          onSearchChange={setSearchTerm}
        />

        <div className="mt-8">
          <Tabs
            tabs={[
              { id: 'grid', label: 'Grid View', icon: 'grid' },
              { id: 'list', label: 'List View', icon: 'list' }
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          
          <div className="mt-6">
            <NetworkGrid networks={filteredNetworks} />
          </div>
        </div>
      </div>
    </div>
  );
} 