"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import NetworkForm from "@/components/forms/NetworkForm";
import { getNetworkById, updateNetwork, type Network } from "@/lib/database";

export default function EditNetworkPage() {
  const router = useRouter();
  const params = useParams();
  const networkId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [network, setNetwork] = useState<Network | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNetwork();
  }, [networkId]);

  const fetchNetwork = async () => {
    try {
      setLoading(true);
      const { data, error } = await getNetworkById(networkId);
      if (error) {
        console.error("Error fetching network:", error);
        alert("Failed to load network");
        router.push("/admin/networks");
        return;
      }
      setNetwork(data);
    } catch (error) {
      console.error("Error fetching network:", error);
      alert("Failed to load network");
      router.push("/admin/networks");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      setIsLoading(true);
      
      // Convert countries string to array if it's a string
      const updateData: Partial<Network> = {
        ...data as Partial<Network>,
        countries: typeof data.countries === 'string' 
          ? data.countries.split(",").map((country: string) => country.trim())
          : (data.countries as string[]),
      };

      const { error } = await updateNetwork(networkId, updateData);
      
      if (error) {
        alert("Failed to update network: " + error.message);
        return;
      }

      alert("Network updated successfully!");
      router.push("/admin/networks");
    } catch (error) {
      console.error("Error updating network:", error);
      alert("Failed to update network");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading network...</p>
        </div>
      </div>
    );
  }

  if (!network) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Network Not Found</h2>
          <p className="text-gray-600 mb-6">The network you're looking for doesn't exist.</p>
          <Link
            href="/admin/networks"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium"
          >
            Back to Networks
          </Link>
        </div>
      </div>
    );
  }

  // Convert countries array to string for the form
  const initialData = {
    ...network,
    countries: Array.isArray(network.countries) 
      ? network.countries.join(", ") 
      : network.countries,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/admin/networks"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Networks
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Network</h1>
          <p className="mt-2 text-gray-600">
            Update network information
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <NetworkForm 
            initialData={initialData} 
            onSubmit={handleSubmit} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </div>
  );
} 