import { useState } from "react";
import { Settings, Store, Truck, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    storeName: "Mahalaxmi Automobiles",
    storePhone: "+91 98765 43210",
    storeEmail: "info@mahalaxmiauto.com",
    freeDeliveryThreshold: "2000",
    enableCOD: true,
    enableOnlinePayment: true,
    orderNotifications: true,
    lowStockAlerts: true
  });

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="font-heading text-3xl mb-8">Settings</h1>

      <div className="max-w-2xl space-y-6">
        {/* Store Info */}
        <div className="p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-6">
            <Store className="w-6 h-6 text-primary" />
            <h2 className="font-heading text-xl">Store Information</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Store Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full h-10 px-4 rounded-lg bg-muted border border-border focus:outline-none focus:border-primary"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  value={settings.storePhone}
                  onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                  className="w-full h-10 px-4 rounded-lg bg-muted border border-border focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={settings.storeEmail}
                  onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                  className="w-full h-10 px-4 rounded-lg bg-muted border border-border focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Settings */}
        <div className="p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-6">
            <Truck className="w-6 h-6 text-primary" />
            <h2 className="font-heading text-xl">Delivery Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Free Delivery Threshold (₹)</label>
              <input
                type="number"
                value={settings.freeDeliveryThreshold}
                onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: e.target.value })}
                className="w-full h-10 px-4 rounded-lg bg-muted border border-border focus:outline-none focus:border-primary"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Orders above this amount get free delivery
              </p>
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-primary" />
            <h2 className="font-heading text-xl">Payment Options</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Cash on Delivery</p>
                <p className="text-sm text-muted-foreground">Allow customers to pay on delivery</p>
              </div>
              <Switch
                checked={settings.enableCOD}
                onCheckedChange={(checked) => setSettings({ ...settings, enableCOD: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Online Payment</p>
                <p className="text-sm text-muted-foreground">Accept cards, UPI, and net banking</p>
              </div>
              <Switch
                checked={settings.enableOnlinePayment}
                onCheckedChange={(checked) => setSettings({ ...settings, enableOnlinePayment: checked })}
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-primary" />
            <h2 className="font-heading text-xl">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Order Notifications</p>
                <p className="text-sm text-muted-foreground">Get notified for new orders</p>
              </div>
              <Switch
                checked={settings.orderNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, orderNotifications: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Low Stock Alerts</p>
                <p className="text-sm text-muted-foreground">Get alerts when stock is low</p>
              </div>
              <Switch
                checked={settings.lowStockAlerts}
                onCheckedChange={(checked) => setSettings({ ...settings, lowStockAlerts: checked })}
              />
            </div>
          </div>
        </div>

        <Button variant="default" size="lg" onClick={handleSave}>
          <Settings className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
