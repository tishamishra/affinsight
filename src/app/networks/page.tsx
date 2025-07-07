"use client";
import { useState, useEffect } from 'react';
import { getAllNetworks } from '@/lib/networks-loader';
import { getAllOffers } from '@/lib/offers-loader';
import { Network } from '@/data/networks';
import NetworkList from '@/components/NetworkList';
import Filters from '@/components/Filters';

export default function NetworksPage() {
  const allNetworks = getAllNetworks();
  const allOffers = getAllOffers();
  // Merge networks from offers
  const offerNetworkNames = Array.from(new Set(allOffers.map(o => o.network)));
  const allNetworkNames = new Set(allNetworks.map(n => n.name));
  const missingNetworks = offerNetworkNames.filter(name => !allNetworkNames.has(name));
  const placeholderNetworks = missingNetworks.map((name, idx) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name,
    category: 'Unknown',
    website: '',
    logo_url: '',
    rating: 0,
    countries: [],
    description: '',
    commission_rate: '',
    offers_count: allOffers.filter(o => o.network === name).length,
    payment_frequency: '',
    payment_methods: [],
    tracking_software: '',
    minimum_payout: ''
  }));
  const mergedNetworks = [...allNetworks, ...placeholderNetworks];
  const [filteredNetworks, setFilteredNetworks] = useState<Network[]>(mergedNetworks);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = ['all', ...Array.from(new Set(mergedNetworks.map((n: Network) => n.category)))];
  const allCountries = Array.from(new Set(mergedNetworks.flatMap((n: Network) => n.countries))).sort();

  useEffect(() => {
    let filtered = mergedNetworks;

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
  }, [selectedCategory, selectedCountries, searchTerm, mergedNetworks]);

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
          <NetworkList networks={filteredNetworks} itemsPerPage={20} />
        </div>
      </div>
    </div>
  );
} 