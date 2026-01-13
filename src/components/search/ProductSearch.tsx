import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  image_url: string | null;
}

interface ProductSearchProps {
  variant?: "hero" | "header";
  onClose?: () => void;
}

export const ProductSearch = ({ variant = "hero", onClose }: ProductSearchProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data: products, isLoading } = useQuery({
    queryKey: ["product-search", query],
    queryFn: async () => {
      if (query.length < 2) return [];
      
      const { data, error } = await supabase
        .from("products")
        .select("id, name, brand, category, price, image_url")
        .eq("is_active", true)
        .or(`name.ilike.%${query}%,brand.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(6);
      
      if (error) throw error;
      return data as Product[];
    },
    enabled: query.length >= 2,
  });

  const suggestions = products || [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        navigateToProduct(suggestions[selectedIndex].id);
      } else if (query.trim()) {
        navigateToSearch();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const navigateToProduct = (productId: string) => {
    setQuery("");
    setIsOpen(false);
    onClose?.();
    navigate(`/product/${productId}`);
  };

  const navigateToSearch = () => {
    setIsOpen(false);
    onClose?.();
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const isHero = variant === "hero";

  return (
    <div ref={containerRef} className="relative w-full">
      <div className={`flex items-center bg-card border border-border rounded-lg overflow-hidden ${isHero ? "max-w-md mx-auto" : ""}`}>
        <div className="flex-1 relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search parts, brands..."
            className="w-full h-12 pl-10 pr-8 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-2 p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button 
          size="icon" 
          className="m-1.5 rounded-md shrink-0"
          onClick={navigateToSearch}
          disabled={!query.trim()}
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </Button>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
          {isLoading ? (
            <div className="px-4 py-3 flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Searching...
            </div>
          ) : suggestions.length > 0 ? (
            <>
              <ul className="max-h-80 overflow-y-auto">
                {suggestions.map((product, index) => (
                  <li key={product.id}>
                    <button
                      onClick={() => navigateToProduct(product.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        index === selectedIndex
                          ? "bg-accent"
                          : "hover:bg-accent/50"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center overflow-hidden shrink-0">
                        {product.image_url ? (
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Search className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{product.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {product.brand} • {product.category}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-primary shrink-0">
                        ₹{product.price.toLocaleString()}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={navigateToSearch}
                className="w-full px-4 py-3 text-sm text-primary font-medium border-t border-border hover:bg-accent/50 transition-colors"
              >
                View all results for "{query}"
              </button>
            </>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-muted-foreground">No products found for "{query}"</p>
              <button
                onClick={navigateToSearch}
                className="mt-2 text-sm text-primary hover:underline"
              >
                Browse all products
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
