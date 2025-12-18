import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag, Tag, Truck, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cartItems, isLoading, updateQuantity, removeItem, subtotal } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "save10") {
      setAppliedCoupon("SAVE10");
      toast.success("Coupon applied! 10% discount added");
    } else {
      toast.error("Invalid coupon code");
    }
    setCouponCode("");
  };

  const discount = appliedCoupon ? subtotal * 0.1 : 0;
  const deliveryCharge = subtotal > 2000 ? 0 : 99;
  const total = subtotal - discount + deliveryCharge;

  const handleProceedToCheckout = () => {
    if (!user) {
      toast.error("Please login to proceed to checkout");
      navigate("/login");
      return;
    }
    // Pass cart state to checkout
    navigate("/checkout", { 
      state: { 
        appliedCoupon, 
        discount, 
        deliveryCharge 
      } 
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
          <h1 className="font-heading text-4xl mb-4">LOGIN TO VIEW CART</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Please login to view your cart and manage your items.
          </p>
          <Button asChild variant="hero" size="xl">
            <Link to="/login">Login</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading cart...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
          <h1 className="font-heading text-4xl mb-4">YOUR CART IS EMPTY</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet. 
            Browse our products and find the perfect parts for your vehicle.
          </p>
          <Button asChild variant="hero" size="xl">
            <Link to="/products">Start Shopping</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">Shopping Cart</span>
        </nav>

        <h1 className="font-heading text-4xl md:text-5xl mb-8">
          SHOPPING CART
          <span className="text-muted-foreground text-2xl ml-4">
            ({cartItems.length} items)
          </span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const product = item.product;
              if (!product) return null;

              return (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-2xl bg-card border border-border"
                >
                  {/* Image */}
                  <Link
                    to={`/product/${product.id}`}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-muted flex-shrink-0"
                  >
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-xs text-primary font-medium uppercase">
                          {product.brand}
                        </span>
                        <Link to={`/product/${product.id}`}>
                          <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                        {product.compatible_models && product.compatible_models.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Fits: {product.compatible_models.slice(0, 2).join(", ")}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity({ cartItemId: item.id, quantity: item.quantity - 1 })}
                          className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity({ cartItemId: item.id, quantity: item.quantity + 1 })}
                          className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          ₹{(product.price * item.quantity).toLocaleString()}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-xs text-muted-foreground">
                            ₹{product.price.toLocaleString()} each
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-2xl bg-card border border-border">
              <h2 className="font-heading text-2xl mb-6">ORDER SUMMARY</h2>

              {/* Coupon */}
              <div className="mb-6">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter code"
                      className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <Button variant="outline" onClick={applyCoupon}>
                    Apply
                  </Button>
                </div>
                {appliedCoupon && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-green-500">
                    <Tag className="w-4 h-4" />
                    {appliedCoupon} applied - 10% off
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Try "SAVE10" for 10% discount
                </p>
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className={deliveryCharge === 0 ? "text-green-500" : ""}>
                    {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div className="pt-3 border-t border-border flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Free delivery notice */}
              {subtotal < 2000 && (
                <div className="mb-6 p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="w-4 h-4 text-primary" />
                    <span>
                      Add ₹{(2000 - subtotal).toLocaleString()} more for free delivery!
                    </span>
                  </div>
                </div>
              )}

              <Button variant="hero" size="xl" className="w-full" onClick={handleProceedToCheckout}>
                Proceed to Checkout
              </Button>

              <p className="text-center text-xs text-muted-foreground mt-4">
                Cash on Delivery available
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
