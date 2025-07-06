"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import Image from "next/image";
import { FiUpload, FiX } from "react-icons/fi";
import { uploadLogo } from "@/lib/storage";

const networkSchema = z.object({
  name: z.string().min(1, "Network name is required"),
  website: z.string().url("Please enter a valid URL"),
  category: z.string().min(1, "Category is required"),
  rating: z.number().min(0).max(5),
  countries: z.string().min(1, "At least one country is required"),
  logo_url: z.string().optional(),
});

type NetworkFormData = z.infer<typeof networkSchema>;

interface NetworkFormProps {
  initialData?: Partial<NetworkFormData>;
  onSubmit: (data: NetworkFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function NetworkForm({ initialData, onSubmit, isLoading }: NetworkFormProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logo_url || null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NetworkFormData>({
    resolver: zodResolver(networkSchema),
    defaultValues: initialData,
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleFormSubmit = async (data: NetworkFormData) => {
    try {
      setUploading(true);
      let logoUrl = data.logo_url;

      if (logoFile) {
        const { url, error } = await uploadLogo(logoFile);
        if (error) {
          alert("Failed to upload logo");
          return;
        }
        logoUrl = url;
      }

      await onSubmit({ ...data, logo_url: logoUrl });
      reset();
      setLogoFile(null);
      setLogoPreview(null);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Network Name *
        </label>
        <input
          type="text"
          {...register("name")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter network name"
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Website URL *
        </label>
        <input
          type="url"
          {...register("website")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://example.com"
        />
        {errors.website && (
          <p className="text-red-600 text-sm mt-1">{errors.website.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <select
          {...register("category")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select category</option>
          <option value="CPA Network">CPA Network</option>
          <option value="Digital Products">Digital Products</option>
          <option value="Mobile Performance">Mobile Performance</option>
          <option value="Affiliate Network">Affiliate Network</option>
          <option value="Ecommerce">Ecommerce</option>
        </select>
        {errors.category && (
          <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating
        </label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="5"
          {...register("rating", { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="4.5"
        />
        {errors.rating && (
          <p className="text-red-600 text-sm mt-1">{errors.rating.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Countries (comma-separated) *
        </label>
        <input
          type="text"
          {...register("countries")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="US, CA, UK"
        />
        {errors.countries && (
          <p className="text-red-600 text-sm mt-1">{errors.countries.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Logo
        </label>
        <div className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {logoPreview && (
            <div className="relative inline-block">
              <Image
                src={logoPreview}
                alt="Logo preview"
                width={128}
                height={128}
                className="w-32 h-32 object-contain border border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={removeLogo}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={isLoading || uploading}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {uploading ? (
            <>
              <FiUpload className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <FiUpload />
              Save Network
            </>
          )}
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