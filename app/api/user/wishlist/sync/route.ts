import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    const body = await request.json();
    const { productIds } = body; // Array of product ids

    if (!productIds || !Array.isArray(productIds)) {
      return NextResponse.json({ success: false, error: "Invalid array" }, { status: 400 });
    }

    let wishlist = await prisma.wishlist.findUnique({ where: { userId: user.id } });
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({ data: { userId: user.id } });
    }

    // Merge logic: add if not exists
    for (const productId of productIds) {
      const existingItem = await prisma.wishlistItem.findFirst({
        where: {
          wishlistId: wishlist.id,
          productId
        }
      });

      if (!existingItem) {
        await prisma.wishlistItem.create({
          data: {
            wishlistId: wishlist.id,
            productId,
          }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
