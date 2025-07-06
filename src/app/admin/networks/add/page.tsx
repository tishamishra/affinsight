"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import NetworkForm from "@/components/forms/NetworkForm";
import { createNetwork, type Network } from "@/lib/database";

export default function AddNetworkPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      setIsLoading(true);
      
      // Convert countries string to array, keep all other fields
      const networkData: Omit<Network, 'id' | 'created_at' | 'updated_at'> = {
        ...data as Omit<Network, 'id' | 'created_at' | 'updated_at'>,
        countries: (data.countries as string).split(",").map((country: string) => country.trim()),
      };

      const { error } = await createNetwork(networkData);
      
      if (error) {
        alert("Failed to create network: " + error.message);
        return;
      }

      alert("Network created successfully!");
      router.push("/admin/networks");
    } catch (error) {
      console.error("Error creating network:", error);
      alert("Failed to create network");
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Add New Network</h1>
          <p className="mt-2 text-gray-600">
            Create a new affiliate network
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <NetworkForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
} 