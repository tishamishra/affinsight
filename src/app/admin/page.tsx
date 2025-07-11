'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { FiCheck, FiX, FiTrash2, FiRefreshCw, FiStar } from 'react-icons/fi';

const supabaseUrl = 'https://hvhaavxjbujkpvbvftkj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2aGFhdnhqYnVqa3B2YnZmdGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MDIxNTksImV4cCI6MjA2NzM3ODE1OX0.Rtyf3tRc8cDiXtuf23BnvGrBw0cbJ4QOTBhm93Typ40';
const supabase = createClient(supabaseUrl, supabaseKey);

interface Review {
  id: string;
  network_slug: string;
  overall_rating: number;
  offers_rating: number;
  payout_rating: number;
  tracking_rating: number;
  support_rating: number;
  review_text: string;
  screenshot_url?: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function AdminDashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setReviews(data as Review[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const updateReviewStatus = async (id: string, status: 'approved' | 'rejected') => {
    await supabase.from('reviews').update({ status }).eq('id', id);
    fetchReviews();
  };

  const deleteReview = async (id: string) => {
    await supabase.from('reviews').delete().eq('id', id);
    fetchReviews();
  };

  const filteredReviews = filter === 'all' ? reviews : reviews.filter(r => r.status === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50">
      <div className="max-w-5xl mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-800">Admin Review Dashboard</h1>
            <p className="text-gray-600">Moderate, approve, or reject user reviews</p>
          </div>
          <button
            onClick={() => { setRefreshing(true); fetchReviews().then(() => setRefreshing(false)); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
            disabled={refreshing}
          >
            <FiRefreshCw className={refreshing ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
        <div className="flex gap-2 mb-6">
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-full font-semibold border transition-all ${filter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== 'all' && (
                <span className="ml-2 text-xs font-bold">({reviews.filter(r => r.status === f).length})</span>
              )}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center text-gray-500 py-20 text-lg">No reviews found for this filter.</div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Network</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-blue-800">{review.network_slug}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{review.name}<br /><span className="text-xs text-gray-400">{review.email}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-bold text-yellow-500">
                        {review.overall_rating} <FiStar className="inline-block" />
                      </span>
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
                      <div className="flex gap-2">
                        {review.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateReviewStatus(review.id, 'approved')}
                              className="p-2 rounded bg-green-100 text-green-700 hover:bg-green-200 transition"
                              title="Approve"
                            >
                              <FiCheck />
                            </button>
                            <button
                              onClick={() => updateReviewStatus(review.id, 'rejected')}
                              className="p-2 rounded bg-red-100 text-red-700 hover:bg-red-200 transition"
                              title="Reject"
                            >
                              <FiX />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteReview(review.id)}
                          className="p-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 