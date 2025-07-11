'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically create Supabase client to avoid SSR issues
const createSupabaseClient = () => {
  const supabaseUrl = 'https://hvhaavxjbujkpvbvftkj.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2aGFhdnhqYnVqa3B2YnZmdGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MDIxNTksImV4cCI6MjA2NzM3ODE1OX0.Rtyf3tRc8cDiXtuf23BnvGrBw0cbJ4QOTBhm93Typ40';
  
  return createClient(supabaseUrl, supabaseKey);
};

interface Review {
  id: string;
  network_id: string;
  network_name: string;
  user_name: string;
  rating: number;
  overall_rating: number;
  ease_of_use: number;
  support_quality: number;
  payment_speed: number;
  offer_quality: number;
  review_text: string;
  payment_screenshot?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    // Initialize Supabase client on client side only
    try {
      const client = createSupabaseClient();
      setSupabase(client);
      checkUser(client);
      fetchReviews(client);
    } catch (error) {
      console.error('Failed to initialize Supabase:', error);
      setLoading(false);
    }
  }, []);

  const checkUser = async (client: any) => {
    try {
      const { data: { user } } = await client.auth.getUser();
      if (user) {
        console.log('User found:', user.email);
        
        // Check raw_user_meta_data for admin role
        const userMetaData = user.user_metadata;
        if (userMetaData?.role === 'admin') {
          console.log('Admin role found in user_metadata');
          setUser(user);
          return;
        }

        // Check user_roles table for admin role (skip profiles table)
        const { data: userRoles, error: userRolesError } = await client
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id)
          .eq('user_role', 'admin') // <-- use 'user_role' column
          .single();
        
        if (userRolesError) {
          console.log('No admin role in user_roles table:', userRolesError.message);
        } else if (userRoles) {
          console.log('Admin role found in user_roles table');
          setUser(user);
          return;
        }

        // If no admin role found, deny access
        console.log('No admin role found, denying access');
        alert('Access denied. Admin privileges required.');
        window.location.href = '/';
      } else {
        console.log('No user found, redirecting to login');
        window.location.href = '/admin/login';
      }
    } catch (error) {
      console.error('Error checking user:', error);
      window.location.href = '/admin/login';
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (client: any) => {
    try {
      const { data, error } = await client
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
      } else {
        setReviews(data || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const updateReviewStatus = async (reviewId: string, status: 'approved' | 'rejected') => {
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status })
        .eq('id', reviewId);

      if (error) {
        console.error('Error updating review:', error);
        alert('Error updating review status');
      } else {
        fetchReviews(supabase);
        alert(`Review ${status} successfully`);
      }
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Error updating review status');
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!supabase) return;
    
    if (confirm('Are you sure you want to delete this review?')) {
      try {
        const { error } = await supabase
          .from('reviews')
          .delete()
          .eq('id', reviewId);

        if (error) {
          console.error('Error deleting review:', error);
          alert('Error deleting review');
        } else {
          fetchReviews(supabase);
          alert('Review deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Error deleting review');
      }
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    
    try {
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    return review.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage reviews and network data</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.email}
              </span>
              <button
                onClick={signOut}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Reviews</h3>
            <p className="text-3xl font-bold text-blue-600">{reviews.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {reviews.filter(r => r.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Approved</h3>
            <p className="text-3xl font-bold text-green-600">
              {reviews.filter(r => r.status === 'approved').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Rejected</h3>
            <p className="text-3xl font-bold text-red-600">
              {reviews.filter(r => r.status === 'rejected').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex space-x-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({reviews.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-md ${
                  filter === 'pending'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending ({reviews.filter(r => r.status === 'pending').length})
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-4 py-2 rounded-md ${
                  filter === 'approved'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Approved ({reviews.filter(r => r.status === 'approved').length})
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-4 py-2 rounded-md ${
                  filter === 'rejected'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rejected ({reviews.filter(r => r.status === 'rejected').length})
              </button>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Reviews</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Network
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReviews.map((review) => (
                  <tr key={review.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {review.network_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {review.user_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">
                          {review.overall_rating}/5
                        </span>
                        <div className="ml-2 flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.overall_rating
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        review.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : review.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {review.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {review.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateReviewStatus(review.id, 'approved')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateReviewStatus(review.id, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteReview(review.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 