import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  created_at: string;
  user_name?: string;
}

export const useProductReviews = (productId: string | undefined) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [userReview, setUserReview] = useState<ProductReview | null>(null);

  const fetchReviews = async () => {
    if (!productId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("product_reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch user names for reviews
      const reviewsWithNames = await Promise.all(
        (data || []).map(async (review) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("user_id", review.user_id)
            .single();
          
          return {
            ...review,
            user_name: profile?.full_name || "Anonymous",
          };
        })
      );

      setReviews(reviewsWithNames);
      
      // Calculate average rating
      if (reviewsWithNames.length > 0) {
        const avg = reviewsWithNames.reduce((sum, r) => sum + r.rating, 0) / reviewsWithNames.length;
        setAverageRating(Math.round(avg * 10) / 10);
      }

      // Find user's review if logged in
      if (user) {
        const existing = reviewsWithNames.find((r) => r.user_id === user.id);
        setUserReview(existing || null);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, user]);

  const submitReview = async (rating: number, title: string, comment: string) => {
    if (!user || !productId) {
      toast.error("Please log in to submit a review");
      return false;
    }

    try {
      if (userReview) {
        // Update existing review
        const { error } = await supabase
          .from("product_reviews")
          .update({ rating, title, comment })
          .eq("id", userReview.id);

        if (error) throw error;
        toast.success("Review updated successfully");
      } else {
        // Create new review
        const { error } = await supabase
          .from("product_reviews")
          .insert({
            product_id: productId,
            user_id: user.id,
            rating,
            title,
            comment,
          });

        if (error) throw error;
        toast.success("Review submitted successfully");
      }

      await fetchReviews();
      return true;
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
      return false;
    }
  };

  const deleteReview = async () => {
    if (!userReview) return false;

    try {
      const { error } = await supabase
        .from("product_reviews")
        .delete()
        .eq("id", userReview.id);

      if (error) throw error;
      toast.success("Review deleted");
      await fetchReviews();
      return true;
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
      return false;
    }
  };

  return {
    reviews,
    isLoading,
    averageRating,
    reviewCount: reviews.length,
    userReview,
    submitReview,
    deleteReview,
  };
};
