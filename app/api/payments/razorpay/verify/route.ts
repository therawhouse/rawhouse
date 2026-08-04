import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { sendEmail, getOrderConfirmationEmailHtml } from "@/lib/resend";
import { logPaymentEvent, logError } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

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
      addressDetails,
      cartItems,
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

    // 1. Get or create User
    const safeEmail = customerEmail || "guest@rawhouse.in";
    const user = await prisma.user.upsert({
      where: { email: safeEmail },
      update: {},
      create: {
        email: safeEmail,
        name: customerName,
        firstName: addressDetails?.firstName,
        lastName: addressDetails?.lastName,
        phone: addressDetails?.phone,
      },
    });

    // 2. Create Address
    const address = await prisma.address.create({
      data: {
        userId: user.id,
        fullName: customerName || "Guest",
        phone: addressDetails?.phone || "0000000000",
        streetAddress: addressDetails?.address || "N/A",
        apartment: addressDetails?.apartment,
        city: addressDetails?.city || "N/A",
        state: addressDetails?.state || "N/A",
        postalCode: addressDetails?.pincode || "000000",
      },
    });

    // 3. Create Order
    let subtotal = 0;
    if (cartItems) {
      subtotal = cartItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    }
    const shippingFee = subtotal > 50000 ? 0 : 1500;
    const totalAmount = subtotal + shippingFee;

    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        userId: user.id,
        addressId: address.id,
        subtotal,
        shippingFee,
        totalAmount,
        status: "PAID",
        paymentStatus: "SUCCESS",
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        items: {
          create: (cartItems || []).map((item: any) => ({
            productId: item.productId,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          })),
        },
      },
    });

    // 4. Update Inventory
    if (cartItems) {
      for (const item of cartItems) {
        const inventory = await prisma.inventory.findFirst({
          where: { productId: item.productId },
        });
        if (inventory) {
          await prisma.inventory.update({
            where: { id: inventory.id },
            data: { quantity: { decrement: item.quantity } },
          });
        }
      }
    }

    // Send Confirmation Email via Resend
    if (customerEmail) {
      const emailHtml = getOrderConfirmationEmailHtml(
        razorpayOrderId,
        customerName || "Valued Client",
        totalAmount
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
        orderId: order.id,
        paymentId: razorpayPaymentId,
      },
    });
  } catch (error: any) {
    logError("Razorpay Signature Verification Failed", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
