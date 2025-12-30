import { Star } from "lucide-react";

const testimonials = [
  { name: "Rahul S.", text: "Great quality parts and fast delivery!", rating: 5 },
  { name: "Priya M.", text: "Excellent customer service. Highly recommend.", rating: 5 },
  { name: "Amit K.", text: "Best prices in the market. Very satisfied.", rating: 5 },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-card/50">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-2xl md:text-3xl text-center mb-8">
          WHAT CUSTOMERS SAY
        </h2>

        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-card border border-border"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4">"{testimonial.text}"</p>
              <p className="font-medium text-sm">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
