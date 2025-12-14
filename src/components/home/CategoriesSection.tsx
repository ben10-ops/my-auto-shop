import { Cog, Disc, Gauge, Zap, CircleDot, Sparkles } from "lucide-react";

const categories = [
  {
    icon: Cog,
    name: "Engine Parts",
    count: 1200,
    description: "Pistons, Gaskets, Valves & More",
  },
  {
    icon: Disc,
    name: "Brake System",
    count: 450,
    description: "Pads, Rotors, Calipers & Fluids",
  },
  {
    icon: Gauge,
    name: "Suspension",
    count: 380,
    description: "Shocks, Struts & Steering Parts",
  },
  {
    icon: Zap,
    name: "Electrical",
    count: 620,
    description: "Batteries, Alternators & Starters",
  },
  {
    icon: CircleDot,
    name: "Tires & Wheels",
    count: 290,
    description: "All Sizes & Premium Brands",
  },
  {
    icon: Sparkles,
    name: "Accessories",
    count: 850,
    description: "Lights, Covers & Interior",
  },
];

export const CategoriesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Browse Categories
          </span>
          <h2 className="font-heading text-4xl md:text-5xl mb-4">
            SHOP BY CATEGORY
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Find exactly what you need from our extensive collection of genuine automobile parts
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <a
              key={category.name}
              href="#"
              className="group relative p-6 rounded-2xl card-gradient border border-border hover:border-primary/50 transition-all duration-500 overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-primary/5" />
              </div>

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <category.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Content */}
                <h3 className="font-heading text-lg mb-1 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                  {category.description}
                </p>
                <span className="text-xs text-primary font-medium">
                  {category.count}+ Products
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
