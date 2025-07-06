import networks from '@/data/networks.json';
import NetworkCard from '@/components/NetworkCard';
import Filters from '@/components/Filters';
import Tabs from '@/components/Tabs';
import { Network } from '@/types';

export default function NetworksPage() {
  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-2">Affiliate Networks</h1>
      <p className="text-gray-600 mb-6">Browse all affiliate networks here.</p>
      <Filters />
      <Tabs />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {networks.map((network: Network) => (
          <NetworkCard key={network.id} network={network} />
        ))}
      </div>
    </div>
  );
} 