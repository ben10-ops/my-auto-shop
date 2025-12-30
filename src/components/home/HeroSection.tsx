import { Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Trusted by 10,000+ customers
          </div>

          {/* Heading */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl mb-4">
            MAHALAXMI<br />
            <span className="text-primary">AUTOMOBILES</span>
          </h1>

          {/* Subtitle */}
          <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
            Your one-stop destination for genuine spare parts. Fast local delivery and unbeatable prices.
          </p>

          {/* Search */}
          <div className="flex items-center bg-card border border-border rounded-lg overflow-hidden max-w-md mx-auto mb-8">
            <input
              type="text"
              placeholder="Search parts..."
              className="flex-1 h-12 px-4 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <Button size="icon" className="m-1.5 rounded-md">
              <Search className="w-4 h-4" />
            </Button>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild>
              <Link to="/products">
                Shop All Parts
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/track-order">Track Order</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
