import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, User, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/hooks/useWishlist";
import { MiniCart } from "@/components/cart/MiniCart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const categories = ["Engine Parts", "Brake System", "Suspension", "Electrical", "Tires & Wheels", "Accessories"];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const { wishlistCount } = useWishlist();

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-heading text-xl text-primary-foreground">M</span>
            </div>
            <span className="font-heading text-xl hidden sm:block">Mahalaxmi</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              All Products
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Categories <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-card border-border">
                {categories.map((category) => (
                  <DropdownMenuItem key={category} asChild>
                    <Link to={`/products/${category.toLowerCase().replace(/ /g, "-")}`}>
                      {category}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/track-order" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Track Order
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-sm text-primary font-medium hover:text-primary/80 transition-colors">
                Admin
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link to="/wishlist">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-semibold">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>
            </Button>
            <MiniCart />
            
            {user ? (
              <Button variant="ghost" size="icon" asChild>
                <Link to="/account">
                  <User className="w-5 h-5" />
                </Link>
              </Button>
            ) : (
              <Button variant="default" size="sm" asChild className="hidden sm:flex">
                <Link to="/login">Sign In</Link>
              </Button>
            )}
            
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link 
              to="/products" 
              className="block py-2 text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              All Products
            </Link>
            <div className="border-t border-border pt-2">
              <p className="text-xs text-muted-foreground mb-2">Categories</p>
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/products/${category.toLowerCase().replace(/ /g, "-")}`}
                  className="block py-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category}
                </Link>
              ))}
            </div>
            <div className="border-t border-border pt-2 space-y-2">
              <Link 
                to="/track-order" 
                className="block py-2 text-muted-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Track Order
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="block py-2 text-primary font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              {!user && (
                <Link 
                  to="/login" 
                  className="block py-2 text-primary font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
