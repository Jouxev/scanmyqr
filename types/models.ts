// Snake_case types matching Supabase database schema

export interface QRCode {
  id: string;
  user_id: string;
  name: string;
  type: string;
  content: string;
  short_code: string;
  dynamic: boolean;
  is_active: boolean;
  scans: number;
  status: "ACTIVE" | "INACTIVE" | "EXPIRED" | "DELETED";
  title: string | null;
  description: string | null;
  foreground_color: string;
  background_color: string;
  gradient_colors: string | null;
  frame_style: string | null;
  eye_style: string | null;
  logo_url: string | null;
  logo_size: number | null;
  download_format: string;
  folder_id: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface QRCodeScan {
  id: string;
  qr_code_id: string;
  ip_address: string | null;
  user_agent: string | null;
  country: string | null;
  city: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  referrer: string | null;
  scanned_at: string;
}

export interface BusinessCard {
  id: string;
  user_id: string;
  slug: string;
  name: string;
  title: string | null;
  company: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  linkedin: string | null;
  twitter: string | null;
  facebook: string | null;
  instagram: string | null;
  github: string | null;
  tiktok: string | null;
  youtube: string | null;
  whatsapp: string | null;
  telegram: string | null;
  portfolio_url: string | null;
  custom_links:
    | {
        snapchat?: string | null;
        viber?: string | null;
        [key: string]: unknown;
      }
    | null;
  theme: string | null;
  font_family: string | null;
  primary_color: string | null;
  background_color: string | null;
  background_image: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  is_public: boolean;
  custom_domain: string | null;
  qr_code_url: string | null;
  visits?: number;
  created_at: string;
  updated_at: string;
}

export interface Restaurant {
  id: string;
  user_id: string;
  slug: string;
  name: string;
  description: string | null;
  logo: string | null;
  cover_image: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  is_public: boolean;
  custom_domain: string | null;
  qr_code_url: string | null;
  created_at: string;
  updated_at: string;
  categories?: number;
  items?: number;
}

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  badge: string | null;
  offer: string | null;
  is_available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Folder {
  id: string;
  user_id: string;
  name: string;
  color: string | null;
  icon: string | null;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  qrCount?: number;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  link: string | null;
  created_at: string;
}
