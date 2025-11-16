import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { Product } from "@shared/schema";
import { ProductCard } from "@/components/ProductCard";
import { FilterPanel, type Filters } from "@/components/FilterPanel";
import { InquiryCart } from "@/components/InquiryCart";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Laptop, GraduationCap, Zap, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 8;

const defaultFilters: Filters = {
  purpose: [],
  ram: [],
  storageType: [],
  storageSize: [],
  screenSize: [],
  brand: [],
  priceRange: [0, 200000],
};

interface HomeProps {
  products: Product[];
  isLoading: boolean;
  onSubmitInquiry: (data: { name: string; phone: string; email: string; message?: string }, productIds: string[]) => Promise<void>;
}

export default function Home({ products, isLoading, onSubmitInquiry }: HomeProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"match" | "price-low" | "price-high">("match");
  const [currentPage, setCurrentPage] = useState(1);
  const [inquiryProducts, setInquiryProducts] = useState<Product[]>([]);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const applyQuickPreset = (preset: "budget" | "gaming" | "student") => {
    switch (preset) {
      case "budget":
        setFilters({ ...defaultFilters, priceRange: [0, 50000] });
        setSortBy("price-low");
        break;
      case "gaming":
        setFilters({ ...defaultFilters, purpose: ["Gaming"], ram: [16, 32] });
        setSortBy("match");
        break;
      case "student":
        setFilters({ ...defaultFilters, purpose: ["Student", "Office"], priceRange: [0, 60000] });
        setSortBy("price-low");
        break;
    }
    setCurrentPage(1);
  };

  const calculateMatchScore = (product: Product): { score: number; reasons: string[] } => {
    let score = 0;
    const reasons: string[] = [];

    if (filters.purpose.length > 0) {
      const matchedPurposes = product.purpose.filter((p) => filters.purpose.includes(p as any));
      if (matchedPurposes.length > 0) {
        score += 3 * matchedPurposes.length;
        reasons.push(`Matches ${matchedPurposes.join(", ")}`);
      }
    }

    if (filters.ram.length > 0) {
      const maxRequestedRam = Math.max(...filters.ram);
      if (product.ramGb >= maxRequestedRam) {
        score += 2;
        reasons.push("Sufficient RAM");
      }
    }

    if (filters.storageType.length > 0 && filters.storageType.includes(product.storageType)) {
      score += 2;
    }

    if (filters.storageSize.length > 0) {
      const maxRequestedStorage = Math.max(...filters.storageSize);
      if (product.storageGb >= maxRequestedStorage) {
        score += 1;
      }
    }

    if (filters.brand.length > 0 && filters.brand.includes(product.brand as any)) {
      score += 1;
      reasons.push("Preferred brand");
    }

    if (product.price > filters.priceRange[1]) {
      score -= 1;
    } else if (product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]) {
      reasons.push("Within budget");
    }

    return { score, reasons };
  };

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          product.brand.toLowerCase().includes(query) ||
          product.model.toLowerCase().includes(query) ||
          product.cpu.toLowerCase().includes(query) ||
          product.purpose.some((p) => p.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      if (filters.purpose.length > 0) {
        if (!product.purpose.some((p) => filters.purpose.includes(p as any))) return false;
      }

      if (filters.ram.length > 0 && !filters.ram.includes(product.ramGb)) return false;

      if (filters.storageType.length > 0 && !filters.storageType.includes(product.storageType)) {
        return false;
      }

      if (filters.storageSize.length > 0 && !filters.storageSize.includes(product.storageGb)) {
        return false;
      }

      if (filters.screenSize.length > 0 && !filters.screenSize.includes(product.screenIn)) {
        return false;
      }

      if (filters.brand.length > 0 && !filters.brand.includes(product.brand as any)) return false;

      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      return true;
    });

    const productsWithScores = filtered.map((product) => ({
      product,
      ...calculateMatchScore(product),
    }));

    if (sortBy === "match") {
      productsWithScores.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.product.price - b.product.price;
      });
    } else if (sortBy === "price-low") {
      productsWithScores.sort((a, b) => a.product.price - b.product.price);
    } else if (sortBy === "price-high") {
      productsWithScores.sort((a, b) => b.product.price - a.product.price);
    }

    return productsWithScores;
  }, [products, filters, searchQuery, sortBy]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const handleAddToInquiry = (product: Product) => {
    if (!inquiryProducts.find((p) => p.id === product.id)) {
      setInquiryProducts([...inquiryProducts, product]);
      toast({
        title: "Added to inquiry",
        description: `${product.brand} ${product.model} added to your inquiry list.`,
      });
    } else {
      toast({
        title: "Already added",
        description: "This product is already in your inquiry list.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromInquiry = (productId: string) => {
    setInquiryProducts(inquiryProducts.filter((p) => p.id !== productId));
  };

  const handleSubmitInquiry = async (data: {
    name: string;
    phone: string;
    email: string;
    message?: string;
  }) => {
    const productIds = inquiryProducts.map(p => p.id);
    await onSubmitInquiry(data, productIds);
    setInquiryProducts([]);
    setIsInquiryOpen(false);
    toast({
      title: "Inquiry submitted!",
      description: "We'll get back to you soon with the best deals.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header inquiryCount={inquiryProducts.length} onInquiryClick={() => setIsInquiryOpen(true)} />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://source.unsplash.com/1920x600/?laptop,technology,workspace')] bg-cover bg-center opacity-5" />
        <div className="relative container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight" data-testid="text-hero-title">
              Find Your Perfect Laptop
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground" data-testid="text-hero-subtitle">
              Expert recommendations based on your needs
            </p>

            <div className="flex gap-3 md:gap-4 justify-center flex-wrap pt-4">
              <Button
                size="lg"
                variant="outline"
                className="backdrop-blur-sm bg-background/60"
                onClick={() => applyQuickPreset("budget")}
                data-testid="button-preset-budget"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Under ₹50,000
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="backdrop-blur-sm bg-background/60"
                onClick={() => applyQuickPreset("gaming")}
                data-testid="button-preset-gaming"
              >
                <Zap className="h-5 w-5 mr-2" />
                Gaming
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="backdrop-blur-sm bg-background/60"
                onClick={() => applyQuickPreset("student")}
                data-testid="button-preset-student"
              >
                <GraduationCap className="h-5 w-5 mr-2" />
                Student Starter
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <FilterPanel
            filters={filters}
            onFiltersChange={(newFilters) => {
              setFilters(newFilters);
              setCurrentPage(1);
            }}
            onClearAll={() => {
              setFilters(defaultFilters);
              setCurrentPage(1);
            }}
            productCount={filteredProducts.length}
          />

          {/* Products Grid */}
          <div className="flex-1">
            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by brand, model, or specs..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Best Match</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-[400px] rounded-xl" />
                ))}
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="text-center py-20">
                <Laptop className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2" data-testid="text-no-results">
                  No laptops found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search query
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters(defaultFilters);
                    setSearchQuery("");
                  }}
                  data-testid="button-clear-search"
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedProducts.map(({ product, score, reasons }) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      matchScore={score}
                      matchReasons={reasons}
                      onAddToInquiry={handleAddToInquiry}
                      isFavorite={favorites.includes(product.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      data-testid="button-prev-page"
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground px-4" data-testid="text-page-info">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      data-testid="button-next-page"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Inquiry Cart */}
      <InquiryCart
        open={isInquiryOpen}
        onOpenChange={setIsInquiryOpen}
        products={inquiryProducts}
        onRemoveProduct={handleRemoveFromInquiry}
        onSubmit={handleSubmitInquiry}
      />
    </div>
  );
}
