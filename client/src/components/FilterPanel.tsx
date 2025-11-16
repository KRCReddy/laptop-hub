import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X, SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  purposeOptions,
  ramOptions,
  storageTypeOptions,
  storageSizeOptions,
  screenSizeOptions,
  brandOptions,
  type Purpose,
  type Brand,
} from "@shared/schema";

export interface Filters {
  purpose: Purpose[];
  ram: number[];
  storageType: string[];
  storageSize: number[];
  screenSize: number[];
  brand: Brand[];
  priceRange: [number, number];
}

interface FilterPanelProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClearAll: () => void;
  productCount?: number;
}

function FilterContent({
  filters,
  onFiltersChange,
  onClearAll,
  productCount,
}: FilterPanelProps) {
  const toggleArrayFilter = <T extends string | number>(
    key: keyof Filters,
    value: T
  ) => {
    const current = filters[key] as T[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, [key]: updated });
  };

  const activeFiltersCount =
    filters.purpose.length +
    filters.ram.length +
    filters.storageType.length +
    filters.storageSize.length +
    filters.screenSize.length +
    filters.brand.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 200000 ? 1 : 0);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="font-semibold text-lg">Filters</h2>
          {productCount !== undefined && (
            <p className="text-sm text-muted-foreground" data-testid="text-product-count">
              {productCount} laptops found
            </p>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            data-testid="button-clear-filters"
          >
            Clear All
          </Button>
        )}
      </div>

      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 p-4 border-b">
          {filters.purpose.map((p) => (
            <Badge key={p} variant="secondary" className="gap-1" data-testid={`badge-filter-purpose-${p}`}>
              {p}
              <X
                className="h-3 w-3 cursor-pointer hover-elevate"
                onClick={() => toggleArrayFilter("purpose", p)}
              />
            </Badge>
          ))}
          {filters.brand.map((b) => (
            <Badge key={b} variant="secondary" className="gap-1" data-testid={`badge-filter-brand-${b}`}>
              {b}
              <X
                className="h-3 w-3 cursor-pointer hover-elevate"
                onClick={() => toggleArrayFilter("brand", b)}
              />
            </Badge>
          ))}
          {filters.ram.map((r) => (
            <Badge key={r} variant="secondary" className="gap-1" data-testid={`badge-filter-ram-${r}`}>
              {r}GB RAM
              <X
                className="h-3 w-3 cursor-pointer hover-elevate"
                onClick={() => toggleArrayFilter("ram", r)}
              />
            </Badge>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <Accordion type="multiple" defaultValue={["purpose", "brand", "price"]} className="w-full">
          <AccordionItem value="purpose">
            <AccordionTrigger className="px-4">Purpose</AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3">
                {purposeOptions.map((purpose) => (
                  <div key={purpose} className="flex items-center space-x-2">
                    <Checkbox
                      id={`purpose-${purpose}`}
                      checked={filters.purpose.includes(purpose)}
                      onCheckedChange={() => toggleArrayFilter("purpose", purpose)}
                      data-testid={`checkbox-purpose-${purpose}`}
                    />
                    <Label
                      htmlFor={`purpose-${purpose}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {purpose}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="brand">
            <AccordionTrigger className="px-4">Brand</AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3">
                {brandOptions.map((brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand}`}
                      checked={filters.brand.includes(brand)}
                      onCheckedChange={() => toggleArrayFilter("brand", brand)}
                      data-testid={`checkbox-brand-${brand}`}
                    />
                    <Label
                      htmlFor={`brand-${brand}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {brand}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price">
            <AccordionTrigger className="px-4">Price Range</AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                <Slider
                  min={0}
                  max={200000}
                  step={5000}
                  value={filters.priceRange}
                  onValueChange={(value) =>
                    onFiltersChange({ ...filters, priceRange: value as [number, number] })
                  }
                  data-testid="slider-price-range"
                />
                <div className="flex items-center justify-between text-sm">
                  <span data-testid="text-price-min">₹{filters.priceRange[0].toLocaleString("en-IN")}</span>
                  <span data-testid="text-price-max">₹{filters.priceRange[1].toLocaleString("en-IN")}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ram">
            <AccordionTrigger className="px-4">RAM</AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3">
                {ramOptions.map((ram) => (
                  <div key={ram} className="flex items-center space-x-2">
                    <Checkbox
                      id={`ram-${ram}`}
                      checked={filters.ram.includes(ram)}
                      onCheckedChange={() => toggleArrayFilter("ram", ram)}
                      data-testid={`checkbox-ram-${ram}`}
                    />
                    <Label htmlFor={`ram-${ram}`} className="text-sm cursor-pointer flex-1">
                      {ram}GB
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="storage">
            <AccordionTrigger className="px-4">Storage</AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">
                    Type
                  </Label>
                  <div className="space-y-3">
                    {storageTypeOptions.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`storage-type-${type}`}
                          checked={filters.storageType.includes(type)}
                          onCheckedChange={() => toggleArrayFilter("storageType", type)}
                          data-testid={`checkbox-storage-type-${type}`}
                        />
                        <Label
                          htmlFor={`storage-type-${type}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">
                    Size
                  </Label>
                  <div className="space-y-3">
                    {storageSizeOptions.map((size) => (
                      <div key={size} className="flex items-center space-x-2">
                        <Checkbox
                          id={`storage-size-${size}`}
                          checked={filters.storageSize.includes(size)}
                          onCheckedChange={() => toggleArrayFilter("storageSize", size)}
                          data-testid={`checkbox-storage-size-${size}`}
                        />
                        <Label
                          htmlFor={`storage-size-${size}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {size}GB
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="screen">
            <AccordionTrigger className="px-4">Screen Size</AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3">
                {screenSizeOptions.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={`screen-${size}`}
                      checked={filters.screenSize.includes(size)}
                      onCheckedChange={() => toggleArrayFilter("screenSize", size)}
                      data-testid={`checkbox-screen-${size}`}
                    />
                    <Label htmlFor={`screen-${size}`} className="text-sm cursor-pointer flex-1">
                      {size}" display
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

export function FilterPanel(props: FilterPanelProps) {
  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full" data-testid="button-mobile-filters">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {props.filters.purpose.length +
                props.filters.brand.length +
                props.filters.ram.length >
                0 && (
                <Badge variant="secondary" className="ml-2">
                  {props.filters.purpose.length +
                    props.filters.brand.length +
                    props.filters.ram.length}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:max-w-md p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <FilterContent {...props} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-[280px] border rounded-md bg-card overflow-hidden">
        <FilterContent {...props} />
      </div>
    </>
  );
}
