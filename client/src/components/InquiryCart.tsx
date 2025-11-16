import { useState } from "react";
import { Product } from "@shared/schema";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const inquiryFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email"),
  message: z.string().optional(),
});

type InquiryFormData = z.infer<typeof inquiryFormSchema>;

interface InquiryCartProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
  onRemoveProduct: (productId: string) => void;
  onSubmit: (data: InquiryFormData) => Promise<void>;
}

export function InquiryCart({
  open,
  onOpenChange,
  products,
  onRemoveProduct,
  onSubmit,
}: InquiryCartProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InquiryFormData>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  const handleSubmit = async (data: InquiryFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalValue = products.reduce((sum, p) => sum + p.price, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Inquiry Cart ({products.length})</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground" data-testid="text-empty-cart">
                No products added yet
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Browse our collection and add laptops to inquire
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex gap-3 p-3 border rounded-md hover-elevate"
                    data-testid={`cart-item-${product.id}`}
                  >
                    <img
                      src={product.images[0] || `https://source.unsplash.com/100x100/?laptop,${product.brand}`}
                      alt={product.model}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-1" data-testid={`text-cart-product-${product.id}`}>
                        {product.brand} {product.model}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {product.ramGb}GB RAM, {product.storageGb}GB {product.storageType}
                      </p>
                      <p className="text-sm font-semibold text-primary mt-1">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 h-8 w-8"
                      onClick={() => onRemoveProduct(product.id)}
                      data-testid={`button-remove-${product.id}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm text-muted-foreground">Total Value</span>
                  <span className="text-xl font-bold" data-testid="text-total-value">
                    ₹{totalValue.toLocaleString("en-IN")}
                  </span>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} data-testid="input-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Your phone number" {...field} data-testid="input-phone" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your.email@example.com"
                              {...field}
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any specific requirements or questions?"
                              {...field}
                              data-testid="textarea-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                      data-testid="button-submit-inquiry"
                    >
                      {isSubmitting ? (
                        "Submitting..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Inquiry
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
