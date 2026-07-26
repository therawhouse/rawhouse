import { describe, it, expect } from "vitest";
import { verifyRazorpaySignature } from "../lib/razorpay";
import crypto from "crypto";

/**
 * ============================================================================
 * THE RAW HOUSE - Razorpay Payment Security Unit Tests
 * ============================================================================
 */

describe("Razorpay HMAC Signature Verification", () => {
  it("should return true for valid cryptographic signature", () => {
    const razorpayOrderId = "order_K9xJ82kLa1S982";
    const razorpayPaymentId = "pay_L82x192kM91";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_key_secret_placeholder";

    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex");

    const result = verifyRazorpaySignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature: expectedSignature,
    });

    expect(result).toBe(true);
  });

  it("should return false for tampered signature", () => {
    const result = verifyRazorpaySignature({
      razorpayOrderId: "order_123",
      razorpayPaymentId: "pay_456",
      razorpaySignature: "invalid_hacked_signature",
    });

    expect(result).toBe(false);
  });
});
