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

    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              include: { images: true, sizes: true, colors: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
      },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId: user.id },
        include: { items: { include: { product: { include: { images: true, sizes: true, colors: true } } } } },
      });
    }

    return NextResponse.json({ success: true, data: wishlist });
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
    const { productId } = body;

    let wishlist = await prisma.wishlist.findUnique({ where: { userId: user.id } });
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({ data: { userId: user.id } });
    }

    const existingItem = await prisma.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        productId,
      }
    });

    if (existingItem) {
      return NextResponse.json({ success: true, data: existingItem }); // already exists
    }

    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId,
      },
      include: { product: { include: { images: true } } }
    });

    return NextResponse.json({ success: true, data: wishlistItem });
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
    const productId = searchParams.get("productId");

    if (productId) {
      const user = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (user) {
        const wishlist = await prisma.wishlist.findUnique({ where: { userId: user.id } });
        if (wishlist) {
          await prisma.wishlistItem.deleteMany({
            where: {
              wishlistId: wishlist.id,
              productId
            }
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
