import { Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const popularSearches = ["Brake Pads", "Oil Filter", "Spark Plugs", "Battery", "Clutch Plate"];

export const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center hero-gradient overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-noise opacity-50" />
      <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      
      {/* Animated gear decoration */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:block">
        <div className="relative w-[500px] h-[500px] animate-spin-slow opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full text-primary">
            <path
              fill="currentColor"
              d="M100,20 L105,40 L120,35 L115,55 L135,60 L125,75 L145,85 L130,95 L145,110 L125,115 L135,135 L115,130 L120,150 L105,145 L100,165 L95,145 L80,150 L85,130 L65,135 L75,115 L55,110 L70,95 L55,85 L75,75 L65,60 L85,55 L80,35 L95,40 Z"
            />
            <circle cx="100" cy="100" r="30" fill="hsl(var(--background))" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Trusted by 10,000+ customers locally</span>
          </div>

          {/* Main heading */}
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none mb-6 animate-slide-up">
            <span className="block text-foreground">MAHALAXMI</span>
            <span className="block text-gradient">AUTOMOBILES</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Your one-stop destination for genuine spare parts. 
            <span className="text-foreground font-medium"> Fast local delivery</span>, 
            premium quality, and unbeatable prices.
          </p>

          {/* Search box */}
          <div className="relative max-w-xl mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center bg-card border border-border rounded-xl overflow-hidden shadow-2xl shadow-background/50">
              <input
                type="text"
                placeholder="Search by part name, car model, or brand..."
                className="flex-1 h-14 md:h-16 px-6 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
              />
              <Button size="xl" className="m-2 rounded-lg">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Popular searches */}
          <div className="flex flex-wrap items-center gap-3 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <span className="text-sm text-muted-foreground">Popular:</span>
            {popularSearches.map((search) => (
              <button
                key={search}
                className="px-4 py-2 rounded-full bg-muted/50 border border-border text-sm text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                {search}
              </button>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center gap-4 mt-10 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <Button variant="hero" size="xl">
              Shop All Parts
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
            <Button variant="heroOutline" size="xl">
              Check Delivery Area
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
