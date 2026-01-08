import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface WishlistItem {
  id: string;
  product_id: string;
  product: {
    id: string;
    name: string;
    brand: string;
    price: number;
    original_price: number | null;
    image_url: string | null;
  };
}

export const useWishlist = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: wishlistItems = [], isLoading } = useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("wishlist")
        .select(`
          id,
          product_id,
          product:products (
            id,
            name,
            brand,
            price,
            original_price,
            image_url
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      return (data as unknown as WishlistItem[]) || [];
    },
    enabled: !!user,
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error("Please login to add items to wishlist");

      // Check if item already exists
      const { data: existing } = await supabase
        .from("wishlist")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle();

      if (existing) {
        throw new Error("Item already in wishlist");
      }

      const { error } = await supabase
        .from("wishlist")
        .insert({ user_id: user.id, product_id: productId });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Added to wishlist");
    },
    onError: (error: Error) => {
      if (error.message === "Item already in wishlist") {
        toast.info("Item already in wishlist");
      } else {
        toast.error(error.message);
      }
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) return;
      
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Removed from wishlist");
    },
  });

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item.product_id === productId);
  };

  const toggleWishlist = (productId: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlistMutation.mutate(productId);
    } else {
      addToWishlistMutation.mutate(productId);
    }
  };

  return {
    wishlistItems,
    isLoading,
    addToWishlist: addToWishlistMutation.mutate,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    isInWishlist,
    toggleWishlist,
    wishlistCount: wishlistItems.length,
  };
};
