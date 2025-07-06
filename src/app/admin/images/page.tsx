"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FiImage, 
  FiUpload, 
  FiGrid, 
  FiTrash2, 
  FiEye,
  FiDownload,
  FiSearch,
  FiFilter
} from "react-icons/fi";

interface ImageItem {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploaded_at: string;
  category: string;
}

export default function ImagesPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Mock data - replace with Supabase query
  useEffect(() => {
    const mockImages: ImageItem[] = [
      {
        id: "1",
        name: "maxbounty-logo.png",
        url: "https://via.placeholder.com/200x100/3B82F6/FFFFFF?text=MaxBounty",
        size: 245760,
        type: "image/png",
        uploaded_at: "2024-01-15T10:30:00Z",
        category: "logos"
      },
      {
        id: "2",
        name: "cpalead-banner.jpg",
        url: "https://via.placeholder.com/400x200/10B981/FFFFFF?text=CPAlead",
        size: 512000,
        type: "image/jpeg",
        uploaded_at: "2024-01-14T15:45:00Z",
        category: "banners"
      },
      {
        id: "3",
        name: "adgate-icon.svg",
        url: "https://via.placeholder.com/100x100/8B5CF6/FFFFFF?text=AG",
        size: 15360,
        type: "image/svg+xml",
        uploaded_at: "2024-01-13T09:20:00Z",
        category: "icons"
      },
      {
        id: "4",
        name: "network-hero.jpg",
        url: "https://via.placeholder.com/800x400/6366F1/FFFFFF?text=Network+Hero",
        size: 1024000,
        type: "image/jpeg",
        uploaded_at: "2024-01-12T14:10:00Z",
        category: "hero"
      }
    ];

    setImages(mockImages);
    setLoading(false);
  }, []);

  const filteredImages = images.filter(image => {
    const matchesSearch = image.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || image.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDeleteImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Images</h1>
          <p className="mt-2 text-gray-600">
            Manage your image assets and media files
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Link
            href="/admin/images/upload"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium"
          >
            <FiUpload className="w-4 h-4 mr-2" />
            Upload Images
          </Link>
          <Link
            href="/admin/images/gallery"
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200 font-medium"
          >
            <FiGrid className="w-4 h-4 mr-2" />
            Gallery View
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Images</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{images.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FiImage className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Size</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatFileSize(images.reduce((acc, img) => acc + img.size, 0))}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FiDownload className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {new Set(images.map(img => img.category)).size}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <FiGrid className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recent Uploads</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {images.filter(img => {
                  const uploadDate = new Date(img.uploaded_at);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return uploadDate > weekAgo;
                }).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <FiUpload className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Categories</option>
            <option value="logos">Logos</option>
            <option value="banners">Banners</option>
            <option value="icons">Icons</option>
            <option value="hero">Hero Images</option>
          </select>
        </div>
      </div>

      {/* Images Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <FiImage className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No images found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || categoryFilter !== "all"
                ? 'No images match your filters.' 
                : 'Get started by uploading your first image.'}
            </p>
            {!searchTerm && categoryFilter === "all" && (
              <div className="mt-6">
                <Link
                  href="/admin/images/upload"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium"
                >
                  <FiUpload className="w-4 h-4 mr-2" />
                  Upload Images
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {filteredImages.map((image) => (
              <div key={image.id} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200">
                <div className="relative">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      onClick={() => window.open(image.url, '_blank')}
                      className="p-1 bg-white/80 rounded text-gray-600 hover:text-indigo-600 transition-colors"
                      title="View image"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="p-1 bg-white/80 rounded text-gray-600 hover:text-red-600 transition-colors"
                      title="Delete image"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 truncate">{image.name}</h3>
                  <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                    <span>{formatFileSize(image.size)}</span>
                    <span className="capitalize">{image.category}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Uploaded {formatDate(image.uploaded_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 