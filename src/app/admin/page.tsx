"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FiGlobe, 
  FiGift, 
  FiPlus, 
  FiEye,
  FiTrendingUp
} from "react-icons/fi";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalNetworks: 0,
    totalOffers: 0,
    totalViews: 0
  });

  // Mock data - replace with real API calls
  useEffect(() => {
    setStats({
      totalNetworks: 24,
      totalOffers: 156,
      totalViews: 1247
    });
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to your affiliate network management dashboard
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Networks</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalNetworks}</p>
              <div className="flex items-center mt-2">
                <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+12% from last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiGlobe className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Offers</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalOffers}</p>
              <div className="flex items-center mt-2">
                <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+8% from last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiGift className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalViews.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+23% from last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FiEye className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/networks/add"
            className="group flex items-center p-6 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all duration-200"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
              <FiPlus className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                Add New Network
              </h3>
              <p className="text-gray-600 mt-1">Create a new affiliate network</p>
            </div>
          </Link>

          <Link
            href="/admin/offers/add"
            className="group flex items-center p-6 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all duration-200"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <FiPlus className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                Add New Offer
              </h3>
              <p className="text-gray-600 mt-1">Create a new affiliate offer</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <Link href="/admin/networks" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            View all networks
          </Link>
        </div>
        <div className="space-y-4">
          {[
            { action: "New network added", item: "MaxBounty", time: "2 hours ago" },
            { action: "Offer updated", item: "CPA Campaign", time: "4 hours ago" },
            { action: "Network status changed", item: "AdGate Media", time: "1 day ago" }
          ].map((activity, index) => (
            <div key={index} className="flex items-center py-3 border-b border-gray-100 last:border-b-0">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mr-4"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.item} • {activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 