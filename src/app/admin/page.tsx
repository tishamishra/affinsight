"use client";

import Link from "next/link";
import { FiGlobe, FiGift, FiSettings, FiUsers, FiPlus } from "react-icons/fi";

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to your affiliate network management dashboard
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/admin/networks/add"
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiGlobe className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Add Network</h3>
              <p className="text-sm text-gray-600">Create new affiliate network</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/offers/add"
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiGift className="text-green-600 text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Add Offer</h3>
              <p className="text-sm text-gray-600">Create new affiliate offer</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/images/upload"
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiPlus className="text-purple-600 text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Upload Images</h3>
              <p className="text-sm text-gray-600">Upload logos and images</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/settings"
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FiSettings className="text-orange-600 text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Settings</h3>
              <p className="text-sm text-gray-600">System configuration</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/networks"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            View All Networks
          </Link>
          <Link
            href="/admin/offers/list"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            View All Offers
          </Link>
          <Link
            href="/admin/images/gallery"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Image Gallery
          </Link>
          <Link
            href="/networks"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            View Public Networks
          </Link>
        </div>
      </div>
    </div>
  );
} 