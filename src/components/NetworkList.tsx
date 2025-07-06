"use client";
import { useState } from "react";
import Link from "next/link";
import { Network } from "@/data/networks";
import { FiChevronUp, FiChevronDown, FiExternalLink } from "react-icons/fi";

interface NetworkListProps {
  networks: Network[];
}

type SortField = "name" | "description" | "offers_count";
type SortDirection = "asc" | "desc";

export default function NetworkList({ networks }: NetworkListProps) {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedNetworks = [...networks].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "description":
        aValue = a.description?.toLowerCase() || "";
        bValue = b.description?.toLowerCase() || "";
        break;
      case "offers_count":
        aValue = a.offers_count || 0;
        bValue = b.offers_count || 0;
        break;
      default:
        return 0;
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <FiChevronUp className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <FiChevronUp className="w-4 h-4 text-blue-600" />
    ) : (
      <FiChevronDown className="w-4 h-4 text-blue-600" />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                >
                  <span>Network</span>
                  <SortIcon field="name" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort("description")}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                >
                  <span>Description</span>
                  <SortIcon field="description" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort("offers_count")}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                >
                  <span>Offers</span>
                  <SortIcon field="offers_count" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedNetworks.map((network) => (
              <tr key={network.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {network.name.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {network.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {network.category}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs">
                    {network.description}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Commission: {network.commission_rate}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {network.offers_count?.toLocaleString() || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {network.payment_frequency} payments
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link
                      href={`/network/${network.id}`}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      View Details
                    </Link>
                    <a
                      href={network.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 transition-colors flex items-center"
                    >
                      <FiExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 