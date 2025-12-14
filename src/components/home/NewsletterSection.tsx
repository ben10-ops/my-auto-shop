import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export const NewsletterSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 accent-gradient opacity-90" />
          <div className="absolute inset-0 bg-noise opacity-30" />

          <div className="relative z-10 py-16 px-6 md:px-16 text-center">
            <h2 className="font-heading text-4xl md:text-5xl text-primary-foreground mb-4">
              GET EXCLUSIVE DEALS
            </h2>
            <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8">
              Subscribe to our newsletter and be the first to know about new arrivals, special offers, and expert automotive tips.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:flex-1 h-14 px-6 rounded-xl bg-primary-foreground text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-background/50"
              />
              <Button 
                size="xl" 
                className="w-full sm:w-auto bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-heading text-lg tracking-wider"
              >
                <Send className="w-5 h-5 mr-2" />
                Subscribe
              </Button>
            </div>

            <p className="text-primary-foreground/60 text-sm mt-4">
              No spam, unsubscribe anytime. By subscribing you agree to our Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
