import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";

interface ShippingAddress {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
}

interface OrderItem {
  product_id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
}

interface CreateOrderParams {
  items: OrderItem[];
  shipping_address: ShippingAddress;
  payment_method: string;
  subtotal: number;
  delivery_charge: number;
  discount: number;
  total: number;
  notes?: string;
}

export const useOrders = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const createOrderMutation = useMutation({
    mutationFn: async (params: CreateOrderParams) => {
      if (!user) throw new Error("Please login to place an order");

      // Generate order number
      const { data: orderNumber, error: genError } = await supabase
        .rpc("generate_order_number");
      
      if (genError) throw genError;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([{
          user_id: user.id,
          order_number: orderNumber,
          shipping_address: params.shipping_address as unknown as Json,
          payment_method: params.payment_method,
          subtotal: params.subtotal,
          delivery_charge: params.delivery_charge,
          discount: params.discount,
          total: params.total,
          notes: params.notes,
          status: "pending",
          payment_status: params.payment_method === "cod" ? "pending" : "paid",
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = params.items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_image: item.product_image,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart after successful order
      await supabase.from("cart_items").delete().eq("user_id", user.id);

      return order;
    },
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(`Order placed! Order #${order.order_number}`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return {
    createOrder: createOrderMutation.mutateAsync,
    isCreating: createOrderMutation.isPending,
    orders,
    isLoading,
  };
};
