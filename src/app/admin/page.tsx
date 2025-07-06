"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FiGlobe, 
  FiGift, 
  FiSettings, 
  FiUsers, 
  FiPlus, 
  FiTrendingUp,
  FiTrendingDown,
  FiEye,
  FiMessageSquare,
  FiDollarSign,
  FiBarChart,
  FiImage
} from "react-icons/fi";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalNetworks: 0,
    totalOffers: 0,
    totalMessages: 0,
    totalViews: 0
  });

  // Mock data - replace with real API calls
  useEffect(() => {
    setStats({
      totalNetworks: 24,
      totalOffers: 156,
      totalMessages: 8,
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
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Offers",
      value: stats.totalOffers,
      change: "+8%",
      changeType: "increase",
      icon: FiGift,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "New Messages",
      value: stats.totalMessages,
      change: "+3",
      changeType: "increase",
      icon: FiMessageSquare,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      change: "+23%",
      changeType: "increase",
      icon: FiEye,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const quickActions = [
    {
      title: "Add Network",
      description: "Create new affiliate network",
      href: "/admin/networks/add",
      icon: FiGlobe,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Add Offer",
      description: "Create new affiliate offer",
      href: "/admin/offers/add",
      icon: FiGift,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "View Messages",
      description: "Check contact form submissions",
      href: "/admin/messages",
      icon: FiMessageSquare,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Upload Images",
      description: "Upload logos and images",
      href: "/admin/images/upload",
      icon: FiImage,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here's what's happening with your affiliate network.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.changeType === "increase" ? (
                    <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <FiTrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.changeType === "increase" ? "text-green-600" : "text-red-600"
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="group p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <Link href="/admin/analytics" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {[
              { action: "New network added", item: "MaxBounty", time: "2 hours ago" },
              { action: "Offer updated", item: "CPA Campaign", time: "4 hours ago" },
              { action: "New message received", item: "Contact form", time: "6 hours ago" },
              { action: "Image uploaded", item: "Network logo", time: "1 day ago" }
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

        {/* Analytics Preview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Analytics Overview</h2>
            <Link href="/admin/analytics" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View details
            </Link>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-600">Page Views</p>
                <p className="text-2xl font-bold text-gray-900">2,847</p>
              </div>
              <FiBarChart className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">12.4%</p>
              </div>
              <FiTrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600">Check out our documentation or contact support</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Link
              href="/admin/settings"
              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Settings
            </Link>
            <Link
              href="/admin/messages"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              View Messages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 