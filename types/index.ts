// Stub types - these are not used since we're using Supabase directly
// If you need these in the future, define them based on your Supabase schema

export type UserRole = "FREE" | "PROFESSIONAL" | "ENTERPRISE";
export type SubscriptionPlan = "FREE" | "PROFESSIONAL" | "ENTERPRISE";
export type QRCodeType = "URL" | "TEXT" | "EMAIL" | "PHONE" | "SMS" | "WIFI" | "V_CARD" | "FACEBOOK" | "TWITTER" | "INSTAGRAM" | "LINKEDIN" | "YOUTUBE" | "TIKTOK";
export type QRCodeStatus = "ACTIVE" | "INACTIVE" | "EXPIRED";

export interface User {
  id: string;
  name?: string | null;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  role: UserRole;
  subscriptionPlan: SubscriptionPlan;
  subscriptionEnds?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface QRCode {
  id: string;
  userId: string;
  name: string;
  type: QRCodeType;
  content: string;
  shortCode: string;
  dynamic: boolean;
  isActive: boolean;
  scans: number;
  status: QRCodeStatus;
  title?: string | null;
  description?: string | null;
}

export interface Folder {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessCard {
  id: string;
  userId: string;
  name: string;
  title?: string | null;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  address?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Menu {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuCategory {
  id: string;
  menuId: string;
  name: string;
  description?: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description?: string | null;
  price?: number | null;
  image?: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
