import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertInquirySchema } from "@shared/schema";
import { z } from "zod";

const ADMIN_PASSWORD = process.env.VITE_ADMIN_PASSWORD || "admin123";

function requireAdminAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

function calculateMatchScore(
  product: any,
  filters: {
    purpose?: string[];
    ram?: number[];
    storageType?: string[];
    storageSize?: number[];
    brand?: string[];
    priceMin?: number;
    priceMax?: number;
  }
): number {
  let score = 0;

  if (filters.purpose && filters.purpose.length > 0) {
    const matchedPurposes = product.purpose.filter((p: string) =>
      filters.purpose!.includes(p)
    );
    if (matchedPurposes.length > 0) {
      score += 3 * matchedPurposes.length;
    }
  }

  if (filters.ram && filters.ram.length > 0) {
    const maxRequestedRam = Math.max(...filters.ram);
    if (product.ramGb >= maxRequestedRam) {
      score += 2;
    }
  }

  if (
    filters.storageType &&
    filters.storageType.length > 0 &&
    filters.storageType.includes(product.storageType)
  ) {
    score += 2;
  }

  if (filters.storageSize && filters.storageSize.length > 0) {
    const maxRequestedStorage = Math.max(...filters.storageSize);
    if (product.storageGb >= maxRequestedStorage) {
      score += 1;
    }
  }

  if (filters.brand && filters.brand.length > 0 && filters.brand.includes(product.brand)) {
    score += 1;
  }

  if (filters.priceMax !== undefined && product.price > filters.priceMax) {
    score -= 1;
  }

  return score;
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/products", async (req, res) => {
    try {
      let products = await storage.getAllProducts();

      const {
        purpose,
        ram,
        storageType,
        storageSize,
        screenSize,
        brand,
        minPrice,
        maxPrice,
        q,
        sort,
        page,
        limit,
      } = req.query;

      const purposeArray = purpose ? (Array.isArray(purpose) ? purpose : [purpose]) : [];
      const ramArray = ram ? (Array.isArray(ram) ? ram.map(Number) : [Number(ram)]) : [];
      const storageTypeArray = storageType
        ? Array.isArray(storageType)
          ? storageType
          : [storageType]
        : [];
      const storageSizeArray = storageSize
        ? Array.isArray(storageSize)
          ? storageSize.map(Number)
          : [Number(storageSize)]
        : [];
      const screenSizeArray = screenSize
        ? Array.isArray(screenSize)
          ? screenSize.map(Number)
          : [Number(screenSize)]
        : [];
      const brandArray = brand ? (Array.isArray(brand) ? brand : [brand]) : [];
      const priceMin = minPrice ? Number(minPrice) : 0;
      const priceMax = maxPrice ? Number(maxPrice) : Number.MAX_VALUE;

      products = products.filter((product) => {
        if (q) {
          const query = String(q).toLowerCase();
          const matchesSearch =
            product.brand.toLowerCase().includes(query) ||
            product.model.toLowerCase().includes(query) ||
            product.cpu.toLowerCase().includes(query) ||
            product.purpose.some((p) => p.toLowerCase().includes(query));
          if (!matchesSearch) return false;
        }

        if (purposeArray.length > 0) {
          if (!product.purpose.some((p) => purposeArray.includes(p))) return false;
        }

        if (ramArray.length > 0 && !ramArray.includes(product.ramGb)) return false;

        if (storageTypeArray.length > 0 && !storageTypeArray.includes(product.storageType)) {
          return false;
        }

        if (storageSizeArray.length > 0 && !storageSizeArray.includes(product.storageGb)) {
          return false;
        }

        if (screenSizeArray.length > 0 && !screenSizeArray.includes(product.screenIn)) {
          return false;
        }

        if (brandArray.length > 0 && !brandArray.includes(product.brand)) return false;

        if (product.price < priceMin || product.price > priceMax) {
          return false;
        }

        return true;
      });

      const filters = {
        purpose: purposeArray,
        ram: ramArray,
        storageType: storageTypeArray,
        storageSize: storageSizeArray,
        brand: brandArray,
        priceMin,
        priceMax,
      };

      const productsWithScores = products.map((product) => ({
        ...product,
        matchScore: calculateMatchScore(product, filters),
      }));

      if (sort === "match" || !sort) {
        productsWithScores.sort((a, b) => {
          if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
          return a.price - b.price;
        });
      } else if (sort === "price-low") {
        productsWithScores.sort((a, b) => a.price - b.price);
      } else if (sort === "price-high") {
        productsWithScores.sort((a, b) => b.price - a.price);
      }

      const pageNum = page ? Number(page) : 1;
      const limitNum = limit ? Number(limit) : 8;
      const start = (pageNum - 1) * limitNum;
      const end = start + limitNum;
      const paginatedProducts = productsWithScores.slice(start, end);

      res.json(paginatedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/inquiries", async (req, res) => {
    try {
      const validated = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(validated);
      res.status(201).json(inquiry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid inquiry data", details: error.errors });
      }
      console.error("Error creating inquiry:", error);
      res.status(500).json({ error: "Failed to create inquiry" });
    }
  });

  app.post("/api/admin/login", async (req, res) => {
    try {
      const { password } = req.body;
      if (password === ADMIN_PASSWORD) {
        res.json({ success: true, token: ADMIN_PASSWORD });
      } else {
        res.status(401).json({ error: "Invalid password" });
      }
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/admin/inquiries", requireAdminAuth, async (req, res) => {
    try {
      const inquiries = await storage.getAllInquiries();
      res.json(inquiries);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      res.status(500).json({ error: "Failed to fetch inquiries" });
    }
  });

  app.post("/api/admin/products", requireAdminAuth, async (req, res) => {
    try {
      const validated = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validated);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid product data", details: error.errors });
      }
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/admin/products/:id", requireAdminAuth, async (req, res) => {
    try {
      const partialProductSchema = insertProductSchema.partial();
      const validated = partialProductSchema.parse(req.body);
      const product = await storage.updateProduct(req.params.id, validated);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid product data", details: error.errors });
      }
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", requireAdminAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
