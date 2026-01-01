import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { allProducts } from "@/data/products";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductReviews } from "@/components/products/ProductReviews";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Truck, 
  Shield, 
  RotateCcw, 
  Plus, 
  Minus,
  Check,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const product = allProducts.find((p) => p.id === Number(id));
  const relatedProducts = allProducts
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-heading text-4xl mb-4">PRODUCT NOT FOUND</h1>
          <p className="text-muted-foreground mb-8">
            The product you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/products">Browse All Products</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    toast.success(`Added ${quantity} x ${product.name} to cart!`);
  };

  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Breadcrumb */}
        <div className="bg-card/50 border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <Link to="/products" className="text-muted-foreground hover:text-primary transition-colors">
                Products
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product section */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-card border border-border">
                {discount > 0 && (
                  <span className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
                    -{discount}% OFF
                  </span>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Thumbnail gallery placeholder */}
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-colors ${
                      i === 1 ? "border-primary" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={product.image}
                      alt={`${product.name} view ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product info */}
            <div>
              {/* Brand */}
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                {product.brand}
              </span>

              {/* Name */}
              <h1 className="font-heading text-3xl md:text-4xl mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-primary text-primary"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-bold text-foreground">
                  ₹{product.price.toLocaleString()}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-primary font-medium">
                      Save ₹{(product.originalPrice - product.price).toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              {/* Compatibility */}
              <div className="p-4 rounded-xl bg-card border border-border mb-6">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Vehicle Compatibility
                </h4>
                <p className="text-foreground">{product.compatibility}</p>
              </div>

              {/* Stock status */}
              <div className="flex items-center gap-2 mb-6">
                {product.inStock ? (
                  <>
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-green-500 font-medium">In Stock</span>
                  </>
                ) : (
                  <>
                    <span className="w-3 h-3 rounded-full bg-destructive" />
                    <span className="text-destructive font-medium">Out of Stock</span>
                  </>
                )}
              </div>

              {/* Quantity selector */}
              <div className="flex items-center gap-6 mb-8">
                <span className="text-sm font-medium text-muted-foreground">Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-4 mb-8">
                <Button
                  variant="hero"
                  size="xl"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="xl">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-card border border-border text-center">
                  <Truck className="w-6 h-6 mx-auto text-primary mb-2" />
                  <p className="text-xs text-muted-foreground">Same Day Delivery</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border text-center">
                  <Shield className="w-6 h-6 mx-auto text-primary mb-2" />
                  <p className="text-xs text-muted-foreground">Genuine Product</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border text-center">
                  <RotateCcw className="w-6 h-6 mx-auto text-primary mb-2" />
                  <p className="text-xs text-muted-foreground">7 Days Return</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product tabs */}
        <section className="bg-card/50 border-y border-border">
          <div className="container mx-auto px-4">
            {/* Tab headers */}
            <div className="flex border-b border-border">
              {["description", "specifications", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-heading text-lg capitalize border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="py-8">
              {activeTab === "description" && (
                <div className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    The {product.name} from {product.brand} is a premium quality automobile part designed to provide exceptional performance and durability. Manufactured using high-grade materials and advanced engineering techniques, this product meets or exceeds OEM specifications.
                  </p>
                  <h4 className="font-heading text-xl mt-6 mb-4">Key Features</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">Premium quality construction for long-lasting durability</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">Direct OEM replacement for easy installation</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">Tested for quality and performance</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">Backed by manufacturer warranty</span>
                    </li>
                  </ul>
                </div>
              )}

              {activeTab === "specifications" && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Brand</span>
                      <span className="font-medium">{product.brand}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Part Number</span>
                      <span className="font-medium">MA-{product.id.toString().padStart(6, "0")}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Compatibility</span>
                      <span className="font-medium">{product.compatibility}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Warranty</span>
                      <span className="font-medium">1 Year</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Country of Origin</span>
                      <span className="font-medium">India</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Material</span>
                      <span className="font-medium">OEM Grade</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <ProductReviews productId={String(product.id)} />
              )}
            </div>
          </div>
        </section>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="container mx-auto px-4 py-16">
            <h2 className="font-heading text-3xl mb-8">RELATED PRODUCTS</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
