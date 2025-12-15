import { useEffect, useState } from "react";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingOrders: number;
  processingOrders: number;
  deliveredOrders: number;
}

const AdminOverview = () => {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    deliveredOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);

      // Fetch products count
      const { count: productsCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      // Fetch orders
      const { data: orders } = await supabase
        .from("orders")
        .select("*");

      // Fetch customers count
      const { count: customersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Fetch recent orders
      const { data: recent } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
      const pendingOrders = orders?.filter(o => o.status === "pending").length || 0;
      const processingOrders = orders?.filter(o => o.status === "processing").length || 0;
      const deliveredOrders = orders?.filter(o => o.status === "delivered").length || 0;

      setStats({
        totalProducts: productsCount || 0,
        totalOrders: orders?.length || 0,
        totalCustomers: customersCount || 0,
        totalRevenue,
        pendingOrders,
        processingOrders,
        deliveredOrders
      });

      setRecentOrders(recent || []);
      setIsLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    { icon: Package, label: "Total Products", value: stats.totalProducts, color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: ShoppingCart, label: "Total Orders", value: stats.totalOrders, color: "text-green-500", bg: "bg-green-500/10" },
    { icon: Users, label: "Customers", value: stats.totalCustomers, color: "text-purple-500", bg: "bg-purple-500/10" },
    { icon: DollarSign, label: "Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, color: "text-primary", bg: "bg-primary/10" },
  ];

  const orderStats = [
    { icon: Clock, label: "Pending", value: stats.pendingOrders, color: "text-yellow-500" },
    { icon: TrendingUp, label: "Processing", value: stats.processingOrders, color: "text-blue-500" },
    { icon: Truck, label: "Shipped", value: 0, color: "text-purple-500" },
    { icon: CheckCircle, label: "Delivered", value: stats.deliveredOrders, color: "text-green-500" },
  ];

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="font-heading text-3xl mb-8">Dashboard Overview</h1>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="p-6 rounded-2xl bg-card border border-border">
            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Order status */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-card border border-border">
          <h2 className="font-heading text-xl mb-4">Order Status</h2>
          <div className="grid grid-cols-2 gap-4">
            {orderStats.map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div className="p-6 rounded-2xl bg-card border border-border">
          <h2 className="font-heading text-xl mb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{order.order_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{Number(order.total).toLocaleString()}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === "delivered" ? "bg-green-500/20 text-green-500" :
                      order.status === "processing" ? "bg-blue-500/20 text-blue-500" :
                      "bg-yellow-500/20 text-yellow-500"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
