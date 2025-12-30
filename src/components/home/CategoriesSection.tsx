import { Link } from "react-router-dom";
import { Cog, Disc, Gauge, Zap, CircleDot, Sparkles } from "lucide-react";

const categories = [
  { icon: Cog, name: "Engine Parts", slug: "engine-parts" },
  { icon: Disc, name: "Brake System", slug: "brake-system" },
  { icon: Gauge, name: "Suspension", slug: "suspension" },
  { icon: Zap, name: "Electrical", slug: "electrical" },
  { icon: CircleDot, name: "Tires & Wheels", slug: "tires-wheels" },
  { icon: Sparkles, name: "Accessories", slug: "accessories" },
];

export const CategoriesSection = () => {
  return (
    <section className="py-16 bg-card/50">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-2xl md:text-3xl text-center mb-8">
          SHOP BY CATEGORY
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/products/${category.slug}`}
              className="flex flex-col items-center p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors text-center"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <category.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-medium">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
