const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  
  console.log(`Found ${products.length} products to seed with rich details...`);

  for (const product of products) {
    let composition = "100% Cotton";
    let fit = "Regular Fit";
    let details = `<p>Experience unparalleled comfort with our signature ${product.title.toLowerCase()}. Crafted with meticulous attention to detail, this piece represents the pinnacle of The Raw House atelier.</p>`;
    let care = ["Dry clean only", "Do not bleach", "Iron on low heat"];
    let badge = "";

    if (product.title.toLowerCase().includes("blazer") || product.title.toLowerCase().includes("suit")) {
      composition = "Super 120s Wool & Italian Silk Lining";
      fit = "Tailored Fit";
      badge = "Atelier Exclusive";
      details = `<p>A masterclass in modern tailoring. The ${product.title} is constructed using traditional bespoke techniques, featuring a half-canvas chest and hand-finished lapels. Perfect for formal evenings or elevated daywear.</p><p>The interior is fully lined with breathable Italian silk, ensuring a flawless drape.</p>`;
      care = ["Specialist dry clean only", "Store on a contoured wooden hanger"];
    } else if (product.title.toLowerCase().includes("silk") || product.title.toLowerCase().includes("shirt")) {
      composition = "100% Mulberry Silk";
      fit = "Relaxed Fit";
      badge = "Best Seller";
      details = `<p>Fluid, breathable, and effortlessly elegant. This ${product.title} is woven from pure Mulberry Silk, offering a subtle luster and unmatched softness against the skin.</p>`;
      care = ["Hand wash cold or gentle dry clean", "Dry flat away from direct sunlight", "Use silk-friendly detergent"];
    } else if (product.title.toLowerCase().includes("leather")) {
      composition = "100% Full-Grain Calf Leather";
      fit = "Slim Fit";
      details = `<p>An investment piece built to age beautifully. The ${product.title} uses premium full-grain calf leather, treated by master tanners to retain its natural texture and durability.</p>`;
      care = ["Do not wash", "Clean with a specialist leather conditioner", "Avoid prolonged exposure to moisture"];
    }

    await prisma.productDetail.upsert({
      where: { productId: product.id },
      update: {
        badge,
        descriptionHtml: details,
        fitType: fit,
        composition,
        careInstructions: care,
        deliveryTime: "Ships in 2-4 business days",
        returnsEligible: true,
      },
      create: {
        productId: product.id,
        badge,
        descriptionHtml: details,
        fitType: fit,
        composition,
        careInstructions: care,
        deliveryTime: "Ships in 2-4 business days",
        returnsEligible: true,
      }
    });

    console.log(`Seeded rich details for: ${product.title}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
