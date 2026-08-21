import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProductDetails } from "@/lib/product-details";
import { resolveSizeGuide } from "@/lib/size-guide";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    const { details, resolvedDelivery } = await getProductDetails(product.id);
    const sizeGuide = await resolveSizeGuide(product.id);

    return NextResponse.json({
      success: true,
      data: {
        productDetails: details,
        delivery: resolvedDelivery,
        sizeGuide: sizeGuide,
      },
    });
  } catch (error: any) {
    console.error("GET /api/products/[id]/details Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
