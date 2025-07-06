"use client";
import { useState, useEffect } from 'react';
import { offers, getOffersByCategory, type Offer } from '@/data/offers';
import OfferGrid from '@/components/OfferGrid';
import Filters from '@/components/Filters';
import Tabs from '@/components/Tabs';

export default function OffersPage() {
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>(offers);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('grid');

  const categories = ['all', ...Array.from(new Set(offers.map(o => o.category)))];
  const allCountries = Array.from(new Set(offers.flatMap(o => o.countries))).sort();

  useEffect(() => {
    let filtered = offers;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(offer => offer.category === selectedCategory);
    }

    // Filter by countries
    if (selectedCountries.length > 0) {
      filtered = filtered.filter(offer =>
        offer.countries.some(country => selectedCountries.includes(country))
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(offer =>
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.network_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOffers(filtered);
  }, [selectedCategory, selectedCountries, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Affiliate Offers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover high-converting affiliate offers from top networks. 
            Find the perfect offers to promote and maximize your earnings.
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
            <OfferGrid offers={filteredOffers} />
          </div>
        </div>
      </div>
    </div>
  );
} 