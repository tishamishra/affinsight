"use client";

import { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiEye, FiExternalLink } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { getNetworks, deleteNetwork } from "@/lib/database";

type Network = {
  id: string;
  name: string;
  website: string;
  category: string;
  rating: number;
  countries: string[] | string;
  logo_url?: string;
};

export default function NetworkList() {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchNetworks();
  }, []);

  const fetchNetworks = async () => {
    try {
      setLoading(true);
      const { data, error } = await getNetworks();
      if (error) {
        console.error("Error fetching networks:", error);
        return;
      }
      setNetworks(data || []);
    } catch (error) {
      console.error("Error fetching networks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this network?")) {
      return;
    }

    try {
      setDeleting(id);
      const { error } = await deleteNetwork(id);
      if (error) {
        alert("Failed to delete network");
        return;
      }
      await fetchNetworks();
    } catch (error) {
      console.error("Error deleting network:", error);
      alert("Failed to delete network");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (networks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No networks found.</p>
        <Link
          href="/admin/networks/add"
          className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Add First Network
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Network
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rating
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Countries
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {networks.map((network) => (
            <tr key={network.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {network.logo_url && (
                    <Image
                      src={network.logo_url}
                      alt={network.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-lg object-contain mr-3"
                    />
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {network.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {network.website}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {network.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <span className="text-sm text-gray-900">{network.rating}</span>
                  <div className="ml-2 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(network.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {Array.isArray(network.countries)
                    ? network.countries.join(", ")
                    : network.countries}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/networks/${network.id}`}
                    className="text-blue-600 hover:text-blue-900"
                    title="View"
                  >
                    <FiEye className="w-4 h-4" />
                  </Link>
                  <a
                    href={network.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                    title="Visit Website"
                  >
                    <FiExternalLink className="w-4 h-4" />
                  </a>
                  <Link
                    href={`/admin/networks/edit/${network.id}`}
                    className="text-green-600 hover:text-green-900"
                    title="Edit"
                  >
                    <FiEdit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(network.id)}
                    disabled={deleting === network.id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 