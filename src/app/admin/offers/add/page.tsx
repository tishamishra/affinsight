"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import OfferForm from "@/components/forms/OfferForm";
import { createOffer } from "@/lib/database";

export default function AddOfferPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      
      const { error } = await createOffer(data);
      
      if (error) {
        alert("Failed to create offer: " + error.message);
        return;
      }

      alert("Offer created successfully!");
      router.push("/admin/offers");
    } catch (error) {
      console.error("Error creating offer:", error);
      alert("Failed to create offer");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/admin/offers"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Offers
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add New Offer</h1>
          <p className="mt-2 text-gray-600">
            Create a new affiliate offer
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <OfferForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
} 