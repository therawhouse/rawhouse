import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * ============================================================================
 * THE RAW HOUSE - Products REST API Handler
 * ============================================================================
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const gender = searchParams.get("gender");
    const query = searchParams.get("query");

    const where: any = { isPublished: true };
    if (category && category !== "All") {
      where.category = { slug: category };
    }
    if (gender && gender !== "All") {
      where.gender = gender;
    }
    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        colors: true,
        sizes: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, count: products.length, data: products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, price, categoryId, gender, images } = body;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description: description || title,
        price: Number(price),
        categoryId,
        gender: gender || "Unisex",
        images: {
          create: (images || []).map((url: string, idx: number) => ({
            url,
            isPrimary: idx === 0,
            sortOrder: idx,
          })),
        },
      },
      include: { images: true, category: true },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
