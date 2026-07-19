import { QRCodeType, QRCodeStatus, SubscriptionPlan, UserRole } from "@prisma/client";

export type { QRCodeType, QRCodeStatus, SubscriptionPlan, UserRole };

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
  foregroundColor: string;
  backgroundColor: string;
  gradientColors?: string | null;
  frameStyle?: string | null;
  eyeStyle?: string | null;
  logoUrl?: string | null;
  logoSize?: number | null;
  downloadFormat: string;
  folderId?: string | null;
  expiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface QRCodeScan {
  id: string;
  qrCodeId: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  country?: string | null;
  city?: string | null;
  device?: string | null;
  browser?: string | null;
  os?: string | null;
  referrer?: string | null;
  scannedAt: Date;
}

export interface BusinessCard {
  id: string;
  userId: string;
  slug: string;
  name: string;
  title?: string | null;
  company?: string | null;
  bio?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  address?: string | null;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  github?: string | null;
  tiktok?: string | null;
  youtube?: string | null;
  whatsapp?: string | null;
  telegram?: string | null;
  portfolioUrl?: string | null;
  customLinks?: any;
  theme?: string | null;
  fontFamily?: string | null;
  primaryColor?: string | null;
  backgroundColor?: string | null;
  backgroundImage?: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isPublic: boolean;
  customDomain?: string | null;
  qrCodeUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Restaurant {
  id: string;
  userId: string;
  slug: string;
  name: string;
  description?: string | null;
  logo?: string | null;
  coverImage?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isPublic: boolean;
  customDomain?: string | null;
  qrCodeUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  categories?: MenuCategory[];
}

export interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  description?: string | null;
  sortOrder: number;
  isActive: boolean;
  items?: MenuItem[];
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description?: string | null;
  price: number;
  image?: string | null;
  badge?: string | null;
  offer?: string | null;
  isAvailable: boolean;
  sortOrder: number;
}

export interface Folder {
  id: string;
  userId: string;
  name: string;
  color?: string | null;
  icon?: string | null;
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  qrCodes?: QRCode[];
  children?: Folder[];
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  link?: string | null;
  createdAt: Date;
}

export interface DashboardStats {
  totalQRCodes: number;
  totalScans: number;
  activeQRCodes: number;
  businessCards: number;
  restaurants: number;
}

export interface ChartData {
  date: string;
  scans: number;
}

export interface TopQRCode {
  id: string;
  name: string;
  scans: number;
}

export interface AnalyticsData {
  scansOverTime: ChartData[];
  topQRCodes: TopQRCode[];
  topCountries: { country: string; scans: number }[];
  topDevices: { device: string; scans: number }[];
  topBrowsers: { browser: string; scans: number }[];
}
