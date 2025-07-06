"use client";
import Link from "next/link";
import Image from "next/image";
import { Network } from "@/data/networks";

interface FeaturedNetworksProps {
  networks: Network[];
}

export default function FeaturedNetworks({ networks }: FeaturedNetworksProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {networks.map((network) => (
        <Link
          key={network.id}
          href={`/network/${network.id}`}
          className="group block"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center">
              {/* Logo */}
              <div className="w-16 h-16 mb-3 flex items-center justify-center">
                {network.logo_url ? (
                  <Image
                    src={network.logo_url}
                    alt={`${network.name} logo`}
                    width={64}
                    height={64}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      // Fallback to network name if logo fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                {/* Fallback - Network name initial */}
                <div 
                  className={`w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center ${
                    network.logo_url ? 'hidden' : ''
                  }`}
                >
                  <span className="text-blue-600 font-semibold text-lg">
                    {network.name.charAt(0)}
                  </span>
                </div>
              </div>
              
              {/* Network name - hidden as requested */}
              <div className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                {network.name}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 