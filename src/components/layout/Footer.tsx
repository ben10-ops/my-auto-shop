import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-heading text-xl text-primary-foreground">M</span>
              </div>
              <span className="font-heading text-xl">Mahalaxmi</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your trusted partner for genuine automobile spare parts.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="text-muted-foreground hover:text-primary">All Products</Link></li>
              <li><Link to="/track-order" className="text-muted-foreground hover:text-primary">Track Order</Link></li>
              <li><Link to="/account" className="text-muted-foreground hover:text-primary">My Account</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products/engine-parts" className="text-muted-foreground hover:text-primary">Engine Parts</Link></li>
              <li><Link to="/products/brake-system" className="text-muted-foreground hover:text-primary">Brake System</Link></li>
              <li><Link to="/products/electrical" className="text-muted-foreground hover:text-primary">Electrical</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                info@mahalaxmiauto.com
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                Mumbai, India
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-muted-foreground">
            © 2024 Mahalaxmi Automobiles. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
