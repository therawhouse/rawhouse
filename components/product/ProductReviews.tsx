"use client";

import React, { useState, useEffect } from "react";
import { Star, Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface ProductReviewsProps {
  productId: string;
  onOpenAuth?: () => void;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, onOpenAuth }) => {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const json = await res.json();
      if (json.success) {
        setReviews(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please log in to leave a review");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Review submitted successfully");
        setComment("");
        setRating(5);
        fetchReviews(); // refresh reviews
      } else {
        throw new Error(json.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="py-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-raw-gold" /></div>;
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="py-12 border-t border-raw-border mt-12 max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-xl font-serif-luxury text-raw-ivory uppercase tracking-widest">
            Client Reviews
          </h2>
          <div className="flex items-center space-x-2 mt-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= Math.round(Number(averageRating)) ? "text-raw-gold fill-raw-gold" : "text-raw-muted"}`}
                />
              ))}
            </div>
            <span className="text-xs text-raw-muted uppercase tracking-wider">
              {averageRating} out of 5 ({reviews.length} Reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Write Review Form */}
        <div className="lg:col-span-1">
          <div className="bg-raw-card border border-raw-border p-6 sticky top-28">
            <h3 className="text-sm font-serif-luxury text-raw-gold uppercase tracking-widest mb-4">
              Share Your Experience
            </h3>
            {session ? (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-raw-muted uppercase tracking-wider mb-2">Overall Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star className={`w-6 h-6 transition-colors ${star <= rating ? "text-raw-gold fill-raw-gold" : "text-raw-muted hover:text-raw-gold/50"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-raw-muted uppercase tracking-wider mb-2">Your Review</label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-raw-bg border border-raw-border px-4 py-3 outline-none focus:border-raw-gold text-raw-ivory resize-none"
                    placeholder="Tell us about the fit, material, and quality..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-raw-gold text-raw-bg py-3 font-bold uppercase tracking-widest hover:bg-raw-goldHover flex justify-center items-center space-x-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Submit Review</span>
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4 py-4">
                <MessageSquare className="w-8 h-8 text-raw-muted mx-auto" />
                <p className="text-xs text-raw-muted">You must be logged in to leave a review.</p>
                <button 
                  onClick={onOpenAuth}
                  className="inline-block border border-raw-border text-raw-ivory px-6 py-2 text-xs uppercase tracking-widest hover:border-raw-gold hover:text-raw-gold"
                >
                  Log In
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-12 border border-raw-border/50 text-raw-muted text-xs uppercase tracking-widest">
              Be the first to review this atelier piece.
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-raw-border/50 pb-6 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-raw-ivory font-serif-luxury text-sm">{review.user?.name || review.user?.firstName || "Verified Client"}</p>
                    <p className="text-[10px] text-raw-muted uppercase tracking-wider mt-1">
                      {new Date(review.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${star <= review.rating ? "text-raw-gold fill-raw-gold" : "text-raw-muted"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-raw-muted leading-relaxed mt-3">
                  "{review.comment}"
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
