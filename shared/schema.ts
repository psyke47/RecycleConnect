import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles
export enum UserRole {
  COLLECTOR = "collector",
  TRANSPORTER = "transporter",
  BUYER = "buyer"
}

// Material types
export enum MaterialType {
  PAPER = "paper",
  CARDBOARD = "cardboard",
  PLASTIC = "plastic",
  GLASS = "glass",
  METAL = "metal",
  EWASTE = "e-waste",
  ORGANIC = "organic"
}

// Material status
export enum ListingStatus {
  AVAILABLE = "available",
  PENDING_PICKUP = "pending_pickup",
  IN_TRANSIT = "in_transit",
  DELIVERED = "delivered",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

// Transaction status
export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  role: text("role").$type<UserRole>().notNull(),
  profileComplete: boolean("profile_complete").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

// Waste listings table
export const wasteListings = pgTable("waste_listings", {
  id: serial("id").primaryKey(),
  collectorId: integer("collector_id").notNull().references(() => users.id),
  materialType: text("material_type").$type<MaterialType>().notNull(),
  quantity: doublePrecision("quantity").notNull(),
  unit: text("unit").notNull(), // kg, ton, etc.
  description: text("description"),
  location: text("location"),
  price: doublePrecision("price"), // Price per unit
  status: text("status").$type<ListingStatus>().notNull().default("available"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id").notNull().references(() => wasteListings.id),
  collectorId: integer("collector_id").notNull().references(() => users.id),
  transporterId: integer("transporter_id").references(() => users.id),
  buyerId: integer("buyer_id").references(() => users.id),
  status: text("status").$type<TransactionStatus>().notNull().default("pending"),
  totalAmount: doublePrecision("total_amount"),
  pickupDate: timestamp("pickup_date"),
  deliveryDate: timestamp("delivery_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true, profileComplete: true });

export const insertWasteListingSchema = createInsertSchema(wasteListings)
  .omit({ id: true, createdAt: true, updatedAt: true, status: true });

export const insertTransactionSchema = createInsertSchema(transactions)
  .omit({ id: true, createdAt: true, updatedAt: true, status: true });

// Extended schemas with validation
export const registerUserSchema = insertUserSchema.extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
  email: z.string().email("Please enter a valid email address"),
  role: z.nativeEnum(UserRole)
});

export const updateProfileSchema = insertUserSchema.omit({ password: true }).extend({
  profileComplete: z.boolean().optional()
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Please enter your password")
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;

export type WasteListing = typeof wasteListings.$inferSelect;
export type InsertWasteListing = z.infer<typeof insertWasteListingSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
