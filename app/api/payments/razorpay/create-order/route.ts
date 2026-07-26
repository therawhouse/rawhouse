import { NextRequest, NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/razorpay";
import { logPaymentEvent, logError } from "@/lib/logger";

/**
 * ============================================================================
 * THE RAW HOUSE - Razorpay Order Generator API
 * ============================================================================
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amountInINR, receiptId } = body;

    if (!amountInINR || amountInINR <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid payment amount specified" },
        { status: 400 }
      );
    }

    const receipt = receiptId || `RWH-${Date.now()}`;
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
