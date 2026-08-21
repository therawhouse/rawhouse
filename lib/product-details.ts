import prisma from "@/lib/prisma";
import { ProductDetailWithRelations, StoreDeliveryDefaults } from "@/types/product-details";

export async function getStoreDeliveryDefaults(): Promise<StoreDeliveryDefaults> {
  // Fetch global defaults from StoreSettings
  const keys = [
    "DEFAULT_DELIVERY_TIME",
    "DEFAULT_DELIVERY_NOTE",
    "DEFAULT_RETURNS_ELIGIBLE",
    "DEFAULT_RETURNS_NOTE",
  ];

  const settings = await prisma.storeSetting.findMany({
    where: { key: { in: keys } },
  });

  const getSetting = (key: string, fallback: any) => {
    const s = settings.find((s) => s.key === key);
    return s ? s.value : fallback;
  };

  return {
    deliveryTime: getSetting("DEFAULT_DELIVERY_TIME", "2-7 business days"),
    deliveryNoteHtml: getSetting("DEFAULT_DELIVERY_NOTE", "<p>Standard delivery across India.</p>"),
    returnsEligible: getSetting("DEFAULT_RETURNS_ELIGIBLE", true),
    returnsNoteHtml: getSetting("DEFAULT_RETURNS_NOTE", "<p>14-day easy returns.</p>"),
  };
}

export async function getProductDetails(productId: string): Promise<{
  details: ProductDetailWithRelations | null;
  resolvedDelivery: StoreDeliveryDefaults;
}> {
  const details = (await prisma.productDetail.findUnique({
    where: { productId },
    include: {
      measurements: { orderBy: { sortOrder: "asc" } },
      legalFields: { orderBy: { sortOrder: "asc" } },
      materialGlossary: {
        orderBy: { sortOrder: "asc" },
        include: { materialGlossary: true },
      },
    },
  })) as ProductDetailWithRelations | null;

  const defaults = await getStoreDeliveryDefaults();

  // If the product doesn't have a detail row, or if a specific field is null, fall back to global default.
  const resolvedDelivery: StoreDeliveryDefaults = {
    deliveryTime: details?.deliveryTime ?? defaults.deliveryTime,
    deliveryNoteHtml: details?.deliveryNoteHtml ?? defaults.deliveryNoteHtml,
    returnsEligible: details?.returnsEligible ?? defaults.returnsEligible,
    returnsNoteHtml: details?.returnsNoteHtml ?? defaults.returnsNoteHtml,
  };

  return { details, resolvedDelivery };
}
