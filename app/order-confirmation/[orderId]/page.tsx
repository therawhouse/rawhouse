import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight, Download } from "lucide-react";
import { redirect } from "next/navigation";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  
  // orderId might be the UUID or the short orderNumber, let's query by UUID since that's what we usually redirect with
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { product: { include: { images: true } } }
      },
      shippingAddress: true,
      user: true
    }
  });

  if (!order) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-raw-bg pt-32 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Success Header */}
        <div className="text-center space-y-6 mb-12 border-b border-raw-border pb-12">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
          <div>
            <h1 className="text-3xl font-serif-luxury text-raw-ivory tracking-widest uppercase mb-2">
              Order Confirmed
            </h1>
            <p className="text-raw-muted text-sm tracking-wider">
              Thank you for choosing The Raw House, {order.user.name || order.user.firstName || 'Guest'}.
            </p>
          </div>
          <div className="inline-block bg-raw-card border border-raw-border px-6 py-3 rounded-sm">
            <p className="text-[10px] text-raw-muted uppercase tracking-[0.2em] mb-1">Order Number</p>
            <p className="font-mono text-raw-gold text-lg font-bold">{order.orderNumber}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Shipping Info */}
          <div className="bg-raw-card border border-raw-border p-6 space-y-4">
            <h3 className="text-sm font-serif-luxury text-raw-gold uppercase tracking-widest border-b border-raw-border pb-2">
              Shipping Destination
            </h3>
            <div className="text-xs text-raw-ivory space-y-1">
              <p className="font-bold">{order.shippingAddress.fullName}</p>
              <p className="text-raw-muted">{order.shippingAddress.streetAddress}</p>
              {order.shippingAddress.apartment && <p className="text-raw-muted">{order.shippingAddress.apartment}</p>}
              <p className="text-raw-muted">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
              <p className="text-raw-muted pt-2">{order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-raw-card border border-raw-border p-6 space-y-4">
            <h3 className="text-sm font-serif-luxury text-raw-gold uppercase tracking-widest border-b border-raw-border pb-2">
              Payment Details
            </h3>
            <div className="text-xs space-y-3">
              <div className="flex justify-between">
                <span className="text-raw-muted">Method</span>
                <span className="text-raw-ivory font-bold">Razorpay</span>
              </div>
              <div className="flex justify-between">
                <span className="text-raw-muted">Payment ID</span>
                <span className="text-raw-ivory font-mono">{order.razorpayPaymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-raw-muted">Total Paid</span>
                <span className="text-raw-gold font-bold text-sm">₹{order.totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-raw-card border border-raw-border p-6 mb-12">
          <h3 className="text-sm font-serif-luxury text-raw-gold uppercase tracking-widest border-b border-raw-border pb-4 mb-4">
            Atelier Items
          </h3>
          <div className="space-y-6">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                {item.product.images?.[0]?.url ? (
                  <img src={item.product.images[0].url} alt={item.product.title} className="w-16 h-20 object-cover border border-raw-border" />
                ) : (
                  <div className="w-16 h-20 bg-raw-bg border border-raw-border" />
                )}
                <div className="flex-1 text-xs">
                  <h4 className="font-serif-luxury text-raw-ivory text-sm">{item.product.title}</h4>
                  <p className="text-raw-muted mt-1">Qty: {item.quantity}</p>
                  <p className="text-raw-gold font-bold mt-2">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/catalog" className="flex items-center justify-center space-x-2 bg-raw-gold text-raw-bg px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-raw-goldHover transition-colors">
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/account/orders" className="flex items-center justify-center space-x-2 border border-raw-border text-raw-muted px-8 py-3 text-xs font-bold uppercase tracking-widest hover:text-raw-ivory transition-colors">
            <Package className="w-4 h-4" />
            <span>Track Order</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
