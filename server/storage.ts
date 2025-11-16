import { type Product, type Inquiry, type InsertProduct, type InsertInquiry } from "@shared/schema";
import { db } from "./database";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  getAllInquiries(): Promise<Inquiry[]>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
}

export class SqliteStorage implements IStorage {
  async getAllProducts(): Promise<Product[]> {
    const rows = db.prepare("SELECT * FROM products").all() as any[];
    return rows.map(this.rowToProduct);
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as any;
    return row ? this.rowToProduct(row) : undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = randomUUID();
    db.prepare(`
      INSERT INTO products (
        id, brand, model, price, ram_gb, storage_type, storage_gb,
        cpu, purpose, screen_in, gpu, images, description, availability
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      product.brand,
      product.model,
      product.price,
      product.ramGb,
      product.storageType,
      product.storageGb,
      product.cpu,
      JSON.stringify(product.purpose),
      product.screenIn,
      product.gpu || null,
      JSON.stringify(product.images),
      product.description,
      product.availability
    );

    const created = await this.getProductById(id);
    if (!created) throw new Error("Failed to create product");
    return created;
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product | undefined> {
    const existing = await this.getProductById(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...product };
    db.prepare(`
      UPDATE products SET
        brand = ?, model = ?, price = ?, ram_gb = ?, storage_type = ?,
        storage_gb = ?, cpu = ?, purpose = ?, screen_in = ?, gpu = ?,
        images = ?, description = ?, availability = ?
      WHERE id = ?
    `).run(
      updated.brand,
      updated.model,
      updated.price,
      updated.ramGb,
      updated.storageType,
      updated.storageGb,
      updated.cpu,
      JSON.stringify(updated.purpose),
      updated.screenIn,
      updated.gpu || null,
      JSON.stringify(updated.images),
      updated.description,
      updated.availability,
      id
    );

    return this.getProductById(id);
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = db.prepare("DELETE FROM products WHERE id = ?").run(id);
    return result.changes > 0;
  }

  async getAllInquiries(): Promise<Inquiry[]> {
    const rows = db.prepare("SELECT * FROM inquiries ORDER BY created_at DESC").all() as any[];
    return rows.map(this.rowToInquiry);
  }

  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const id = randomUUID();
    const createdAt = new Date().toISOString();

    db.prepare(`
      INSERT INTO inquiries (id, name, phone, email, message, product_ids, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      inquiry.name,
      inquiry.phone,
      inquiry.email,
      inquiry.message || null,
      JSON.stringify(inquiry.productIds),
      createdAt
    );

    const row = db.prepare("SELECT * FROM inquiries WHERE id = ?").get(id) as any;
    return this.rowToInquiry(row);
  }

  private rowToProduct(row: any): Product {
    return {
      id: row.id,
      brand: row.brand,
      model: row.model,
      price: row.price,
      ramGb: row.ram_gb,
      storageType: row.storage_type,
      storageGb: row.storage_gb,
      cpu: row.cpu,
      purpose: JSON.parse(row.purpose),
      screenIn: row.screen_in,
      gpu: row.gpu,
      images: JSON.parse(row.images),
      description: row.description,
      availability: row.availability,
    };
  }

  private rowToInquiry(row: any): Inquiry {
    return {
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email,
      message: row.message,
      productIds: JSON.parse(row.product_ids),
      createdAt: row.created_at,
    };
  }
}

export const storage = new SqliteStorage();
