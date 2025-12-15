import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const categories = ["Engine Parts", "Brake System", "Suspension", "Electrical", "Tires & Wheels", "Accessories"];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="border-b border-border/50 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4 text-primary" />
              <span>+91 98765 43210</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-muted-foreground">
              <Link to="/track-order" className="hover:text-primary transition-colors">Track Order</Link>
              <Link to="/service-area" className="hover:text-primary transition-colors">Delivery Areas</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-lg accent-gradient flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
              <span className="font-heading text-2xl text-primary-foreground">M</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-heading text-2xl leading-none">Mahalaxmi</h1>
              <p className="text-xs text-primary tracking-widest">AUTOMOBILES</p>
            </div>
          </Link>

          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full group">
              <input type="text" placeholder="Search parts by name, brand, or car model..." className="w-full h-12 pl-5 pr-12 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors">
                <Search className="w-4 h-4 text-primary-foreground" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/cart">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">0</span>
              </Link>
            </Button>
            
            {user ? (
              <Button variant="ghost" size="icon" asChild>
                <Link to="/account">
                  <User className="w-5 h-5" />
                </Link>
              </Button>
            ) : (
              <Button variant="default" className="hidden sm:flex" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            )}
            
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        <nav className="hidden lg:block border-t border-border/50">
          <ul className="flex items-center gap-8 h-12">
            {categories.map((category) => (
              <li key={category}>
                <Link to={`/products/${category.toLowerCase().replace(/ /g, "-")}`} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  {category}
                </Link>
              </li>
            ))}
            {isAdmin && (
              <li>
                <Link to="/admin" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  Admin
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card animate-fade-in">
          <div className="container mx-auto px-4 py-4">
            <div className="relative mb-4">
              <input type="text" placeholder="Search parts..." className="w-full h-12 pl-5 pr-12 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category}>
                  <Link to={`/products/${category.toLowerCase().replace(/ /g, "-")}`} className="block py-3 px-4 rounded-lg text-foreground hover:bg-muted transition-colors" onClick={() => setIsMenuOpen(false)}>
                    {category}
                  </Link>
                </li>
              ))}
              {!user && (
                <li>
                  <Link to="/login" className="block py-3 px-4 rounded-lg text-primary font-medium hover:bg-muted transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};