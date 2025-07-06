import { FiStar, FiGlobe, FiExternalLink } from "react-icons/fi";
import { Network } from "@/types";

interface NetworkCardProps {
  network: Network;
}

export default function NetworkCard({ network }: NetworkCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            {network.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{network.name}</h3>
            <div className="flex items-center gap-1">
              <FiStar className="text-yellow-400 text-sm" />
              <span className="text-sm text-gray-600">{network.rating}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Category:</span> {network.category}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiGlobe className="text-blue-500" />
          <span>{network.countries.join(", ")}</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <a
          href={network.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          <FiExternalLink />
          Visit Site
        </a>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
          View Details
        </button>
      </div>
    </div>
  );
} 