import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id: productId } = await params;
    
    // Check if the product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    const details = await prisma.productDetail.findUnique({
      where: { productId },
      include: {
        measurements: { orderBy: { sortOrder: "asc" } },
        legalFields: { orderBy: { sortOrder: "asc" } },
        materialGlossary: {
          orderBy: { sortOrder: "asc" },
          include: { materialGlossary: true }
        }
      }
    });

    return NextResponse.json({ success: true, data: details || {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id: productId } = await params;
    const body = await request.json();

    // We use upsert since the detail row might not exist yet
    const updated = await prisma.productDetail.upsert({
      where: { productId },
      update: {
        badge: body.badge,
        descriptionHtml: body.descriptionHtml,
        artNo: body.artNo,
        fitType: body.fitType,
        length: body.length,
        sleeveLength: body.sleeveLength,
        neckline: body.neckline,
        composition: body.composition,
        careInstructions: body.careInstructions || [],
        deliveryTime: body.deliveryTime,
        deliveryNoteHtml: body.deliveryNoteHtml,
        returnsEligible: body.returnsEligible ?? true,
        returnsNoteHtml: body.returnsNoteHtml,
      },
      create: {
        productId,
        badge: body.badge,
        descriptionHtml: body.descriptionHtml,
        artNo: body.artNo,
        fitType: body.fitType,
        length: body.length,
        sleeveLength: body.sleeveLength,
        neckline: body.neckline,
        composition: body.composition,
        careInstructions: body.careInstructions || [],
        deliveryTime: body.deliveryTime,
        deliveryNoteHtml: body.deliveryNoteHtml,
        returnsEligible: body.returnsEligible ?? true,
        returnsNoteHtml: body.returnsNoteHtml,
      }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
