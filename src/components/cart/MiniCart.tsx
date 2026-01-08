import { Link } from "react-router-dom";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export const MiniCart = () => {
  const { cartItems, itemCount, subtotal, removeItem, isLoading } = useCart();

  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" asChild>
          <Link to="/cart">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-semibold">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent align="end" className="w-80 p-0">
        <div className="p-4 border-b border-border">
          <h4 className="font-semibold text-sm">Shopping Cart ({itemCount})</h4>
        </div>
        
        {isLoading ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            Loading...
          </div>
        ) : cartItems.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingCart className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Your cart is empty</p>
          </div>
        ) : (
          <>
            <ScrollArea className="max-h-64">
              <div className="p-2 space-y-2">
                {cartItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <img
                      src={item.product?.image_url || "/placeholder.svg"}
                      alt={item.product?.name}
                      className="w-12 h-12 object-cover rounded-md bg-muted"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} × ₹{item.product?.price?.toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeItem(item.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {cartItems.length > 5 && (
                  <p className="text-xs text-center text-muted-foreground py-2">
                    +{cartItems.length - 5} more items
                  </p>
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-border space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link to="/cart">View Cart</Link>
                </Button>
                <Button size="sm" className="flex-1" asChild>
                  <Link to="/checkout">Checkout</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};
