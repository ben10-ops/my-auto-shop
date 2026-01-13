import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { categories, brands } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const priceRanges = [
  { id: "0-1000", label: "Under ₹1,000", min: 0, max: 1000 },
  { id: "1000-3000", label: "₹1,000 - ₹3,000", min: 1000, max: 3000 },
  { id: "3000-5000", label: "₹3,000 - ₹5,000", min: 3000, max: 5000 },
  { id: "5000-10000", label: "₹5,000 - ₹10,000", min: 5000, max: 10000 },
  { id: "10000+", label: "Above ₹10,000", min: 10000, max: Infinity },
];

// Map URL category slugs to database category names
const categorySlugToName: Record<string, string> = {
  "engine-parts": "Engine Parts",
  "brake-system": "Brake System",
  "suspension-steering": "Suspension & Steering",
  "electrical-parts": "Electrical Parts",
  "tires-wheels": "Tires & Wheels",
  "accessories": "Accessories",
};

const Products = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const urlSearchQuery = searchParams.get("search") || "";
  
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);

  // Sync search query from URL
  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  // Fetch products from database
  const { data: dbProducts = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data || [];
    },
  });

  const categoryInfo = categories.find((c) => c.id === category);
  const dbCategoryName = category ? categorySlugToName[category] : null;

  const filteredProducts = useMemo(() => {
    // Map DB products to ProductCard format
    let products = dbProducts.map(p => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: Number(p.price),
      originalPrice: p.original_price ? Number(p.original_price) : undefined,
      image: p.image_url || "/placeholder.svg",
      rating: 4.5, // Default rating for now
      reviews: 0,
      category: p.category,
      compatibility: p.compatible_models?.join(', ') || '',
      inStock: (p.stock ?? 0) > 0,
    }));
    if (dbCategoryName) {
      products = products.filter((p) => p.category === dbCategoryName);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.compatibility.toLowerCase().includes(query)
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      products = products.filter((p) => selectedBrands.includes(p.brand));
    }

    // Price filter
    if (selectedPriceRange) {
      const range = priceRanges.find((r) => r.id === selectedPriceRange);
      if (range) {
        products = products.filter(
          (p) => p.price >= range.min && p.price <= range.max
        );
      }
    }

    // Sort
    if (sortBy === "price-low") {
      products = [...products].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      products = [...products].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      products = [...products].sort((a, b) => b.rating - a.rating);
    }

    return products;
  }, [dbProducts, dbCategoryName, searchQuery, selectedBrands, selectedPriceRange, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedBrands([]);
    setSelectedPriceRange(null);
  };

  const activeFiltersCount =
    selectedBrands.length + (selectedPriceRange ? 1 : 0) + (searchQuery ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">
            {categoryInfo?.name || "All Products"}
          </span>
        </nav>

        {/* Page header */}
        <div className="mb-6">
          <h1 className="font-heading text-3xl md:text-4xl mb-4">
            {categoryInfo?.name || "ALL PRODUCTS"}
          </h1>
          
          {/* Search bar */}
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-[200px] max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setShowFilters(true)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 px-3 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:border-primary text-sm"
            >
              <option value="popular">Popular</option>
              <option value="rating">Top Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
          
          <p className="text-sm text-muted-foreground mt-3">
            {filteredProducts.length} products found
          </p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters - Desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-20 space-y-4">
              {/* Categories */}
              <div className="p-4 rounded-xl bg-card border border-border">
                <h3 className="font-semibold text-sm mb-3">Categories</h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/products"
                      className={`block py-1.5 px-2 rounded text-sm transition-colors ${
                        !category
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      All Products
                    </Link>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        to={`/products/${cat.id}`}
                        className={`block py-1.5 px-2 rounded text-sm transition-colors ${
                          category === cat.id
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Brands */}
              <div className="p-4 rounded-xl bg-card border border-border">
                <h3 className="font-semibold text-sm mb-3">Brands</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {brands.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={() => toggleBrand(brand)}
                      />
                      <span className="text-sm text-muted-foreground">
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="p-4 rounded-xl bg-card border border-border">
                <h3 className="font-semibold text-sm mb-3">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label
                      key={range.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedPriceRange === range.id}
                        onCheckedChange={() =>
                          setSelectedPriceRange(
                            selectedPriceRange === range.id ? null : range.id
                          )
                        }
                      />
                      <span className="text-sm text-muted-foreground">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">No Products Found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your search or filters.
                </p>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile filters drawer */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-background/80"
              onClick={() => setShowFilters(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-card border-l border-border p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Categories */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Categories</h4>
                  <ul className="space-y-1">
                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <Link
                          to={`/products/${cat.id}`}
                          onClick={() => setShowFilters(false)}
                          className={`block py-1.5 text-sm ${
                            category === cat.id ? "text-primary" : "text-muted-foreground"
                          }`}
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Brands */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Brands</h4>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <label key={brand} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={() => toggleBrand(brand)}
                        />
                        <span className="text-sm">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Price Range</h4>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <label key={range.id} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={selectedPriceRange === range.id}
                          onCheckedChange={() =>
                            setSelectedPriceRange(
                              selectedPriceRange === range.id ? null : range.id
                            )
                          }
                        />
                        <span className="text-sm">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button className="w-full" size="sm" onClick={() => setShowFilters(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Products;
