import { MetadataRoute } from "next";

/**
 * ============================================================================
 * THE RAW HOUSE - Robots.txt Rules
 * ============================================================================
 */

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rawhouse.in";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/admin/", "/checkout/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
