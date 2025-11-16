import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Product } from "@shared/schema";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { InquiryCart } from "@/components/InquiryCart";
import {
  Cpu,
  HardDrive,
  Monitor,
  MemoryStick,
  ChevronLeft,
  Plus,
  Check,
  Star,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductDetailProps {
  products: Product[];
  onSubmitInquiry: (data: { name: string; phone: string; email: string; message?: string }, productIds: string[]) => Promise<void>;
}

export default function ProductDetail({ products, onSubmitInquiry }: ProductDetailProps) {
  const [, params] = useRoute("/product/:id");
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [inquiryProducts, setInquiryProducts] = useState<Product[]>([]);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const product = products.find((p) => p.id === params?.id);

  useEffect(() => {
    if (product) {
      const stored = localStorage.getItem("favorites");
      if (stored) {
        const favorites = JSON.parse(stored);
        setIsFavorite(favorites.includes(product.id));
      }
    }
  }, [product]);

  const toggleFavorite = () => {
    if (!product) return;
    const stored = localStorage.getItem("favorites");
    const favorites = stored ? JSON.parse(stored) : [];
    const updated = isFavorite
      ? favorites.filter((id: string) => id !== product.id)
      : [...favorites, product.id];
    localStorage.setItem("favorites", JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  };

  const similarProducts = product
    ? products
        .filter((p) => {
          if (p.id === product.id) return false;
          return (
            p.purpose.some((purpose) => product.purpose.includes(purpose)) ||
            p.brand === product.brand ||
            Math.abs(p.price - product.price) < 20000
          );
        })
        .slice(0, 4)
    : [];

  const handleAddToInquiry = (prod: Product) => {
    if (!inquiryProducts.find((p) => p.id === prod.id)) {
      setInquiryProducts([...inquiryProducts, prod]);
      toast({
        title: "Added to inquiry",
        description: `${prod.brand} ${prod.model} added to your inquiry list.`,
      });
    }
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

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header inquiryCount={inquiryProducts.length} onInquiryClick={() => setIsInquiryOpen(true)} />
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images.length > 0
    ? product.images
    : Array(4).fill(`https://source.unsplash.com/800x800/?laptop,${product.brand}`);

  return (
    <div className="min-h-screen bg-background">
      <Header inquiryCount={inquiryProducts.length} onInquiryClick={() => setIsInquiryOpen(true)} />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Search
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
              <img
                src={images[selectedImage]}
                alt={`${product.brand} ${product.model}`}
                className="w-full h-full object-cover"
                data-testid="img-main-product"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {images.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                    selectedImage === idx ? "border-primary" : "border-transparent"
                  }`}
                  data-testid={`button-image-${idx}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-product-name">
                    {product.brand} {product.model}
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    {product.purpose.map((purpose) => (
                      <Badge key={purpose} variant="secondary" data-testid={`badge-purpose-${purpose}`}>
                        {purpose}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFavorite}
                  data-testid="button-favorite"
                >
                  <Star className={`h-5 w-5 ${isFavorite ? "fill-primary text-primary" : ""}`} />
                </Button>
              </div>
            </div>

            <div className="text-3xl md:text-4xl font-bold text-primary" data-testid="text-price">
              ₹{product.price.toLocaleString("en-IN")}
            </div>

            <p className="text-muted-foreground leading-relaxed" data-testid="text-description">
              {product.description}
            </p>

            {/* Specs Grid */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Specifications</h3>
              <div className="grid gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <Cpu className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Processor
                    </div>
                    <div className="font-medium" data-testid="text-spec-cpu">{product.cpu}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <MemoryStick className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Memory
                    </div>
                    <div className="font-medium" data-testid="text-spec-ram">{product.ramGb}GB RAM</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <HardDrive className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Storage
                    </div>
                    <div className="font-medium" data-testid="text-spec-storage">
                      {product.storageGb}GB {product.storageType}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <Monitor className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Display
                    </div>
                    <div className="font-medium" data-testid="text-spec-screen">{product.screenIn}" Screen</div>
                  </div>
                </div>

                {product.gpu && (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <Cpu className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">
                        Graphics
                      </div>
                      <div className="font-medium" data-testid="text-spec-gpu">{product.gpu}</div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={() => handleAddToInquiry(product)}
                data-testid="button-add-to-inquiry"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add to Inquiry
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setIsInquiryOpen(true)}
                data-testid="button-contact"
              >
                Contact Us
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-primary" />
              <span data-testid="text-availability">{product.availability}</span>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-display font-bold mb-6">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((similar) => (
                <Link key={similar.id} href={`/product/${similar.id}`}>
                  <Card className="overflow-hidden hover-elevate cursor-pointer transition-all" data-testid={`card-similar-${similar.id}`}>
                    <div className="aspect-square bg-muted">
                      <img
                        src={similar.images[0] || `https://source.unsplash.com/400x400/?laptop,${similar.brand}`}
                        alt={similar.model}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold line-clamp-1 mb-2">
                        {similar.brand} {similar.model}
                      </h3>
                      <div className="text-lg font-bold text-primary">
                        ₹{similar.price.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <InquiryCart
        open={isInquiryOpen}
        onOpenChange={setIsInquiryOpen}
        products={inquiryProducts}
        onRemoveProduct={(id) => setInquiryProducts(inquiryProducts.filter((p) => p.id !== id))}
        onSubmit={handleSubmitInquiry}
      />
    </div>
  );
}
