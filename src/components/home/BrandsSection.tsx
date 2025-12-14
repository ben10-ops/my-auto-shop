const brands = [
  { name: "Bosch", logo: "BOSCH" },
  { name: "Castrol", logo: "CASTROL" },
  { name: "NGK", logo: "NGK" },
  { name: "Exide", logo: "EXIDE" },
  { name: "Philips", logo: "PHILIPS" },
  { name: "Mann", logo: "MANN" },
  { name: "Monroe", logo: "MONROE" },
  { name: "Valeo", logo: "VALEO" },
];

export const BrandsSection = () => {
  return (
    <section className="py-16 bg-card/30 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h3 className="text-muted-foreground text-sm uppercase tracking-widest">
            Trusted Brands We Stock
          </h3>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="group px-6 py-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <span className="font-heading text-2xl md:text-3xl text-muted-foreground group-hover:text-primary transition-colors">
                {brand.logo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
