import { Truck, Shield, Clock, BadgeCheck, Headphones, RotateCcw } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Same Day Delivery",
    description: "Get your parts delivered within hours in select local areas",
  },
  {
    icon: Shield,
    title: "100% Genuine Parts",
    description: "We guarantee authenticity with manufacturer warranty",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Our expert team is always ready to help you find the right part",
  },
  {
    icon: BadgeCheck,
    title: "Quality Assured",
    description: "Every product goes through strict quality checks",
  },
  {
    icon: Headphones,
    title: "Expert Guidance",
    description: "Get advice from experienced automobile professionals",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "Hassle-free 7-day return policy for your peace of mind",
  },
];

export const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Why Mahalaxmi
          </span>
          <h2 className="font-heading text-4xl md:text-5xl mb-4">
            WHY CHOOSE US
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Trusted by thousands of customers for genuine parts and exceptional service
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl accent-gradient flex items-center justify-center mb-6 shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                <feature.icon className="w-8 h-8 text-primary-foreground" />
              </div>

              {/* Content */}
              <h3 className="font-heading text-2xl mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {[
            { value: "10K+", label: "Happy Customers" },
            { value: "5K+", label: "Products" },
            { value: "50+", label: "Brands" },
            { value: "99%", label: "Satisfaction" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-6 rounded-2xl bg-card/50 border border-border">
              <div className="font-heading text-4xl md:text-5xl text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
