import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const products = [
  {
    id: 1,
    name: "Premium Brake Pads Set",
    brand: "Bosch",
    price: 2499,
    originalPrice: 3299,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    compatibility: "Honda, Toyota, Maruti",
    inStock: true,
  },
  {
    id: 2,
    name: "Engine Oil 5W-30 Synthetic",
    brand: "Castrol",
    price: 899,
    originalPrice: 1199,
    rating: 4.9,
    reviews: 256,
    image: "https://images.unsplash.com/photo-1635784008947-b51ea6c7b0ec?w=400&h=400&fit=crop",
    compatibility: "All Petrol Vehicles",
    inStock: true,
  },
  {
    id: 3,
    name: "Spark Plug Iridium Set of 4",
    brand: "NGK",
    price: 1899,
    originalPrice: 2499,
    rating: 4.7,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1558618047-f4b511d7e9a5?w=400&h=400&fit=crop",
    compatibility: "Multi-brand Compatible",
    inStock: true,
  },
  {
    id: 4,
    name: "Car Battery 65Ah",
    brand: "Exide",
    price: 5999,
    originalPrice: 7499,
    rating: 4.6,
    reviews: 178,
    image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400&h=400&fit=crop",
    compatibility: "Sedan & SUV",
    inStock: true,
  },
  {
    id: 5,
    name: "LED Headlight Bulb H4",
    brand: "Philips",
    price: 1299,
    originalPrice: 1799,
    rating: 4.5,
    reviews: 92,
    image: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&h=400&fit=crop",
    compatibility: "Universal Fit",
    inStock: false,
  },
  {
    id: 6,
    name: "Air Filter Premium",
    brand: "Mann",
    price: 649,
    originalPrice: 899,
    rating: 4.8,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop",
    compatibility: "Honda City, Civic",
    inStock: true,
  },
  {
    id: 7,
    name: "Shock Absorber Front Set",
    brand: "Monroe",
    price: 4299,
    originalPrice: 5499,
    rating: 4.7,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=400&fit=crop",
    compatibility: "Maruti Swift, Dzire",
    inStock: true,
  },
  {
    id: 8,
    name: "Clutch Plate Assembly",
    brand: "Valeo",
    price: 3499,
    originalPrice: 4299,
    rating: 4.6,
    reviews: 56,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=400&fit=crop",
    compatibility: "Hyundai i20, Venue",
    inStock: true,
  },
];

export const FeaturedProducts = () => {
  return (
    <section className="py-20 bg-card/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Best Sellers
            </span>
            <h2 className="font-heading text-4xl md:text-5xl mb-2">
              FEATURED PRODUCTS
            </h2>
            <p className="text-muted-foreground">
              Top-rated parts trusted by mechanics and car enthusiasts
            </p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0">
            View All Products
          </Button>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/50 transition-all duration-300"
            >
              {/* Discount badge */}
              {product.originalPrice > product.price && (
                <span className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-md bg-primary text-primary-foreground text-xs font-semibold">
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              )}

              {/* Wishlist button */}
              <button className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground">
                <Heart className="w-4 h-4" />
              </button>

              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <span className="text-sm font-medium text-muted-foreground">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Brand */}
                <span className="text-xs text-primary font-medium uppercase tracking-wider">
                  {product.brand}
                </span>

                {/* Name */}
                <h3 className="font-semibold text-foreground mt-1 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>

                {/* Compatibility */}
                <p className="text-xs text-muted-foreground mb-3">
                  Fits: {product.compatibility}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-foreground">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="ml-2 text-sm text-muted-foreground line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <Button 
                    variant="card" 
                    size="icon" 
                    disabled={!product.inStock}
                    className="rounded-lg"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
