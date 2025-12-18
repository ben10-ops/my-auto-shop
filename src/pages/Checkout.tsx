import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  CreditCard, 
  Truck, 
  ChevronRight,
  Check,
  Wallet,
  Building2,
  Banknote,
  Loader2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { useOrders } from "@/hooks/useOrders";
import { useDeliveryCheck } from "@/hooks/useDeliveryCheck";
import { useAuth } from "@/contexts/AuthContext";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { cartItems, subtotal, isLoading: cartLoading } = useCart();
  const { createOrder, isCreating } = useOrders();
  const { checkPincode, deliveryArea, isChecking } = useDeliveryCheck();
  
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Get discount from cart page
  const cartState = location.state as { appliedCoupon?: string; discount?: number; deliveryCharge?: number } | null;
  const discount = cartState?.discount || 0;
  const deliveryCharge = deliveryArea?.delivery_charge ?? (subtotal > 2000 ? 0 : 99);
  const total = subtotal - discount + deliveryCharge;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Check delivery when pincode changes
    if (name === "pincode" && value.length === 6) {
      checkPincode(value);
    }
  };

  const validateAddress = () => {
    const required = ["full_name", "phone", "address_line1", "city", "state", "pincode"];
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        toast.error(`Please fill in ${field.replace("_", " ")}`);
        return false;
      }
    }
    if (formData.pincode.length !== 6) {
      toast.error("Please enter a valid 6-digit pincode");
      return false;
    }
    if (!deliveryArea) {
      toast.error("Please enter a valid pincode to check delivery availability");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    try {
      const orderItems = cartItems.map((item) => ({
        product_id: item.product_id,
        product_name: item.product?.name || "Unknown Product",
        product_image: item.product?.image_url || null,
        quantity: item.quantity,
        price: item.product?.price || 0,
      }));

      await createOrder({
        items: orderItems,
        shipping_address: formData,
        payment_method: paymentMethod,
        subtotal,
        delivery_charge: deliveryCharge,
        discount,
        total,
      });

      navigate("/account", { state: { tab: "orders" } });
    } catch (error) {
      console.error("Order error:", error);
    }
  };

  const paymentMethods = [
    { id: "cod", label: "Cash on Delivery", icon: Banknote },
    { id: "upi", label: "UPI Payment", icon: Wallet, disabled: true },
    { id: "card", label: "Credit / Debit Card", icon: CreditCard, disabled: true },
    { id: "netbanking", label: "Net Banking", icon: Building2, disabled: true },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <AlertCircle className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
          <h1 className="font-heading text-4xl mb-4">LOGIN REQUIRED</h1>
          <p className="text-muted-foreground mb-8">Please login to proceed with checkout.</p>
          <Button asChild variant="hero" size="xl">
            <Link to="/login">Login</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
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
          <AlertCircle className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
          <h1 className="font-heading text-4xl mb-4">CART IS EMPTY</h1>
          <p className="text-muted-foreground mb-8">Add items to your cart before checkout.</p>
          <Button asChild variant="hero" size="xl">
            <Link to="/products">Browse Products</Link>
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
          <Link to="/cart" className="hover:text-primary transition-colors">Cart</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">Checkout</span>
        </nav>

        <h1 className="font-heading text-4xl md:text-5xl mb-8">CHECKOUT</h1>

        {/* Progress steps */}
        <div className="flex items-center justify-center mb-12">
          {["Delivery", "Payment", "Review"].map((label, i) => (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step > i + 1
                      ? "bg-primary text-primary-foreground"
                      : step === i + 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > i + 1 ? <Check className="w-5 h-5" /> : i + 1}
                </div>
                <span className="text-sm mt-2 text-muted-foreground">{label}</span>
              </div>
              {i < 2 && (
                <div
                  className={`w-20 h-0.5 mx-2 ${
                    step > i + 1 ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Step 1: Delivery */}
            {step === 1 && (
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="font-heading text-2xl mb-6 flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-primary" />
                  DELIVERY ADDRESS
                </h2>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full h-12 px-4 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="w-full h-12 px-4 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    name="address_line1"
                    value={formData.address_line1}
                    onChange={handleInputChange}
                    placeholder="House/Flat No., Building Name"
                    className="w-full h-12 px-4 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    name="address_line2"
                    value={formData.address_line2}
                    onChange={handleInputChange}
                    placeholder="Street, Area, Landmark"
                    className="w-full h-12 px-4 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="400001"
                      maxLength={6}
                      className="w-full h-12 px-4 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Mumbai"
                      className="w-full h-12 px-4 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Maharashtra"
                      className="w-full h-12 px-4 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Delivery availability check */}
                {isChecking && (
                  <div className="p-4 rounded-xl bg-muted/50 mb-6 flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span>Checking delivery availability...</span>
                  </div>
                )}
                
                {deliveryArea && (
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 mb-6">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Delivery available to {deliveryArea.area_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Estimated delivery: {deliveryArea.estimated_days} days • 
                          Delivery charge: ₹{deliveryArea.delivery_charge}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {formData.pincode.length === 6 && !isChecking && !deliveryArea && (
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 mb-6">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-destructive" />
                      <div>
                        <p className="font-medium text-destructive">Delivery not available</p>
                        <p className="text-sm text-muted-foreground">
                          Sorry, we don't deliver to this pincode yet.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  variant="hero" 
                  size="xl" 
                  onClick={() => validateAddress() && setStep(2)}
                  disabled={!deliveryArea}
                >
                  Continue to Payment
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="font-heading text-2xl mb-6 flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-primary" />
                  PAYMENT METHOD
                </h2>

                <div className="space-y-3 mb-8">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-colors ${
                        method.disabled 
                          ? "opacity-50 cursor-not-allowed border-border"
                          : paymentMethod === method.id
                          ? "border-primary bg-primary/5 cursor-pointer"
                          : "border-border hover:border-primary/50 cursor-pointer"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => !method.disabled && setPaymentMethod(e.target.value)}
                        disabled={method.disabled}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === method.id
                            ? "border-primary"
                            : "border-muted-foreground"
                        }`}
                      >
                        {paymentMethod === method.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        )}
                      </div>
                      <method.icon className="w-6 h-6 text-primary" />
                      <span className="font-medium">{method.label}</span>
                      {method.disabled && (
                        <span className="ml-auto text-xs text-muted-foreground">Coming soon</span>
                      )}
                    </label>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" size="xl" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button variant="hero" size="xl" className="flex-1" onClick={() => setStep(3)}>
                    Review Order
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="font-heading text-2xl mb-6">ORDER REVIEW</h2>

                {/* Delivery address preview */}
                <div className="p-4 rounded-xl bg-muted/50 mb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium mb-1">Delivery Address</h4>
                      <p className="text-sm text-muted-foreground">
                        {formData.full_name}<br />
                        {formData.address_line1}<br />
                        {formData.address_line2 && <>{formData.address_line2}<br /></>}
                        {formData.city}, {formData.state} - {formData.pincode}<br />
                        {formData.phone}
                      </p>
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      className="text-sm text-primary hover:underline"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Payment method preview */}
                <div className="p-4 rounded-xl bg-muted/50 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Banknote className="w-5 h-5 text-primary" />
                      <span className="font-medium">
                        {paymentMethods.find((m) => m.id === paymentMethod)?.label}
                      </span>
                    </div>
                    <button
                      onClick={() => setStep(2)}
                      className="text-sm text-primary hover:underline"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Order items */}
                <h4 className="font-medium mb-4">Order Items</h4>
                <div className="space-y-3 mb-6">
                  {cartItems.map((item) => {
                    const product = item.product;
                    if (!product) return null;
                    return (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                          <img
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium line-clamp-1">{product.name}</h5>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="font-semibold">
                          ₹{(product.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" size="xl" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button
                    variant="hero"
                    size="xl"
                    className="flex-1"
                    onClick={handlePlaceOrder}
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Place Order • ₹${total.toLocaleString()}`
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-2xl bg-card border border-border">
              <h2 className="font-heading text-xl mb-4">ORDER SUMMARY</h2>

              {/* Items */}
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => {
                  const product = item.product;
                  if (!product) return null;
                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium line-clamp-1">{product.name}</h5>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-semibold">
                        ₹{(product.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-500">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className={deliveryCharge === 0 ? "text-green-500" : ""}>
                    {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div className="pt-3 border-t border-border flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
