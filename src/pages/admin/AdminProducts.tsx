import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuditLog } from "@/hooks/useAuditLog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  category: string;
  brand: string;
  stock: number;
  is_active: boolean;
  image_url: string | null;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { logAction } = useAuditLog();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    original_price: "",
    category: "",
    brand: "",
    stock: "",
    image_url: "",
    description: ""
  });

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch products");
    } else {
      setProducts(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      category: formData.category,
      brand: formData.brand,
      stock: parseInt(formData.stock) || 0,
      image_url: formData.image_url || null,
      description: formData.description || null
    };

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProduct.id);

      if (error) {
        toast.error("Failed to update product");
      } else {
        await logAction({
          actionType: "UPDATE",
          tableName: "products",
          recordId: editingProduct.id,
          oldValues: { name: editingProduct.name, price: editingProduct.price },
          newValues: productData,
          description: `Updated product: ${productData.name}`,
        });
        toast.success("Product updated successfully");
        fetchProducts();
      }
    } else {
      const { data, error } = await supabase
        .from("products")
        .insert([productData])
        .select()
        .single();

      if (error) {
        toast.error("Failed to add product");
      } else {
        await logAction({
          actionType: "CREATE",
          tableName: "products",
          recordId: data?.id,
          newValues: productData,
          description: `Created product: ${productData.name}`,
        });
        toast.success("Product added successfully");
        fetchProducts();
      }
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      original_price: product.original_price?.toString() || "",
      category: product.category,
      brand: product.brand,
      stock: product.stock.toString(),
      image_url: product.image_url || "",
      description: ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const productToDelete = products.find((p) => p.id === id);
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete product");
    } else {
      await logAction({
        actionType: "DELETE",
        tableName: "products",
        recordId: id,
        oldValues: productToDelete,
        description: `Deleted product: ${productToDelete?.name}`,
      });
      toast.success("Product deleted");
      fetchProducts();
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "",
      original_price: "",
      category: "",
      brand: "",
      stock: "",
      image_url: "",
      description: ""
    });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ["Engine Parts", "Brake System", "Suspension & Steering", "Electrical Parts", "Tires & Wheels", "Accessories"];

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="font-heading text-3xl">Products</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button variant="default">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full h-10 px-4 rounded-lg bg-muted border border-border focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    required
                    className="w-full h-10 px-4 rounded-lg bg-muted border border-border focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full h-10 px-4 rounded-lg bg-muted border border-border focus:outline-none focus:border-primary"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full h-10 px-4 rounded-lg bg-muted border border-border focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Original Price (₹)</label>
                  <input
                    type="number"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    className="w-full h-10 px-4 rounded-lg bg-muted border border-border focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                    className="w-full h-10 px-4 rounded-lg bg-muted border border-border focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full h-10 px-4 rounded-lg bg-muted border border-border focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:outline-none focus:border-primary resize-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="default">
                  {editingProduct ? "Update Product" : "Add Product"}
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
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 pl-12 pr-4 rounded-lg bg-card border border-border focus:outline-none focus:border-primary"
        />
      </div>

      {/* Products table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
          <p className="text-muted-foreground">Add your first product to get started.</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-medium">Product</th>
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Stock</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-6 h-6 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{product.category}</td>
                    <td className="p-4">
                      <span className="font-semibold">₹{product.price.toLocaleString()}</span>
                      {product.original_price && (
                        <span className="text-sm text-muted-foreground line-through ml-2">
                          ₹{product.original_price.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={product.stock > 0 ? "text-green-500" : "text-red-500"}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.is_active ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                      }`}>
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
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

export default AdminProducts;
