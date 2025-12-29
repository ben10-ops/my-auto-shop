import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { User, Package, MapPin, LogOut, Settings, ChevronRight, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { TwoFactorSetup } from "@/components/account/TwoFactorSetup";

interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
}

const Account = () => {
  const { user, isLoading, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const check2FAStatus = async () => {
    const { data } = await supabase.auth.mfa.listFactors();
    const verifiedFactor = data?.totp?.find((f) => f.status === "verified");
    setIs2FAEnabled(!!verifiedFactor);
  };

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      // Fetch profile
      supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => setProfile(data));

      // Fetch orders
      supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5)
        .then(({ data }) => setOrders(data || []));

      // Check 2FA status
      check2FAStatus();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-500/20 text-green-500";
      case "shipped": return "bg-purple-500/20 text-purple-500";
      case "processing": return "bg-blue-500/20 text-blue-500";
      default: return "bg-yellow-500/20 text-yellow-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">My Account</span>
        </nav>

        <h1 className="font-heading text-4xl md:text-5xl mb-8">MY ACCOUNT</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="font-semibold text-lg">{profile?.full_name || "User"}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <Link
                  to="/account"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground"
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
                <Link
                  to="/account/orders"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                >
                  <Package className="w-5 h-5" />
                  <span>Orders</span>
                </Link>
                <Link
                  to="/account/addresses"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Addresses</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary hover:bg-muted transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                <button
                  onClick={signOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-muted transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile info */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-heading text-xl mb-4">Profile Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Full Name</label>
                  <p className="font-medium">{profile?.full_name || "-"}</p>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Email</label>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Phone</label>
                  <p className="font-medium">{profile?.phone || "-"}</p>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Member Since</label>
                  <p className="font-medium">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Security - 2FA */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="font-heading text-xl">Security</h3>
              </div>
              <TwoFactorSetup isEnabled={is2FAEnabled} onUpdate={check2FAStatus} />
            </div>

            {/* Recent orders */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-xl">Recent Orders</h3>
                <Link to="/account/orders" className="text-sm text-primary hover:underline">
                  View All
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No orders yet</p>
                  <Button asChild variant="outline" className="mt-4">
                    <Link to="/products">Start Shopping</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{Number(order.total).toLocaleString()}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
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
      </main>
      <Footer />
    </div>
  );
};

export default Account;
