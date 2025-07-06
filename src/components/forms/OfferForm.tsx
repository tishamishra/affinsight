"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { FiSave } from "react-icons/fi";
import { getNetworks } from "@/lib/database";
import type { Network } from "@/lib/supabase";

const offerSchema = z.object({
  offer_name: z.string().min(1, "Offer name is required"),
  payout: z.string().min(1, "Payout is required"),
  vertical: z.string().min(1, "Vertical is required"),
  country: z.string().min(1, "Country is required"),
  network_id: z.string().min(1, "Network is required"),
});

type OfferFormData = z.infer<typeof offerSchema>;

interface OfferFormProps {
  initialData?: Partial<OfferFormData>;
  onSubmit: (data: OfferFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function OfferForm({ initialData, onSubmit, isLoading }: OfferFormProps) {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [loadingNetworks, setLoadingNetworks] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        const { data, error } = await getNetworks();
        if (error) {
          console.error("Error fetching networks:", error);
          return;
        }
        setNetworks(data || []);
      } catch (error) {
        console.error("Error fetching networks:", error);
      } finally {
        setLoadingNetworks(false);
      }
    };

    fetchNetworks();
  }, []);

  const handleFormSubmit = async (data: OfferFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Offer Name *
        </label>
        <input
          type="text"
          {...register("offer_name")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter offer name"
        />
        {errors.offer_name && (
          <p className="text-red-600 text-sm mt-1">{errors.offer_name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payout *
        </label>
        <input
          type="text"
          {...register("payout")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., $50 CPA"
        />
        {errors.payout && (
          <p className="text-red-600 text-sm mt-1">{errors.payout.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vertical *
        </label>
        <select
          {...register("vertical")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select vertical</option>
          <option value="Ecommerce">Ecommerce</option>
          <option value="Finance">Finance</option>
          <option value="Gaming">Gaming</option>
          <option value="Health & Beauty">Health & Beauty</option>
          <option value="Education">Education</option>
          <option value="Technology">Technology</option>
          <option value="Travel">Travel</option>
          <option value="Entertainment">Entertainment</option>
        </select>
        {errors.vertical && (
          <p className="text-red-600 text-sm mt-1">{errors.vertical.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Country *
        </label>
        <input
          type="text"
          {...register("country")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., US, CA, UK"
        />
        {errors.country && (
          <p className="text-red-600 text-sm mt-1">{errors.country.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Network *
        </label>
        {loadingNetworks ? (
          <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
            Loading networks...
          </div>
        ) : (
          <select
            {...register("network_id")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select network</option>
            {networks.map((network) => (
              <option key={network.id} value={network.id}>
                {network.name}
              </option>
            ))}
          </select>
        )}
        {errors.network_id && (
          <p className="text-red-600 text-sm mt-1">{errors.network_id.message}</p>
        )}
      </div>

      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          <FiSave />
          Save Offer
        </button>
        <button
          type="button"
          onClick={() => reset()}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Reset
        </button>
      </div>
    </form>
  );
} 