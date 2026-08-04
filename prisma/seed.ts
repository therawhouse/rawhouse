/**
 * ============================================================================
 * THE RAW HOUSE - Database Seeding Engine
 * ============================================================================
 * Generates initial luxury product catalog inspired by Gucci aesthetics:
 * - Categories: Outerwear, Tailored Suits, Leather Goods, Footwear, Accessories
 * - Products with high-resolution imagery, size/color variant matrix, stock
 * - Default Admin Account: admin@rawhouse.in
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding The Raw House database with Gucci-level luxury items...");

  // 1. Seed Categories
  const outerwearCategory = await prisma.category.upsert({
    where: { slug: "outerwear" },
    update: {},
    create: {
      name: "Outerwear & Coats",
      slug: "outerwear",
      description: "Editorial tailored trench coats, raw silk bombers, and velvet outerwear.",
      imageUrl: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200",
    },
  });

  const suitsCategory = await prisma.category.upsert({
    where: { slug: "tailored-suits" },
    update: {},
    create: {
      name: "Tailored Suits & Blazers",
      slug: "tailored-suits",
      description: "Sharp double-breasted blazers and structured wool trousers.",
      imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200",
    },
  });

  const leatherCategory = await prisma.category.upsert({
    where: { slug: "leather-goods" },
    update: {},
    create: {
      name: "Leather Goods & Bags",
      slug: "leather-goods",
      description: "Handcrafted espresso leather totes, duffels, and monogram clutches.",
      imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200",
    },
  });

  const footwearCategory = await prisma.category.upsert({
    where: { slug: "footwear" },
    update: {},
    create: {
      name: "Luxury Footwear",
      slug: "footwear",
      description: "Polished bronze leather loafers,chelsea boots, and runway sneakers.",
      imageUrl: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1200",
    },
  });

  // 2. Seed Products
  const productsData = [
    {
      title: "Raw Silk Embroidered Bomber Jacket",
      slug: "raw-silk-embroidered-bomber-jacket",
      description: "Crafted from 100% pure raw mulberry silk, featuring hand-stitched golden thread embroidery along the back, ribbed knit collar, and custom antique bronze hardware.",
      details: "Materials: 100% Silk. Lining: 100% Cupro. Dry clean only. Made in Atelier.",
      price: 84500,
      salePrice: 79000,
      gender: "Unisex",
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      categoryId: outerwearCategory.id,
      images: [
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000",
        "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000",
      ],
      colors: [
        { colorName: "Espresso Brown", hexCode: "#16100e" },
        { colorName: "Raw Gold", hexCode: "#c69255" },
      ],
      sizes: ["S", "M", "L", "XL"],
    },
    {
      title: "Double-Breasted Raw Wool Blazer",
      slug: "double-breasted-raw-wool-blazer",
      description: "Impeccably tailored double-breasted blazer cut from heavy English raw wool. Styled with peak lapels, horn buttons, and a structured padded silhouette.",
      details: "Materials: 100% Virgin Wool. Full canvassed construction. Professional clean.",
      price: 112000,
      gender: "Men",
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
      categoryId: suitsCategory.id,
      images: [
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000",
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000",
      ],
      colors: [
        { colorName: "Midnight Espresso", hexCode: "#140e0c" },
        { colorName: "Warm Charcoal", hexCode: "#241b18" },
      ],
      sizes: ["48 EU", "50 EU", "52 EU"],
    },
    {
      title: "Monogram Raw Leather Weekender Tote",
      slug: "monogram-raw-leather-weekender-tote",
      description: "Generously sized travel holdall hand-carved in full-grain Italian leather. Features double handles, detachable shoulder strap, and internal zippered compartments.",
      details: "Dimensions: 50cm x 30cm x 22cm. Handcrafted leather. Suede lining.",
      price: 135000,
      gender: "Unisex",
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      categoryId: leatherCategory.id,
      images: [
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000",
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000",
      ],
      colors: [
        { colorName: "Cognac Gold", hexCode: "#c69255" },
        { colorName: "Deep Black", hexCode: "#111111" },
      ],
      sizes: ["One Size"],
    },
    {
      title: "Hand-Burnished Leather Horsebit Loafers",
      slug: "hand-burnished-leather-horsebit-loafers",
      description: "Timeless luxury loafers finished with hand-burnished patination and polished custom bronze horsebit hardware. Goodyear welted leather sole.",
      details: "Upper: 100% Calfskin. Sole: Genuine Leather. Made in Italy.",
      price: 68000,
      gender: "Men",
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: true,
      categoryId: footwearCategory.id,
      images: [
        "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000",
        "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=1000",
      ],
      colors: [
        { colorName: "Antique Bronze", hexCode: "#b07b41" },
      ],
      sizes: ["EU 40", "EU 41", "EU 42", "EU 43", "EU 44"],
    },
  ];

  for (const item of productsData) {
    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {},
      create: {
        title: item.title,
        slug: item.slug,
        description: item.description,
        details: item.details,
        price: item.price,
        salePrice: item.salePrice,
        gender: item.gender,
        isFeatured: item.isFeatured,
        isBestSeller: item.isBestSeller,
        isNewArrival: item.isNewArrival,
        categoryId: item.categoryId,
        images: {
          create: item.images.map((url, idx) => ({
            url,
            isPrimary: idx === 0,
            sortOrder: idx,
          })),
        },
        colors: {
          create: item.colors,
        },
        sizes: {
          create: item.sizes.map((s) => ({ sizeName: s })),
        },
      },
    });

    // Create inventory record
    await prisma.inventory.upsert({
      where: { sku: `RWH-${product.slug.toUpperCase()}-STOCK` },
      update: {},
      create: {
        sku: `RWH-${product.slug.toUpperCase()}-STOCK`,
        quantity: 25,
        productId: product.id,
      },
    });
  }

  // 3. Seed Default Admin User
  const adminPasswordHash = await bcrypt.hash("RawHouseAdmin2026!", 10);
  await prisma.adminUser.upsert({
    where: { email: "admin@rawhouse.in" },
    update: {},
    create: {
      email: "admin@rawhouse.in",
      name: "The Raw House Concierge Admin",
      passwordHash: adminPasswordHash,
      permissions: ["MANAGE_PRODUCTS", "MANAGE_ORDERS", "MANAGE_COUPONS", "MANAGE_USERS"],
    },
  });

  // 4. Seed Default Sample Coupon
  await prisma.coupon.upsert({
    where: { code: "RAWHOUSE10" },
    update: {},
    create: {
      code: "RAWHOUSE10",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderValue: 50000,
      isActive: true,
    },
  });

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
