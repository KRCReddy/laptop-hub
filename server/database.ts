import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = path.join(__dirname, "..", "laptops.db");
export const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    price REAL NOT NULL,
    ram_gb INTEGER NOT NULL,
    storage_type TEXT NOT NULL,
    storage_gb INTEGER NOT NULL,
    cpu TEXT NOT NULL,
    purpose TEXT NOT NULL,
    screen_in REAL NOT NULL,
    gpu TEXT,
    images TEXT NOT NULL,
    description TEXT NOT NULL,
    availability TEXT NOT NULL DEFAULT 'In Stock'
  );

  CREATE TABLE IF NOT EXISTS inquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT,
    product_ids TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log("Database initialized at:", dbPath);
