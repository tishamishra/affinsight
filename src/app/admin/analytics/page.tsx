"use client";

import { useState, useEffect } from "react";
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiEye, 
  FiUsers, 
  FiGlobe, 
  FiGift,
  FiBarChart,
  FiCalendar,
  FiDollarSign
} from "react-icons/fi";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [loading, setLoading] = useState(false);

  const stats = [
    {
      title: "Total Page Views",
      value: "24,847",
      change: "+12.5%",
      changeType: "increase",
      icon: FiEye,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Unique Visitors",
      value: "8,234",
      change: "+8.2%",
      changeType: "increase",
      icon: FiUsers,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Network Clicks",
      value: "1,456",
      change: "+15.3%",
      changeType: "increase",
      icon: FiGlobe,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Offer Conversions",
      value: "234",
      change: "+5.7%",
      changeType: "increase",
      icon: FiGift,
      color: "from-orange-500 to-orange-600"
    }
  ];

  const topNetworks = [
    { name: "MaxBounty", clicks: 456, conversions: 23, revenue: "$2,340" },
    { name: "CPAlead", clicks: 389, conversions: 18, revenue: "$1,890" },
    { name: "AdGate Media", clicks: 312, conversions: 15, revenue: "$1,560" },
    { name: "ClickDealer", clicks: 298, conversions: 12, revenue: "$1,200" },
    { name: "RevenueAds", clicks: 245, conversions: 10, revenue: "$980" }
  ];

  const topOffers = [
    { name: "Gaming Survey", clicks: 234, conversions: 18, revenue: "$1,440" },
    { name: "Shopping Reward", clicks: 198, conversions: 15, revenue: "$1,200" },
    { name: "App Download", clicks: 167, conversions: 12, revenue: "$960" },
    { name: "Email Signup", clicks: 145, conversions: 8, revenue: "$640" },
    { name: "Video Watch", clicks: 123, conversions: 6, revenue: "$480" }
  ];

  const recentActivity = [
    { action: "New network added", item: "MaxBounty", time: "2 hours ago", type: "network" },
    { action: "High conversion offer", item: "Gaming Survey", time: "4 hours ago", type: "offer" },
    { action: "Traffic spike detected", item: "Organic search", time: "6 hours ago", type: "traffic" },
    { action: "Revenue milestone", item: "$10K monthly", time: "1 day ago", type: "revenue" }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-2 text-gray-600">
            Track your affiliate network performance and insights
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
                  <span className="text-sm text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Networks */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Top Networks</h2>
            <FiGlobe className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {topNetworks.map((network, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{network.name}</p>
                    <p className="text-sm text-gray-600">{network.clicks} clicks</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{network.conversions} conv.</p>
                  <p className="text-sm text-green-600 font-medium">{network.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Offers */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Top Offers</h2>
            <FiGift className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {topOffers.map((offer, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{offer.name}</p>
                    <p className="text-sm text-gray-600">{offer.clicks} clicks</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{offer.conversions} conv.</p>
                  <p className="text-sm text-green-600 font-medium">{offer.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <FiCalendar className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activity.type === 'network' ? 'bg-blue-100' :
                activity.type === 'offer' ? 'bg-green-100' :
                activity.type === 'traffic' ? 'bg-purple-100' : 'bg-orange-100'
              }`}>
                {activity.type === 'network' ? (
                  <FiGlobe className="w-5 h-5 text-blue-600" />
                ) : activity.type === 'offer' ? (
                  <FiGift className="w-5 h-5 text-green-600" />
                ) : activity.type === 'traffic' ? (
                  <FiTrendingUp className="w-5 h-5 text-purple-600" />
                ) : (
                  <FiDollarSign className="w-5 h-5 text-orange-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.item} • {activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">12.4%</p>
              <p className="text-sm text-green-600 mt-1">+2.1% from last month</p>
            </div>
            <FiBarChart className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$45.20</p>
              <p className="text-sm text-green-600 mt-1">+$3.40 from last month</p>
            </div>
            <FiDollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
              <p className="text-2xl font-bold text-gray-900">34.2%</p>
              <p className="text-sm text-red-600 mt-1">+1.8% from last month</p>
            </div>
            <FiTrendingDown className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
} 