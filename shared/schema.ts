import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  price: real("price").notNull(),
  ramGb: integer("ram_gb").notNull(),
  storageType: text("storage_type").notNull(),
  storageGb: integer("storage_gb").notNull(),
  cpu: text("cpu").notNull(),
  purpose: text("purpose").array().notNull(),
  screenIn: real("screen_in").notNull(),
  gpu: text("gpu"),
  images: text("images").array().notNull(),
  description: text("description").notNull(),
  availability: text("availability").notNull().default("In Stock"),
});

export const inquiries = pgTable("inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  message: text("message"),
  productIds: text("product_ids").array().notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiries.$inferSelect;

// Filter types for frontend
export const purposeOptions = ["Office", "Student", "Gaming", "Content Creation", "Business"] as const;
export const ramOptions = [4, 8, 16, 32, 64] as const;
export const storageTypeOptions = ["SSD", "HDD", "SSD+HDD"] as const;
export const storageSizeOptions = [128, 256, 512, 1024, 2048] as const;
export const screenSizeOptions = [13, 14, 15, 15.6, 17] as const;
export const brandOptions = ["Dell", "HP", "Lenovo", "Asus", "Acer", "Apple", "MSI", "Razer"] as const;

export type Purpose = typeof purposeOptions[number];
export type Brand = typeof brandOptions[number];
