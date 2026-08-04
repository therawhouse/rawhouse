import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Total Revenue (Sum of all PAID/SHIPPED/DELIVERED orders)
    const revenueAggr = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] }
      }
    });
    const totalRevenue = revenueAggr._sum.totalAmount || 0;

    // 2. Total Orders
    const totalOrders = await prisma.order.count();

    // 3. Active Products
    const activeProducts = await prisma.product.count({
      where: { isPublished: true }
    });

    // 4. VIP Clients (Users)
    const vipClients = await prisma.user.count({
      where: { role: "CUSTOMER" }
    });

    // 5. Recent Orders (Last 5)
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true }
    });

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        activeProducts,
        vipClients,
        recentOrders: recentOrders.map(o => ({
          id: o.orderNumber || o.id.split("-")[0],
          customer: o.user?.name || o.user?.email || "Guest",
          total: o.totalAmount,
          status: o.status,
          date: o.createdAt
        }))
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
