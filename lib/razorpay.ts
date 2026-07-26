import Razorpay from "razorpay";
import crypto from "crypto";

/**
 * ============================================================================
 * THE RAW HOUSE - Razorpay Payment Gateway Integration
 * ============================================================================
 * Security Policy:
 * 1. Payment creation MUST originate strictly from backend API endpoints.
 * 2. Successful payment callbacks MUST be verified using HMAC-SHA256 signatures.
 * 3. Never trust payment status signals received directly from client JavaScript.
 */

const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_key_id_placeholder";
const keySecret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_key_secret_placeholder";

export const razorpayInstance = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

export interface CreateRazorpayOrderOptions {
  amountInINR: number; // e.g., ₹12,500.00
  receiptId: string;   // Internal Order Number (e.g. RWH-2026-001)
  notes?: Record<string, string>;
}

/**
 * Creates an official Razorpay Order object via REST SDK API
 */
export async function createRazorpayOrder({
  amountInINR,
  receiptId,
  notes = {},
}: CreateRazorpayOrderOptions) {
  const options = {
    amount: Math.round(amountInINR * 100), // Razorpay operates in paise (1 INR = 100 paise)
    currency: "INR",
    receipt: receiptId,
    notes: {
      brand: "The Raw House",
      ...notes,
    },
  };

  return await razorpayInstance.orders.create(options);
}

/**
 * Validates Razorpay Payment Signature using HMAC SHA256 cryptographic verification
 * Payload structure: order_id + "|" + payment_id
 */
export function verifyRazorpaySignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean {
  const body = razorpayOrderId + "|" + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(body.toString())
    .digest("hex");

  return expectedSignature === razorpaySignature;
}
