"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { FiStar, FiImage } from "react-icons/fi";

interface UserReviewsProps {
  networkSlug: string;
}

interface Review {
  id: string;
  overall_rating: number;
  offers_rating: number;
  payout_rating: number;
  tracking_rating: number;
  support_rating: number;
  review_text: string;
  screenshot_url?: string;
  name: string;
  created_at: string;
}

export default function UserReviews({ networkSlug }: UserReviewsProps) {
  const supabase = createClientComponentClient();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      setLoading(true);
      const { data, error } = await supabase
        .from("reviews")
        .select("id, overall_rating, offers_rating, payout_rating, tracking_rating, support_rating, review_text, screenshot_url, name, created_at")
        .eq("network_slug", networkSlug)
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (!error && data) setReviews(data as Review[]);
      setLoading(false);
    }
    if (networkSlug) fetchReviews();
  }, [networkSlug]);

  // Calculate averages
  const avg = (field: keyof Review) =>
    reviews.length ? (reviews.reduce((sum, r) => sum + (r[field] as number), 0) / reviews.length).toFixed(1) : "-";

  return (
    <section className="max-w-4xl mx-auto mt-12 mb-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">User Reviews</h2>
      {loading ? (
        <div className="text-gray-500">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-gray-500">No reviews yet. Be the first to write one!</div>
      ) : (
        <>
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-blue-600">{avg("overall_rating")}</span>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => (
                  <FiStar key={i} className={`w-5 h-5 ${i <= Math.round(Number(avg("overall_rating"))) ? "text-blue-400 fill-current" : "text-gray-300"}`} />
                ))}
              </div>
              <span className="text-xs text-gray-500 mt-1">Avg. Rating</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-gray-700">{reviews.length}</span>
              <span className="text-xs text-gray-500 mt-1">Reviews</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-gray-700">{avg("offers_rating")}</span>
              <span className="text-xs text-gray-500 mt-1">Offers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-gray-700">{avg("payout_rating")}</span>
              <span className="text-xs text-gray-500 mt-1">Payout</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-gray-700">{avg("tracking_rating")}</span>
              <span className="text-xs text-gray-500 mt-1">Tracking</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-gray-700">{avg("support_rating")}</span>
              <span className="text-xs text-gray-500 mt-1">Support</span>
            </div>
          </div>
          <div className="space-y-8">
            {reviews.map(r => (
              <div key={r.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <FiStar key={i} className={`w-4 h-4 ${i <= r.overall_rating ? "text-blue-400 fill-current" : "text-gray-300"}`} />
                    ))}
                  </div>
                  <span className="text-gray-700 font-semibold">{r.name}</span>
                  <span className="text-gray-400 text-xs">{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                <div className="text-gray-700 mb-2">{r.review_text}</div>
                <div className="flex gap-4 text-xs text-gray-500 mb-2">
                  <span>Offers: <b>{r.offers_rating}</b></span>
                  <span>Payout: <b>{r.payout_rating}</b></span>
                  <span>Tracking: <b>{r.tracking_rating}</b></span>
                  <span>Support: <b>{r.support_rating}</b></span>
                </div>
                {r.screenshot_url && (
                  <a href={r.screenshot_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline mt-2">
                    <FiImage className="w-4 h-4" /> View Screenshot
                  </a>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
} 