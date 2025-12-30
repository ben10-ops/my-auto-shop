import { Truck, Shield, Clock, RotateCcw } from "lucide-react";

const features = [
  { icon: Truck, title: "Fast Delivery", description: "Same day delivery in select areas" },
  { icon: Shield, title: "100% Genuine", description: "Authentic parts with warranty" },
  { icon: Clock, title: "24/7 Support", description: "Expert help anytime" },
  { icon: RotateCcw, title: "Easy Returns", description: "7-day return policy" },
];

export const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-2xl md:text-3xl text-center mb-8">
          WHY CHOOSE US
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl bg-card border border-border text-center"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
