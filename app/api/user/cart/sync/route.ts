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
    const { items } = body; // Array of { productId, size, color, quantity }

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ success: false, error: "Invalid items array" }, { status: 400 });
    }

    let cart = await prisma.cart.findUnique({ where: { userId: user.id } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: user.id } });
    }

    // Merge logic: for each local item, add it or update quantity if it exists
    for (const item of items) {
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: item.productId,
          size: item.size,
          color: item.color
        }
      });

      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + item.quantity }
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: item.productId,
            size: item.size,
            color: item.color,
            quantity: item.quantity
          }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
