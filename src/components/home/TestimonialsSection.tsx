import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Car Enthusiast",
    avatar: "RK",
    rating: 5,
    text: "Excellent quality brake pads! Delivery was super fast and the product was exactly as described. Best prices in the city.",
  },
  {
    name: "Suresh Patel",
    role: "Garage Owner",
    avatar: "SP",
    rating: 5,
    text: "I've been sourcing parts from Mahalaxmi for my garage. Their genuine parts and wholesale rates have made them my go-to supplier.",
  },
  {
    name: "Amit Sharma",
    role: "Fleet Manager",
    avatar: "AS",
    rating: 5,
    text: "Managing 50+ vehicles requires reliable parts. Mahalaxmi delivers quality and reliability every single time. Highly recommended!",
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-card/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="font-heading text-4xl md:text-5xl mb-4">
            WHAT OUR CUSTOMERS SAY
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="relative p-8 rounded-2xl bg-card border border-border"
            >
              {/* Quote icon */}
              <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/20" />

              {/* Rating */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground/90 mb-8 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full accent-gradient flex items-center justify-center">
                  <span className="font-heading text-lg text-primary-foreground">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
