const brands = ["Bosch", "Castrol", "NGK", "Exide", "Philips", "Valeo"];

export const BrandsSection = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground mb-6">Trusted Brands</p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {brands.map((brand) => (
            <span
              key={brand}
              className="text-lg font-heading text-muted-foreground/60 hover:text-primary transition-colors"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
