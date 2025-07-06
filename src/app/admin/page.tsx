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

  const statCards = [
    {
      title: "Total Networks",
      value: stats.totalNetworks,
      change: "+12%",
      changeType: "increase",
      icon: FiGlobe,
      color: "from-blue-500 to-blue-600",
      href: "/admin/networks"
    },
    {
      title: "Active Offers",
      value: stats.totalOffers,
      change: "+8%",
      changeType: "increase",
      icon: FiGift,
      color: "from-green-500 to-green-600",
      href: "/admin/offers"
    },
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      change: "+23%",
      changeType: "increase",
      icon: FiEye,
      color: "from-orange-500 to-orange-600",
      href: "#"
    }
  ];

  const quickActions = [
    {
      title: "Add New Network",
      description: "Create a new affiliate network",
      href: "/admin/networks/add",
      icon: FiGlobe,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      title: "Add New Offer",
      description: "Create a new affiliate offer",
      href: "/admin/offers/add",
      icon: FiGift,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here's an overview of your affiliate network.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            href={stat.href}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="group p-6 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                </div>
                <div className="ml-auto">
                  <FiPlus className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity - Simplified */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <Link href="/admin/networks" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            View all
          </Link>
        </div>
        <div className="space-y-4">
          {[
            { action: "New network added", item: "MaxBounty", time: "2 hours ago" },
            { action: "Offer updated", item: "CPA Campaign", time: "4 hours ago" },
            { action: "Network status changed", item: "AdGate Media", time: "1 day ago" }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
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