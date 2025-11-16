import { Product } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cpu, HardDrive, Monitor, MemoryStick, Plus, Star } from "lucide-react";
import { Link } from "wouter";

interface ProductCardProps {
  product: Product;
  matchScore?: number;
  matchReasons?: string[];
  onAddToInquiry: (product: Product) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
}

export function ProductCard({
  product,
  matchScore,
  matchReasons,
  onAddToInquiry,
  isFavorite,
  onToggleFavorite,
}: ProductCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden hover-elevate transition-all duration-200" data-testid={`card-product-${product.id}`}>
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted cursor-pointer">
          <img
            src={product.images[0] || `https://source.unsplash.com/400x400/?laptop,${product.brand}`}
            alt={`${product.brand} ${product.model}`}
            className="w-full h-full object-cover"
            data-testid={`img-product-${product.id}`}
          />
          {matchScore !== undefined && matchScore > 5 && (
            <Badge
              className="absolute top-2 right-2 bg-primary text-primary-foreground"
              data-testid={`badge-match-${product.id}`}
            >
              Best Match
            </Badge>
          )}
          {product.purpose.slice(0, 2).map((purpose, idx) => (
            <Badge
              key={purpose}
              variant="secondary"
              className="absolute top-2 left-2"
              style={{ top: `${8 + idx * 32}px` }}
              data-testid={`badge-purpose-${product.id}-${idx}`}
            >
              {purpose}
            </Badge>
          ))}
        </div>
      </Link>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/product/${product.id}`} className="flex-1 min-w-0">
            <div className="cursor-pointer">
              <h3 className="font-semibold text-lg line-clamp-2 leading-tight" data-testid={`text-product-name-${product.id}`}>
                {product.brand} {product.model}
              </h3>
              {matchReasons && matchReasons.length > 0 && (
                <p className="text-sm text-muted-foreground mt-1" data-testid={`text-match-reason-${product.id}`}>
                  {matchReasons[0]}
                </p>
              )}
            </div>
          </Link>
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 h-8 w-8"
              onClick={() => onToggleFavorite(product.id)}
              data-testid={`button-favorite-${product.id}`}
            >
              <Star className={`h-4 w-4 ${isFavorite ? "fill-primary text-primary" : ""}`} />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MemoryStick className="h-4 w-4 shrink-0" />
            <span data-testid={`text-ram-${product.id}`}>{product.ramGb}GB RAM</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <HardDrive className="h-4 w-4 shrink-0" />
            <span data-testid={`text-storage-${product.id}`}>{product.storageGb}GB {product.storageType}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Cpu className="h-4 w-4 shrink-0" />
            <span className="truncate" data-testid={`text-cpu-${product.id}`}>{product.cpu.split(" ").slice(0, 2).join(" ")}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Monitor className="h-4 w-4 shrink-0" />
            <span data-testid={`text-screen-${product.id}`}>{product.screenIn}"</span>
          </div>
        </div>

        <div className="mt-auto pt-3 border-t flex items-center justify-between gap-2">
          <div className="text-2xl font-bold text-primary" data-testid={`text-price-${product.id}`}>
            ₹{product.price.toLocaleString("en-IN")}
          </div>
          <Button
            size="sm"
            onClick={() => onAddToInquiry(product)}
            data-testid={`button-add-inquiry-${product.id}`}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
}
