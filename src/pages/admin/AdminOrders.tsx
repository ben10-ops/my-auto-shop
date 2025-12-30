import { useEffect, useState } from "react";
import { Search, Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuditLog } from "@/hooks/useAuditLog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  payment_method: string;
  payment_status: string;
  shipping_address: any;
  created_at: string;
  user_id: string;
}

const statusOptions = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const { logAction } = useAuditLog();

  const fetchOrders = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch orders");
    } else {
      setOrders(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const viewOrderDetails = async (order: Order) => {
    setSelectedOrder(order);
    
    const { data } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order.id);
    
    setOrderItems(data || []);
  };

  const sendOrderStatusEmail = async (order: Order, newStatus: string) => {
    try {
      // Get customer email from profile
      if (!order.user_id) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("email, full_name")
        .eq("user_id", order.user_id)
        .maybeSingle();

      if (!profile?.email) {
        console.log("No email found for customer");
        return;
      }

      const { error } = await supabase.functions.invoke("send-order-status-email", {
        body: {
          orderId: order.id,
          newStatus,
          customerEmail: profile.email,
          customerName: profile.full_name || "Customer",
          orderNumber: order.order_number,
        },
      });

      if (error) {
        console.error("Failed to send email notification:", error);
      } else {
        console.log("Email notification sent successfully");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const order = orders.find((o) => o.id === orderId);
    const oldStatus = order?.status;

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      toast.error("Failed to update order status");
    } else {
      await logAction({
        actionType: "STATUS_UPDATE",
        tableName: "orders",
        recordId: orderId,
        oldValues: { status: oldStatus },
        newValues: { status: newStatus },
        description: `Order ${order?.order_number} status changed: ${oldStatus} → ${newStatus}`,
      });

      // Send email notification
      if (order) {
        sendOrderStatusEmail(order, newStatus);
      }

      toast.success("Order status updated");
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    }
  };

  const filteredOrders = orders.filter(o => 
    o.order_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-500/20 text-green-500";
      case "shipped": return "bg-purple-500/20 text-purple-500";
      case "processing": return "bg-blue-500/20 text-blue-500";
      case "confirmed": return "bg-cyan-500/20 text-cyan-500";
      case "cancelled": return "bg-red-500/20 text-red-500";
      default: return "bg-yellow-500/20 text-yellow-500";
    }
  };

  return (
    <div className="p-6">
      <h1 className="font-heading text-2xl mb-6">Orders</h1>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by order number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-lg bg-card border border-border text-sm focus:outline-none focus:border-primary"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-semibold mb-1">No Orders Yet</h3>
          <p className="text-sm text-muted-foreground">Orders will appear here.</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-3 font-medium">Order</th>
                  <th className="text-left p-3 font-medium hidden sm:table-cell">Date</th>
                  <th className="text-left p-3 font-medium">Amount</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-right p-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0">
                    <td className="p-3">
                      <p className="font-medium">{order.order_number}</p>
                      <p className="text-xs text-muted-foreground sm:hidden">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-3 text-muted-foreground hidden sm:table-cell">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 font-medium">
                      ₹{Number(order.total).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusColor(order.status)}`}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="icon" onClick={() => viewOrderDetails(order)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order details dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order {selectedOrder?.order_number}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Total</p>
                  <p className="font-bold">₹{Number(selectedOrder.total).toLocaleString()}</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Shipping Address</p>
                <p className="font-medium text-sm">{selectedOrder.shipping_address?.full_name}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedOrder.shipping_address?.address_line1}, {selectedOrder.shipping_address?.city} - {selectedOrder.shipping_address?.pincode}
                </p>
              </div>

              <div>
                <p className="font-medium text-sm mb-2">Items</p>
                <div className="space-y-2">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <div className="w-10 h-10 rounded bg-muted overflow-hidden flex-shrink-0">
                        {item.product_image && (
                          <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.product_name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
