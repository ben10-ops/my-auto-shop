import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

interface DeliveryArea {
  id: string;
  pincode: string;
  area_name: string;
  city: string;
  delivery_charge: number;
  estimated_days: number;
  is_active: boolean;
}

const AdminDeliveryAreas = () => {
  const [areas, setAreas] = useState<DeliveryArea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<DeliveryArea | null>(null);
  const [formData, setFormData] = useState({
    pincode: "",
    area_name: "",
    city: "",
    delivery_charge: "",
    estimated_days: "2"
  });

  const fetchAreas = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("delivery_areas")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch delivery areas");
    } else {
      setAreas(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const areaData = {
      pincode: formData.pincode,
      area_name: formData.area_name,
      city: formData.city,
      delivery_charge: parseFloat(formData.delivery_charge) || 0,
      estimated_days: parseInt(formData.estimated_days) || 2
    };

    if (editingArea) {
      const { error } = await supabase
        .from("delivery_areas")
        .update(areaData)
        .eq("id", editingArea.id);

      if (error) {
        toast.error("Failed to update delivery area");
      } else {
        toast.success("Delivery area updated");
        fetchAreas();
      }
    } else {
      const { error } = await supabase
        .from("delivery_areas")
        .insert([areaData]);

      if (error) {
        if (error.message.includes("duplicate")) {
          toast.error("This pincode already exists");
        } else {
          toast.error("Failed to add delivery area");
        }
      } else {
        toast.success("Delivery area added");
        fetchAreas();
      }
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (area: DeliveryArea) => {
    setEditingArea(area);
    setFormData({
      pincode: area.pincode,
      area_name: area.area_name,
      city: area.city,
      delivery_charge: area.delivery_charge.toString(),
      estimated_days: area.estimated_days.toString()
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this delivery area?")) return;

    const { error } = await supabase
      .from("delivery_areas")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete delivery area");
    } else {
      toast.success("Delivery area deleted");
      fetchAreas();
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from("delivery_areas")
      .update({ is_active: isActive })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      fetchAreas();
    }
  };

  const resetForm = () => {
    setEditingArea(null);
    setFormData({
      pincode: "",
      area_name: "",
      city: "",
      delivery_charge: "",
      estimated_days: "2"
    });
  };

  const filteredAreas = areas.filter(a => 
    a.pincode.includes(searchQuery) ||
    a.area_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="font-heading text-3xl">Delivery Areas</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button variant="default">
              <Plus className="w-4 h-4 mr-2" />
              Add Area
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingArea ? "Edit Delivery Area" : "Add New Delivery Area"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">Pincode</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                  required
                  maxLength={6}
                  className="w-full h-10 px-4 rounded-lg bg-muted border border-border focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Area Name</label>
                <input
                  type="text"
                  value={formData.area_name}
                  onChange={(e) => setFormData({ ...formData, area_name: e.target.value })}
                  required
                  className="w-full h-10 px-4 rounded-lg bg-muted border border-border focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  className="w-full h-10 px-4 rounded-lg bg-muted border border-border focus:outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Delivery Charge (₹)</label>
                  <input
                    type="number"
                    value={formData.delivery_charge}
                    onChange={(e) => setFormData({ ...formData, delivery_charge: e.target.value })}
                    required
                    min="0"
                    className="w-full h-10 px-4 rounded-lg bg-muted border border-border focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Estimated Days</label>
                  <input
                    type="number"
                    value={formData.estimated_days}
                    onChange={(e) => setFormData({ ...formData, estimated_days: e.target.value })}
                    required
                    min="1"
                    className="w-full h-10 px-4 rounded-lg bg-muted border border-border focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="default">
                  {editingArea ? "Update Area" : "Add Area"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by pincode, area or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 pl-12 pr-4 rounded-lg bg-card border border-border focus:outline-none focus:border-primary"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : filteredAreas.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Delivery Areas</h3>
          <p className="text-muted-foreground">Add delivery areas to enable local delivery.</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-medium">Pincode</th>
                  <th className="text-left p-4 font-medium">Area</th>
                  <th className="text-left p-4 font-medium">City</th>
                  <th className="text-left p-4 font-medium">Charge</th>
                  <th className="text-left p-4 font-medium">Days</th>
                  <th className="text-left p-4 font-medium">Active</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAreas.map((area) => (
                  <tr key={area.id} className="border-b border-border last:border-0">
                    <td className="p-4 font-mono font-semibold">{area.pincode}</td>
                    <td className="p-4">{area.area_name}</td>
                    <td className="p-4 text-muted-foreground">{area.city}</td>
                    <td className="p-4">
                      {area.delivery_charge === 0 ? (
                        <span className="text-green-500">FREE</span>
                      ) : (
                        `₹${area.delivery_charge}`
                      )}
                    </td>
                    <td className="p-4">{area.estimated_days}</td>
                    <td className="p-4">
                      <Switch
                        checked={area.is_active}
                        onCheckedChange={(checked) => toggleActive(area.id, checked)}
                      />
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(area)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(area.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDeliveryAreas;
