import { useState } from "react";
import { Product, InsertProduct, Inquiry } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Edit,
  Trash2,
  Laptop,
  MessageSquare,
  LogOut,
  Package,
  Mail,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { purposeOptions, brandOptions } from "@shared/schema";

interface AdminDashboardProps {
  products: Product[];
  inquiries: Inquiry[];
  onAddProduct: (product: InsertProduct) => Promise<void>;
  onUpdateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onLogout: () => void;
}

export default function AdminDashboard({
  products,
  inquiries,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onLogout,
}: AdminDashboardProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Partial<InsertProduct>>({
    brand: "",
    model: "",
    price: 0,
    ramGb: 8,
    storageType: "SSD",
    storageGb: 512,
    cpu: "",
    purpose: [],
    screenIn: 15.6,
    gpu: "",
    images: [],
    description: "",
    availability: "In Stock",
  });

  const handleLogout = () => {
    onLogout();
    setLocation("/admin");
  };

  const resetForm = () => {
    setProductForm({
      brand: "",
      model: "",
      price: 0,
      ramGb: 8,
      storageType: "SSD",
      storageGb: 512,
      cpu: "",
      purpose: [],
      screenIn: 15.6,
      gpu: "",
      images: [],
      description: "",
      availability: "In Stock",
    });
  };

  const handleAddProduct = async () => {
    try {
      await onAddProduct(productForm as InsertProduct);
      toast({
        title: "Product added",
        description: "The product has been added successfully.",
      });
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    try {
      await onUpdateProduct(editingProduct.id, productForm as Partial<Product>);
      toast({
        title: "Product updated",
        description: "The product has been updated successfully.",
      });
      setEditingProduct(null);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProductId) return;
    try {
      await onDeleteProduct(deletingProductId);
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully.",
      });
      setDeletingProductId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      brand: product.brand,
      model: product.model,
      price: product.price,
      ramGb: product.ramGb,
      storageType: product.storageType,
      storageGb: product.storageGb,
      cpu: product.cpu,
      purpose: product.purpose,
      screenIn: product.screenIn,
      gpu: product.gpu || "",
      images: product.images,
      description: product.description,
      availability: product.availability,
    });
  };

  const togglePurpose = (purpose: string) => {
    const current = productForm.purpose || [];
    setProductForm({
      ...productForm,
      purpose: current.includes(purpose)
        ? current.filter((p) => p !== purpose)
        : [...current, purpose],
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-display font-bold">Admin Dashboard</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} data-testid="button-logout">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                <Laptop className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold" data-testid="text-total-products">{products.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Inquiries</p>
                <p className="text-2xl font-bold" data-testid="text-total-inquiries">{inquiries.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">New Inquiries</p>
                <p className="text-2xl font-bold">{inquiries.filter((i) => new Date(i.createdAt) > new Date(Date.now() - 86400000)).length}</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products" data-testid="tab-products">
              <Laptop className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="inquiries" data-testid="tab-inquiries">
              <MessageSquare className="h-4 w-4 mr-2" />
              Inquiries
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Products</h2>
              <Dialog open={isAddDialogOpen || editingProduct !== null} onOpenChange={(open) => {
                if (!open) {
                  setIsAddDialogOpen(false);
                  setEditingProduct(null);
                  resetForm();
                }
              }}>
                <DialogTrigger asChild>
                  <Button onClick={() => setIsAddDialogOpen(true)} data-testid="button-add-product">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct ? "Edit Product" : "Add New Product"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingProduct
                        ? "Update the product details below."
                        : "Fill in the details to add a new product."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                          id="brand"
                          value={productForm.brand}
                          onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                          data-testid="input-product-brand"
                        />
                      </div>
                      <div>
                        <Label htmlFor="model">Model</Label>
                        <Input
                          id="model"
                          value={productForm.model}
                          onChange={(e) => setProductForm({ ...productForm, model: e.target.value })}
                          data-testid="input-product-model"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Purpose</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {purposeOptions.map((purpose) => (
                          <div key={purpose} className="flex items-center space-x-2">
                            <Checkbox
                              id={`purpose-${purpose}`}
                              checked={productForm.purpose?.includes(purpose)}
                              onCheckedChange={() => togglePurpose(purpose)}
                              data-testid={`checkbox-product-purpose-${purpose}`}
                            />
                            <Label htmlFor={`purpose-${purpose}`} className="text-sm cursor-pointer">
                              {purpose}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                          data-testid="input-product-price"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ram">RAM (GB)</Label>
                        <Input
                          id="ram"
                          type="number"
                          value={productForm.ramGb}
                          onChange={(e) => setProductForm({ ...productForm, ramGb: parseInt(e.target.value) })}
                          data-testid="input-product-ram"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="storageType">Storage Type</Label>
                        <Input
                          id="storageType"
                          value={productForm.storageType}
                          onChange={(e) => setProductForm({ ...productForm, storageType: e.target.value })}
                          data-testid="input-product-storage-type"
                        />
                      </div>
                      <div>
                        <Label htmlFor="storageSize">Storage Size (GB)</Label>
                        <Input
                          id="storageSize"
                          type="number"
                          value={productForm.storageGb}
                          onChange={(e) => setProductForm({ ...productForm, storageGb: parseInt(e.target.value) })}
                          data-testid="input-product-storage-size"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cpu">CPU</Label>
                        <Input
                          id="cpu"
                          value={productForm.cpu}
                          onChange={(e) => setProductForm({ ...productForm, cpu: e.target.value })}
                          data-testid="input-product-cpu"
                        />
                      </div>
                      <div>
                        <Label htmlFor="screen">Screen Size (inches)</Label>
                        <Input
                          id="screen"
                          type="number"
                          step="0.1"
                          value={productForm.screenIn}
                          onChange={(e) => setProductForm({ ...productForm, screenIn: parseFloat(e.target.value) })}
                          data-testid="input-product-screen"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="gpu">GPU (Optional)</Label>
                      <Input
                        id="gpu"
                        value={productForm.gpu}
                        onChange={(e) => setProductForm({ ...productForm, gpu: e.target.value })}
                        data-testid="input-product-gpu"
                      />
                    </div>

                    <div>
                      <Label htmlFor="images">Image URLs (comma-separated)</Label>
                      <Input
                        id="images"
                        value={productForm.images?.join(", ")}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            images: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                        data-testid="input-product-images"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        rows={3}
                        data-testid="textarea-product-description"
                      />
                    </div>

                    <div>
                      <Label htmlFor="availability">Availability</Label>
                      <Input
                        id="availability"
                        value={productForm.availability}
                        onChange={(e) => setProductForm({ ...productForm, availability: e.target.value })}
                        data-testid="input-product-availability"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        setEditingProduct(null);
                        resetForm();
                      }}
                      data-testid="button-cancel-product"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                      data-testid="button-save-product"
                    >
                      {editingProduct ? "Update" : "Add"} Product
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Brand</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Specs</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id} data-testid={`row-product-${product.id}`}>
                      <TableCell className="font-medium">{product.brand}</TableCell>
                      <TableCell>{product.model}</TableCell>
                      <TableCell>₹{product.price.toLocaleString("en-IN")}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {product.ramGb}GB RAM, {product.storageGb}GB {product.storageType}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {product.purpose.slice(0, 2).map((p) => (
                            <Badge key={p} variant="secondary" className="text-xs">
                              {p}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(product)}
                            data-testid={`button-edit-${product.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeletingProductId(product.id)}
                            data-testid={`button-delete-${product.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="inquiries">
            <h2 className="text-2xl font-bold mb-4">Inquiries</h2>
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <Card key={inquiry.id} className="p-6" data-testid={`card-inquiry-${inquiry.id}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg" data-testid={`text-inquiry-name-${inquiry.id}`}>{inquiry.name}</h3>
                      <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                        <span data-testid={`text-inquiry-email-${inquiry.id}`}>{inquiry.email}</span>
                        <span data-testid={`text-inquiry-phone-${inquiry.id}`}>{inquiry.phone}</span>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                  {inquiry.message && (
                    <p className="text-sm mb-4 text-muted-foreground" data-testid={`text-inquiry-message-${inquiry.id}`}>
                      {inquiry.message}
                    </p>
                  )}
                  <div>
                    <p className="text-sm font-medium mb-2">Interested Products:</p>
                    <div className="flex flex-wrap gap-2">
                      {inquiry.productIds.map((pid) => {
                        const product = products.find((p) => p.id === pid);
                        return product ? (
                          <Badge key={pid} variant="outline">
                            {product.brand} {product.model}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                </Card>
              ))}
              {inquiries.length === 0 && (
                <Card className="p-12 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground" data-testid="text-no-inquiries">No inquiries yet</p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={deletingProductId !== null} onOpenChange={() => setDeletingProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} data-testid="button-confirm-delete">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
