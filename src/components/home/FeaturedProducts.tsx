import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Premium Brake Pads Set",
    brand: "Bosch",
    price: 2499,
    originalPrice: 3299,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    name: "Engine Oil 5W-30 Synthetic",
    brand: "Castrol",
    price: 899,
    originalPrice: 1199,
    image: "https://images.unsplash.com/photo-1635784008947-b51ea6c7b0ec?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    name: "Spark Plug Iridium Set of 4",
    brand: "NGK",
    price: 1899,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1558618047-f4b511d7e9a5?w=400&h=400&fit=crop",
  },
  {
    id: 4,
    name: "Car Battery 65Ah",
    brand: "Exide",
    price: 5999,
    originalPrice: 7499,
    image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400&h=400&fit=crop",
  },
];

export const FeaturedProducts = () => {
  return (
    <section className="py-16 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl md:text-3xl">FEATURED PRODUCTS</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/products">View All</Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
            >
              {/* Image */}
              <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Brand */}
              <span className="text-xs text-primary font-medium">{product.brand}</span>

              {/* Name */}
              <h3 className="font-medium text-sm mt-1 mb-2 line-clamp-2">{product.name}</h3>

              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-primary">₹{product.price.toLocaleString()}</span>
                {product.originalPrice > product.price && (
                  <span className="text-xs text-muted-foreground line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
