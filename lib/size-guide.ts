import { prisma } from "@/lib/prisma";
import { SizeGuideWithRelations } from "@/types/product-details";

// The full include needed to render the size guide modal
export const sizeGuideInclude = {
  measurementPoints: {
    orderBy: { sortOrder: "asc" as const },
  },
  variants: {
    orderBy: { sortOrder: "asc" as const },
    include: {
      groups: {
        orderBy: { sortOrder: "asc" as const },
      },
    },
  },
};

/**
 * Resolves the appropriate size guide for a product based on inheritance rules.
 * Order of precedence:
 * 1. Product specific override (product.sizeGuideId)
 * 2. Category specific override (category.sizeGuideId)
 * 3. Parent Category override (parentCategory.sizeGuideId)
 * 4. Gender Default (Store fallback based on product gender)
 * 5. Null (No size guide available)
 */
export async function resolveSizeGuide(
  productId: string
): Promise<SizeGuideWithRelations | null> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: {
        include: {
          parent: true,
        },
      },
    },
  });

  if (!product) return null;

  // 1. Direct Product Override
  if (product.sizeGuideId) {
    const guide = await prisma.sizeGuide.findFirst({
      where: { id: product.sizeGuideId, isActive: true },
      include: sizeGuideInclude,
    });
    if (guide) return guide;
  }

  // 2. Direct Category Override
  if (product.category?.sizeGuideId) {
    const guide = await prisma.sizeGuide.findFirst({
      where: { id: product.category.sizeGuideId, isActive: true },
      include: sizeGuideInclude,
    });
    if (guide) return guide;
  }

  // 3. Parent Category Override
  if (product.category?.parent?.sizeGuideId) {
    const guide = await prisma.sizeGuide.findFirst({
      where: { id: product.category.parent.sizeGuideId, isActive: true },
      include: sizeGuideInclude,
    });
    if (guide) return guide;
  }

  // 4. Gender Default Fallback
  if (product.gender) {
    const genderDefault = await prisma.sizeGuide.findFirst({
      where: {
        isDefaultForGender: product.gender,
        isActive: true,
      },
      include: sizeGuideInclude,
    });
    if (genderDefault) return genderDefault;
  }

  // 5. No guide found
  return null;
}
