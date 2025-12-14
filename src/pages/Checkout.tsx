import { useState } from "react";
import { Link } from "react-router-dom";
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
  Banknote
} from "lucide-react";
import { allProducts } from "@/data/products";
import { toast } from "sonner";

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock cart data
  const cartItems = [
    { productId: 1, quantity: 2 },
    { productId: 2, quantity: 1 },
  ];

  const getProduct = (id: number) => allProducts.find((p) => p.id === id);

  const subtotal = cartItems.reduce((total, item) => {
    const product = getProduct(item.productId);
    return total + (product?.price || 0) * item.quantity;
  }, 0);

  const deliveryCharge = 0;
  const total = subtotal + deliveryCharge;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success("Order placed successfully! Backend integration required for real orders.");
    setIsProcessing(false);
  };

  const paymentMethods = [
    { id: "card", label: "Credit / Debit Card", icon: CreditCard },
    { id: "upi", label: "UPI Payment", icon: Wallet },
    { id: "netbanking", label: "Net Banking", icon: Building2 },
    { id: "cod", label: "Cash on Delivery", icon: Banknote },
  ];

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
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full h-12 px-4 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="w-full h-12 px-4 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Address Line 1
                  </label>
                  <input
                    type="text"
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
                    placeholder="Street, Area, Landmark"
                    className="w-full h-12 px-4 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="Mumbai"
                      className="w-full h-12 px-4 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      placeholder="Maharashtra"
                      className="w-full h-12 px-4 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Pincode
                    </label>
                    <input
                      type="text"
                      placeholder="400001"
                      className="w-full h-12 px-4 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 mb-6">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Same Day Delivery Available</p>
                      <p className="text-sm text-muted-foreground">
                        Order before 2 PM for same day delivery in select areas
                      </p>
                    </div>
                  </div>
                </div>

                <Button variant="hero" size="xl" onClick={() => setStep(2)}>
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
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                        paymentMethod === method.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
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
                    </label>
                  ))}
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-4 mb-8 p-4 rounded-xl bg-muted/50">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full h-12 px-4 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full h-12 px-4 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full h-12 px-4 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                )}

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
                        John Doe<br />
                        123 Auto Market Road<br />
                        Industrial Area, Mumbai - 400001<br />
                        +91 98765 43210
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
                      <CreditCard className="w-5 h-5 text-primary" />
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
                    const product = getProduct(item.productId);
                    if (!product) return null;
                    return (
                      <div key={item.productId} className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                          <img
                            src={product.image}
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
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : `Place Order • ₹${total.toLocaleString()}`}
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
                  const product = getProduct(item.productId);
                  if (!product) return null;
                  return (
                    <div key={item.productId} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium line-clamp-1">{product.name}</h5>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-medium">
                        ₹{(product.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-green-500">FREE</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
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
