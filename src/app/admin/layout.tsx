"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  FiGlobe, 
  FiGift, 
  FiSettings, 
  FiUsers, 
  FiLogOut, 
  FiHome,
  FiPlus,
  FiMenu,
  FiX
} from "react-icons/fi";
import { getCurrentUser, isAdminUser, signOut } from "@/lib/auth";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user, error } = await getCurrentUser();
        
        if (error || !user) {
          console.log('No user found, redirecting to login');
          router.push('/auth/login');
          return;
        }

        console.log('User found:', user.email);
        setUserEmail(user.email || '');

        const adminStatus = await isAdminUser(user.email || '');
        console.log('Is admin:', adminStatus);
        setIsAdmin(adminStatus);
        
        if (!adminStatus) {
          console.log('User is not admin, redirecting to unauthorized');
          router.push('/auth/unauthorized');
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut();
      document.cookie = 'user-email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: FiHome },
    { name: 'Networks', href: '/admin/networks', icon: FiGlobe },
    { name: 'Offers', href: '/admin/offers', icon: FiGift },
    ...(isAdmin ? [{ name: 'Settings', href: '/admin/settings', icon: FiSettings }] : [])
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUsers className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please log in to access the admin panel</p>
            <button 
              onClick={() => router.push('/auth/login')}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <FiGlobe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Affinsight Admin</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* User Menu and Actions */}
            <div className="flex items-center space-x-4">
              {/* Quick Action Buttons */}
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  href="/admin/networks/add"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <FiPlus className="w-4 h-4 mr-1" />
                  Add Network
                </Link>
                <Link
                  href="/admin/offers/add"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FiPlus className="w-4 h-4 mr-1" />
                  Add Offer
                </Link>
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">{userEmail}</p>
                  <p className="text-xs text-gray-500">{isAdmin ? 'Administrator' : 'User'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? (
                  <FiX className="w-5 h-5" />
                ) : (
                  <FiMenu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Quick Actions */}
              <div className="pt-2 border-t border-gray-200">
                <Link
                  href="/admin/networks/add"
                  className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Add Network</span>
                </Link>
                <Link
                  href="/admin/offers/add"
                  className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors mt-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Add Offer</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content - Full Width */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
} 