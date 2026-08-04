import { NextRequest, NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/razorpay";
import { logPaymentEvent, logError } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

/**
 * ============================================================================
 * THE RAW HOUSE - Razorpay Order Generator API
 * ============================================================================
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartItems } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Secure server-side price calculation
    const productIds = cartItems.map((item: any) => item.productId);
    const productsFromDb = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let subtotal = 0;
    for (const item of cartItems) {
      const dbProduct = productsFromDb.find(p => p.id === item.productId);
      if (!dbProduct) {
        throw new Error(`Product ${item.productId} not found`);
      }
      const itemPrice = dbProduct.salePrice || dbProduct.price;
      subtotal += itemPrice * item.quantity;
    }

    // Shipping logic matching frontend
    const shippingFee = subtotal > 50000 ? 0 : 1500;
    const amountInINR = subtotal + shippingFee;

    const receipt = `RWH-${Date.now()}`;
    const razorpayOrder = await createRazorpayOrder({
      amountInINR,
      receiptId: receipt,
    });

    logPaymentEvent("RAZORPAY_ORDER_CREATED", receipt, "CREATED", {
      razorpayOrderId: razorpayOrder.id,
      amount: amountInINR,
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID || "rzp_test_key_id_placeholder",
      },
    });
  } catch (error: any) {
    logError("Razorpay Create Order Failed", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
