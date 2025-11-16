import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import ProductDetail from "@/pages/ProductDetail";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";
import { Product, Inquiry, InsertProduct } from "@shared/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

function Router() {
  const [location, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (password: string): Promise<boolean> => {
    try {
      const response = await apiRequest("POST", "/api/admin/login", { password });
      if (response.success && response.token) {
        setIsAuthenticated(true);
        sessionStorage.setItem("admin_auth", "true");
        sessionStorage.setItem("admin_token", response.token);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_auth");
    sessionStorage.removeItem("admin_token");
    setLocation("/admin");
  };

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products?limit=1000"],
  });

  const { data: inquiries = [] } = useQuery<Inquiry[]>({
    queryKey: ["/api/admin/inquiries"],
    enabled: isAuthenticated,
  });

  const submitInquiryMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      phone: string;
      email: string;
      message?: string;
      productIds: string[];
    }) => {
      return await apiRequest("POST", "/api/inquiries", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/inquiries"] });
    },
  });

  const addProductMutation = useMutation({
    mutationFn: async (product: InsertProduct) => {
      return await apiRequest("POST", "/api/admin/products", product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products?limit=1000"] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, product }: { id: string; product: Partial<Product> }) => {
      return await apiRequest("PUT", `/api/admin/products/${id}`, product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products?limit=1000"] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products?limit=1000"] });
    },
  });

  const handleSubmitInquiry = async (
    data: {
      name: string;
      phone: string;
      email: string;
      message?: string;
    },
    productIds: string[]
  ) => {
    await submitInquiryMutation.mutateAsync({
      ...data,
      productIds,
    });
  };

  return (
    <Switch>
      <Route path="/">
        <Home
          products={products}
          isLoading={productsLoading}
          onSubmitInquiry={handleSubmitInquiry}
        />
      </Route>
      <Route path="/product/:id">
        <ProductDetail products={products} onSubmitInquiry={handleSubmitInquiry} />
      </Route>
      <Route path="/admin">
        <AdminLogin onLogin={handleLogin} />
      </Route>
      <Route path="/admin/dashboard">
        {isAuthenticated ? (
          <AdminDashboard
            products={products}
            inquiries={inquiries}
            onAddProduct={(product) => addProductMutation.mutateAsync(product)}
            onUpdateProduct={(id, product) => updateProductMutation.mutateAsync({ id, product })}
            onDeleteProduct={(id) => deleteProductMutation.mutateAsync(id)}
            onLogout={handleLogout}
          />
        ) : (
          <AdminLogin onLogin={handleLogin} />
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
