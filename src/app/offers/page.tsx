import offers from '@/data/offers.json';
import OfferTable from '@/components/OfferTable';
import Filters from '@/components/Filters';
import { Offer } from '@/types';

export default function OffersPage() {
  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-2">Offers</h1>
      <p className="text-gray-600 mb-6">Browse all offers here.</p>
      <Filters />
      <OfferTable offers={offers as Offer[]} />
    </div>
  );
} 