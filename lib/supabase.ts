import { createClient } from "@supabase/supabase-js";

/**
 * ============================================================================
 * THE RAW HOUSE - Supabase Storage & Service API Client
 * ============================================================================
 * Handles image asset hosting in Supabase Storage Buckets:
 * - `product-images`: High-resolution product showcase media
 * - `brand-assets`: Logos, campaign banners, editorial graphics
 * - `homepage-banners`: Full-bleed editorial heroes
 * - `user-profile-images`: Customer avatar uploads
 * - `review-images`: Customer review photo attachments
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key";

// Client-safe browser client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Privileged server-side administrative client (bypass RLS for admin operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export const BUCKETS = {
  PRODUCTS: "product-images",
  BRAND: "brand-assets",
  BANNERS: "homepage-banners",
  AVATARS: "user-profile-images",
  REVIEWS: "review-images",
} as const;
