import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
                sizes: true,
                colors: true,
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id },
        include: { items: { include: { product: { include: { images: true, sizes: true, colors: true } } } } },
      });
    }

    return NextResponse.json({ success: true, data: cart });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    const body = await request.json();
    const { productId, size, color, quantity = 1 } = body;

    let cart = await prisma.cart.findUnique({ where: { userId: user.id } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: user.id } });
    }

    // Check if item exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        size,
        color
      }
    });

    let cartItem;
    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: { include: { images: true } } }
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          size,
          color,
          quantity
        },
        include: { product: { include: { images: true } } }
      });
    }

    return NextResponse.json({ success: true, data: cartItem });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { itemId, quantity } = body;

    const updated = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");

    if (itemId) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      // Clear entire cart for user
      const user = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (user) {
        const cart = await prisma.cart.findUnique({ where: { userId: user.id } });
        if (cart) {
          await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
