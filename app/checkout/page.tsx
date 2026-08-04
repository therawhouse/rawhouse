"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { toast } from "sonner";
import { ChevronRight, CreditCard, ShieldCheck } from "lucide-react";
import { useSession } from "next-auth/react";

/**
 * ============================================================================
 * THE RAW HOUSE - Shopify-Style Checkout Flow
 * ============================================================================
 */

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const { data: session } = useSession();

  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("express");
  
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  // Pre-fill email if logged in
  useEffect(() => {
    const userEmail = session?.user?.email;
    if (userEmail) {
      setFormData((prev) => ({ ...prev, email: userEmail }));
    }
  }, [session]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.product.salePrice || item.product.price) * item.quantity,
    0
  );
  
  // Free shipping above ₹50,000, else ₹1,500 for heavy luxury items
  const shippingFee = subtotal >= 50000 ? 0 : 1500;
  
  // Tax logic (Included in subtotal for luxury apparel usually in India, GST 12%)
  const estimatedTax = Math.round(subtotal * 0.12);
  const total = subtotal + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRazorpayCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!formData.email || !formData.firstName || !formData.address || !formData.phone) {
      toast.error("Please complete the shipping address");
      return;
    }

    setIsProcessing(true);

    try {
      toast.info("Initializing Razorpay Secure Gateway...");

      // 1. Create order on backend
      const res = await fetch("/api/payments/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountInINR: total,
          receiptId: `RWH-${Date.now()}`,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Order creation failed");
      }

      // 2. Open Razorpay SDK
      const options = {
        key: data.data.key,
        amount: data.data.amount,
        currency: data.data.currency,
        name: "The Raw House Atelier",
        description: "Bespoke Apparel Purchase",
        image: "https://rawhouse.in/logo.png",
        order_id: data.data.orderId,
        handler: async function (response: any) {
          toast.loading("Verifying Payment Signature...");

          // 3. Verify signature on backend
          const verifyRes = await fetch("/api/payments/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              customerEmail: formData.email,
              customerName: `${formData.firstName} ${formData.lastName}`.trim(),
              totalAmount: total,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            toast.success("Payment Successful!", {
              description: `Transaction ID: ${response.razorpay_payment_id}`,
            });
            clearCart();
            // In a real app, redirect to an Order Confirmation page
            router.push("/"); 
          } else {
            toast.error("Signature Verification Failed");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#c69255", 
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      if (typeof window !== "undefined" && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        toast.success("Razorpay Payment Simulated (Development Mode)", {
          description: `Order Amount: ₹${total.toLocaleString("en-IN")}.`,
        });
        clearCart();
        router.push("/");
      }
    } catch (err: any) {
      toast.error(err.message || "Payment Gateway Error");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-gray-900 font-sans">
      
      {/* Mobile/Tablet Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 py-6 text-center">
        <Link href="/">
          <h1 className="font-serif-luxury text-2xl tracking-[0.2em] uppercase text-gray-900">
            The Raw House
          </h1>
        </Link>
      </header>

      <div className="flex flex-col-reverse lg:flex-row min-h-screen">
        
        {/* LEFT COLUMN - Checkout Form */}
        <div className="w-full lg:w-[55%] xl:w-[60%] lg:border-r border-gray-200 bg-white">
          <div className="max-w-2xl mx-auto px-6 py-10 lg:pl-20 lg:pr-12">
            
            {/* Desktop Header */}
            <header className="hidden lg:block mb-10">
              <Link href="/">
                <h1 className="font-serif-luxury text-3xl tracking-[0.2em] uppercase text-gray-900">
                  The Raw House
                </h1>
              </Link>
              <nav className="flex items-center space-x-2 text-xs mt-4 text-gray-500">
                <Link href="/cart" className="hover:text-gray-900 transition-colors">Cart</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="font-semibold text-gray-900">Information & Payment</span>
              </nav>
            </header>

            <form onSubmit={handleRazorpayCheckout} className="space-y-10">
              
              {/* Contact Information */}
              <section className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-medium tracking-tight">Contact</h2>
                  {!session && (
                    <Link href="/login" className="text-sm text-raw-gold hover:underline">
                      Log in
                    </Link>
                  )}
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email or mobile phone number"
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-raw-gold/50 focus:border-raw-gold transition-colors text-sm"
                    required
                  />
                  <div className="mt-3 flex items-center space-x-2">
                    <input type="checkbox" id="news" className="accent-raw-gold" defaultChecked />
                    <label htmlFor="news" className="text-sm text-gray-600">Email me with news and offers</label>
                  </div>
                </div>
              </section>

              {/* Delivery Address */}
              <section className="space-y-4">
                <h2 className="text-xl font-medium tracking-tight">Delivery</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First name"
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-raw-gold/50 focus:border-raw-gold transition-colors text-sm"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last name"
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-raw-gold/50 focus:border-raw-gold transition-colors text-sm"
                    required
                  />
                </div>
                
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Address"
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-raw-gold/50 focus:border-raw-gold transition-colors text-sm"
                  required
                />
                
                <input
                  type="text"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  placeholder="Apartment, suite, etc. (optional)"
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-raw-gold/50 focus:border-raw-gold transition-colors text-sm"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-raw-gold/50 focus:border-raw-gold transition-colors text-sm"
                    required
                  />
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-raw-gold/50 focus:border-raw-gold transition-colors text-sm bg-white"
                    required
                  >
                    <option value="" disabled>State</option>
                    <option value="MH">Maharashtra</option>
                    <option value="DL">Delhi</option>
                    <option value="KA">Karnataka</option>
                    <option value="TN">Tamil Nadu</option>
                    <option value="WB">West Bengal</option>
                  </select>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="PIN code"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    title="Please enter exactly 6 digits"
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-raw-gold/50 focus:border-raw-gold transition-colors text-sm"
                    required
                  />
                </div>
                
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  title="Please enter exactly 10 digits"
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-raw-gold/50 focus:border-raw-gold transition-colors text-sm"
                  required
                />
              </section>

              {/* Shipping Method */}
              <section className="space-y-4">
                <h2 className="text-xl font-medium tracking-tight">Shipping method</h2>
                <div className="border border-gray-300 rounded-md bg-[#f5f5f5] p-4 flex justify-between items-center text-sm">
                  <span>Standard Express Air</span>
                  <span className="font-medium text-gray-900">
                    {shippingFee === 0 ? "Free" : `₹${shippingFee.toLocaleString("en-IN")}`}
                  </span>
                </div>
              </section>

              {/* Payment Method */}
              <section className="space-y-4">
                <div>
                  <h2 className="text-xl font-medium tracking-tight">Payment</h2>
                  <p className="text-sm text-gray-500 mt-1">All transactions are secure and encrypted.</p>
                </div>
                
                <div className="border border-raw-gold rounded-md bg-raw-gold/5 overflow-hidden">
                  <div className="p-4 flex items-center justify-between border-b border-raw-gold/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full bg-raw-gold border-4 border-raw-gold flex items-center justify-center shadow-[0_0_0_1px_#c69255]">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">Razorpay Secure Payment</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="px-2 py-0.5 border border-gray-200 rounded text-[10px] font-bold bg-white text-gray-600">UPI</div>
                      <div className="px-2 py-0.5 border border-gray-200 rounded text-[10px] font-bold bg-white text-gray-600">VISA</div>
                      <div className="px-2 py-0.5 border border-gray-200 rounded text-[10px] font-bold bg-white text-gray-600">MC</div>
                    </div>
                  </div>
                  <div className="p-6 text-center text-sm text-gray-600 bg-[#fbfaf8]">
                    <CreditCard className="w-10 h-10 mx-auto text-raw-gold mb-3 opacity-80" />
                    <p>After clicking "Pay now", you will be redirected to Razorpay Secure Checkout to complete your purchase safely.</p>
                  </div>
                </div>
              </section>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#1b1210] hover:bg-black text-white p-5 rounded-md font-bold text-sm tracking-widest uppercase transition-colors shadow-lg disabled:opacity-70 flex justify-center items-center space-x-2"
                >
                  {isProcessing ? (
                    <span className="animate-pulse">Processing...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Pay now (₹{total.toLocaleString("en-IN")})</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* RIGHT COLUMN - Order Summary */}
        <div className="w-full lg:w-[45%] xl:w-[40%] bg-[#faf9f6]">
          <div className="max-w-xl mx-auto px-6 py-10 lg:pr-20 lg:pl-12 lg:sticky lg:top-0">
            
            {/* Cart Items List */}
            <div className="space-y-4 mb-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-sm">Your cart is empty.</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 bg-white border border-gray-200 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.images[0]?.url || "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=200"}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute -top-2 -right-2 bg-gray-500 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold z-10 border border-white">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                        {item.product.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.size} / {item.color}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ₹{((item.product.salePrice || item.product.price) * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))
              )}
            </div>

            <hr className="border-gray-200 my-6" />

            {/* Discount Code */}
            <div className="flex space-x-3 mb-6">
              <input
                type="text"
                placeholder="Discount code or gift card"
                className="flex-1 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-raw-gold/50 focus:border-raw-gold transition-colors text-sm bg-white"
              />
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-3 rounded-md transition-colors text-sm">
                Apply
              </button>
            </div>

            <hr className="border-gray-200 my-6" />

            {/* Totals */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="flex items-center space-x-1">
                  <span>Shipping</span>
                  <span className="text-[10px] bg-gray-200 px-1.5 rounded-sm">?</span>
                </span>
                <span className="font-medium text-gray-900">
                  {shippingFee === 0 ? "Free" : `₹${shippingFee.toLocaleString("en-IN")}`}
                </span>
              </div>
              <div className="flex justify-between items-end pt-4 border-t border-gray-200 mt-4">
                <div>
                  <span className="text-base font-medium text-gray-900">Total</span>
                  <p className="text-xs text-gray-500 mt-1">
                    Including ₹{estimatedTax.toLocaleString("en-IN")} in taxes
                  </p>
                </div>
                <div className="flex items-end space-x-2">
                  <span className="text-xs text-gray-500 mb-1">INR</span>
                  <span className="text-2xl font-semibold text-gray-900">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
