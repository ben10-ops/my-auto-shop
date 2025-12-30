import { Button } from "@/components/ui/button";

export const NewsletterSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto text-center">
          <h2 className="font-heading text-2xl mb-2">STAY UPDATED</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Get notified about new products and exclusive offers.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-10 px-4 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
            <Button size="sm">Subscribe</Button>
          </div>
        </div>
      </div>
    </section>
  );
};
