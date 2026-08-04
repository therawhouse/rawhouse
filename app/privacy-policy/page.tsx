import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-raw-bg text-raw-ivory flex flex-col">
      <Header cartItemCount={0} wishlistItemCount={0} onOpenCart={() => {}} onOpenWishlist={() => {}} onOpenAuth={() => {}} />
      <main className="flex-1 max-w-4xl mx-auto py-32 px-6">
        <h1 className="text-3xl font-serif-luxury text-raw-gold uppercase tracking-widest mb-12 border-b border-raw-border pb-6">
          Privacy Policy
        </h1>
        <div className="space-y-8 text-sm leading-relaxed text-raw-muted">
          <p>
            At The Raw House ("we", "our", or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard the data you provide to us when using our luxury atelier website.
          </p>

          <div>
            <h2 className="text-lg font-bold text-raw-ivory tracking-widest uppercase mb-4">1. Information We Collect</h2>
            <p>We may collect personal information such as your name, email address, phone number, shipping and billing addresses, and payment details when you create an account, place an order, or subscribe to our newsletter.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-raw-ivory tracking-widest uppercase mb-4">2. How We Use Your Information</h2>
            <p>Your information is used strictly to process orders, deliver your bespoke garments, manage your account, and send relevant updates regarding your atelier experience. We do not sell or rent your personal data to third parties.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-raw-ivory tracking-widest uppercase mb-4">3. Data Security</h2>
            <p>We implement state-of-the-art encryption and security measures to protect your sensitive data. All payments are processed securely through Razorpay, and we do not store your credit card information on our servers.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-raw-ivory tracking-widest uppercase mb-4">4. Cookies</h2>
            <p>We use cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can choose to disable cookies through your browser settings, though this may impact certain site functionalities.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-raw-ivory tracking-widest uppercase mb-4">5. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact our concierge team at support@therawhouse.in.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
