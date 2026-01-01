import { useState } from "react";
import { Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useProductReviews } from "@/hooks/useProductReviews";
import { Link } from "react-router-dom";

interface ProductReviewsProps {
  productId: string;
}

export const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { user } = useAuth();
  const { reviews, isLoading, averageRating, reviewCount, userReview, submitReview, deleteReview } = useProductReviews(productId);
  
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(userReview?.rating || 5);
  const [title, setTitle] = useState(userReview?.title || "");
  const [comment, setComment] = useState(userReview?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await submitReview(rating, title, comment);
    if (success) {
      setShowForm(false);
      setTitle("");
      setComment("");
      setRating(5);
    }
    setIsSubmitting(false);
  };

  const handleEditClick = () => {
    if (userReview) {
      setRating(userReview.rating);
      setTitle(userReview.title || "");
      setComment(userReview.comment || "");
    }
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete your review?")) {
      await deleteReview();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Rating Summary */}
      <div className="flex items-center gap-8 mb-8">
        <div className="text-center">
          <div className="font-heading text-5xl text-primary">
            {reviewCount > 0 ? averageRating : "—"}
          </div>
          <div className="flex items-center gap-1 my-2 justify-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(averageRating)
                    ? "fill-primary text-primary"
                    : "text-muted"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{reviewCount} reviews</p>
        </div>
        
        <div className="flex-1">
          {user ? (
            !showForm && (
              <Button onClick={handleEditClick} variant="outline">
                {userReview ? "Edit Your Review" : "Write a Review"}
              </Button>
            )
          ) : (
            <p className="text-muted-foreground">
              <Link to="/login" className="text-primary hover:underline">Log in</Link> to write a review
            </p>
          )}
        </div>
      </div>

      {/* Review Form */}
      {showForm && user && (
        <form onSubmit={handleSubmit} className="p-6 rounded-xl bg-card border border-border mb-8">
          <h4 className="font-heading text-lg mb-4">
            {userReview ? "Edit Your Review" : "Write a Review"}
          </h4>
          
          {/* Star Rating */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-primary text-primary"
                        : "text-muted"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Title (optional)</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              maxLength={100}
            />
          </div>

          {/* Comment */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Your Review</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience with this product..."
              rows={4}
              maxLength={1000}
            />
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : userReview ? "Update Review" : "Submit Review"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-heading text-primary">
                      {review.user_name?.[0]?.toUpperCase() || "A"}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium">{review.user_name}</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.rating ? "fill-primary text-primary" : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                {user?.id === review.user_id && (
                  <Button variant="ghost" size="icon" onClick={handleDelete} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              {review.title && (
                <h5 className="font-medium mb-2">{review.title}</h5>
              )}
              {review.comment && (
                <p className="text-muted-foreground">{review.comment}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
