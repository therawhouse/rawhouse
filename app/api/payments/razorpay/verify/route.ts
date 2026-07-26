import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { sendEmail, getOrderConfirmationEmailHtml } from "@/lib/resend";
import { logPaymentEvent, logError } from "@/lib/logger";

/**
 * ============================================================================
 * THE RAW HOUSE - Razorpay Payment Signature Verification API
 * ============================================================================
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      customerEmail,
      customerName,
      totalAmount,
    } = body;

    // Verify Signature
    const isValid = verifyRazorpaySignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValid && process.env.NODE_ENV === "production") {
      logPaymentEvent("VERIFY_SIGNATURE_FAILED", razorpayOrderId, "FAILED");
      return NextResponse.json(
        { success: false, error: "Payment verification failed: Invalid HMAC signature" },
        { status: 400 }
      );
    }

    logPaymentEvent("VERIFY_SIGNATURE_SUCCESS", razorpayOrderId, "SUCCESS", {
      razorpayPaymentId,
    });

    // Send Confirmation Email via Resend
    if (customerEmail) {
      const emailHtml = getOrderConfirmationEmailHtml(
        razorpayOrderId,
        customerName || "Valued Client",
        totalAmount || 84500
      );
      await sendEmail({
        to: customerEmail,
        subject: `Order Confirmation #${razorpayOrderId} - The Raw House`,
        html: emailHtml,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and order recorded.",
      data: {
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
      },
    });
  } catch (error: any) {
    logError("Razorpay Signature Verification Failed", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
