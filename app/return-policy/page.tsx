import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-raw-bg text-raw-ivory flex flex-col">
      <Header cartItemCount={0} wishlistItemCount={0} onOpenCart={() => {}} onOpenWishlist={() => {}} onOpenAuth={() => {}} />
      <main className="flex-1 max-w-4xl mx-auto py-32 px-6">
        <h1 className="text-3xl font-serif-luxury text-raw-gold uppercase tracking-widest mb-12 border-b border-raw-border pb-6">
          Return & Exchange Policy
        </h1>
        <div className="space-y-8 text-sm leading-relaxed text-raw-muted">
          <p>
            At The Raw House, we take immense pride in our craftsmanship. If you are not entirely satisfied with your luxury purchase, we're here to help.
          </p>

          <div>
            <h2 className="text-lg font-bold text-raw-ivory tracking-widest uppercase mb-4">1. 14-Day Returns</h2>
            <p>You have 14 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused, unworn, unwashed, and in the exact same condition that you received it. It must also be in the original bespoke packaging with all tags and protective materials intact.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-raw-ivory tracking-widest uppercase mb-4">2. Exchanges</h2>
            <p>If you require a different size or color, we offer complimentary exchanges within 14 days of receipt, subject to inventory availability. Please contact our concierge team to initiate an exchange.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-raw-ivory tracking-widest uppercase mb-4">3. Refunds</h2>
            <p>Once we receive your item, our quality assurance team will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item. If your return is approved, we will initiate a refund to your original method of payment (via Razorpay). You will receive the credit within a certain amount of days, depending on your card issuer's policies.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-raw-ivory tracking-widest uppercase mb-4">4. Shipping for Returns</h2>
            <p>We provide complimentary return shipping for all domestic orders. A prepaid shipping label will be provided upon approval of your return request. For international orders, return shipping costs are the responsibility of the client.</p>
          </div>
          
          <div>
            <h2 className="text-lg font-bold text-raw-ivory tracking-widest uppercase mb-4">5. Exceptions</h2>
            <p>Monogrammed, personalized, or custom-made items are final sale and cannot be returned or exchanged unless they arrive damaged or defective.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
