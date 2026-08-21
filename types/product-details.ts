import { Prisma } from "@prisma/client";

// Define the exact payload needed for the Storefront Product Accordion
export type ProductDetailWithRelations = Prisma.ProductDetailGetPayload<{
  include: {
    measurements: true;
    legalFields: true;
    materialGlossary: {
      include: {
        materialGlossary: true;
      };
    };
  };
}>;

export type SizeGuideWithRelations = Prisma.SizeGuideGetPayload<{
  include: {
    measurementPoints: true;
    variants: {
      include: {
        groups: true;
      };
    };
  };
}>;

export interface StoreDeliveryDefaults {
  deliveryTime: string;
  deliveryNoteHtml: string;
  returnsEligible: boolean;
  returnsNoteHtml: string;
}
