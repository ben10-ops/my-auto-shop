import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Package, Truck, CheckCircle, Clock, Search, ChevronRight, 
  MapPin, Phone, Calendar, CreditCard, AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string;
  subtotal: number;
  delivery_charge: number;
  discount: number;
  total: number;
  shipping_address: ShippingAddress;
  created_at: string;
  updated_at: string;
  notes: string | null;
  order_items: OrderItem[];
}

const statusSteps = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

const OrderTracking = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("order") || "");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrder = async (orderNum: string) => {
    if (!orderNum.trim()) {
      setError("Please enter an order number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .eq("order_number", orderNum.toUpperCase())
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!data) {
        setError("Order not found. Please check the order number.");
        setOrder(null);
      } else {
        setOrder({
          ...data,
          shipping_address: data.shipping_address as unknown as ShippingAddress,
        });
      }
    } catch (err) {
      setError("Failed to fetch order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Real-time subscription for order updates
  useEffect(() => {
    if (!order) return;

    const channel = supabase
      .channel(`order-${order.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${order.id}`,
        },
        (payload) => {
          setOrder((prev) => prev ? {
            ...prev,
            ...payload.new,
            shipping_address: payload.new.shipping_address as unknown as ShippingAddress,
          } : null);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [order?.id]);

  // Auto-fetch if order number is in URL
  useEffect(() => {
    const orderParam = searchParams.get("order");
    if (orderParam) {
      setOrderNumber(orderParam);
      fetchOrder(orderParam);
    }
  }, [searchParams]);

  const getStatusIndex = (status: string) => {
    const index = statusSteps.findIndex((s) => s.key === status);
    return index === -1 ? 0 : index;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "text-green-500";
      case "shipped": return "text-purple-500";
      case "processing": return "text-blue-500";
      case "cancelled": return "text-destructive";
      default: return "text-yellow-500";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">Track Order</span>
        </nav>

        <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl mb-6 md:mb-8">TRACK YOUR ORDER</h1>

        {/* Search Box */}
        <div className="max-w-xl mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Enter order number (e.g., MA20241219-1234)"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchOrder(orderNumber)}
                className="h-12"
              />
            </div>
            <Button 
              onClick={() => fetchOrder(orderNumber)} 
              disabled={loading}
              className="h-12 px-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Track
                </>
              )}
            </Button>
          </div>
          {error && (
            <div className="flex items-center gap-2 mt-3 text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        {/* Order Details */}
        {order && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Timeline */}
              <div className="p-4 md:p-6 rounded-2xl bg-card border border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <h2 className="font-heading text-xl md:text-2xl">{order.order_number}</h2>
                    <p className="text-sm text-muted-foreground">
                      Placed on {new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span className={`text-sm font-semibold uppercase ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {order.status !== "cancelled" ? (
                  <div className="relative">
                    {/* Progress Line */}
                    <div className="hidden sm:block absolute top-6 left-6 right-6 h-1 bg-muted rounded-full">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${(getStatusIndex(order.status) / (statusSteps.length - 1)) * 100}%` }}
                      />
                    </div>

                    {/* Steps - Horizontal on desktop, vertical on mobile */}
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-0">
                      {statusSteps.map((step, index) => {
                        const isCompleted = index <= getStatusIndex(order.status);
                        const isCurrent = index === getStatusIndex(order.status);
                        const Icon = step.icon;

                        return (
                          <div key={step.key} className="flex sm:flex-col items-center gap-3 sm:gap-2">
                            <div className={`
                              relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all
                              ${isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}
                              ${isCurrent ? "ring-4 ring-primary/30" : ""}
                            `}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className={`text-sm font-medium ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-destructive">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                    <p className="font-medium">Order Cancelled</p>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="p-4 md:p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-heading text-lg md:text-xl mb-4">Order Items ({order.order_items.length})</h3>
                <div className="space-y-3">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/50">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                        {item.product_image ? (
                          <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.product_name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold whitespace-nowrap">₹{Number(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Shipping Address */}
              <div className="p-4 md:p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-heading text-lg mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Shipping Address
                </h3>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{order.shipping_address.full_name}</p>
                  <p className="text-muted-foreground">{order.shipping_address.address_line1}</p>
                  {order.shipping_address.address_line2 && (
                    <p className="text-muted-foreground">{order.shipping_address.address_line2}</p>
                  )}
                  <p className="text-muted-foreground">
                    {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                  </p>
                  <p className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    {order.shipping_address.phone}
                  </p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="p-4 md:p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-heading text-lg mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Payment Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Method</span>
                    <span className="font-medium uppercase">{order.payment_method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className={`font-medium capitalize ${
                      order.payment_status === "paid" ? "text-green-500" : "text-yellow-500"
                    }`}>
                      {order.payment_status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-4 md:p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-heading text-lg mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Order Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{Number(order.subtotal).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span>₹{Number(order.delivery_charge).toLocaleString()}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>Discount</span>
                      <span>-₹{Number(order.discount).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-3 flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span>₹{Number(order.total).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Order State */}
        {!order && !loading && !error && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="font-heading text-2xl mb-2">Track Your Order</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Enter your order number above to see real-time status updates and delivery information.
            </p>
            {user && (
              <Button asChild variant="outline">
                <Link to="/account/orders">View All Orders</Link>
              </Button>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default OrderTracking;
