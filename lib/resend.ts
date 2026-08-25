import { Resend } from "resend";

/**
 * ============================================================================
 * THE RAW HOUSE - Resend Transactional Email Engine
 * ============================================================================
 */

const resendApiKey = process.env.RESEND_API_KEY || "re_placeholder_key";
export const resend = new Resend(resendApiKey);

const SENDER_EMAIL = "The Raw House <orders@rawhouse.in>";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes("placeholder")) {
      console.log(`[Email Service Simulation] Sent email to ${to}: ${subject}`);
      return { success: true, id: "simulated-email-id" };
    }
    const data = await resend.emails.send({
      from: SENDER_EMAIL,
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Resend Email Error:", error);
    return { success: false, error };
  }
}

/**
 * Luxury styled HTML Email Layout wrapper matching The Raw House editorial visual guidelines
 */
export function wrapLuxuryEmailTemplate(title: string, bodyContent: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #140e0c; color: #f9f6f0; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #1b1210; border: 1px solid #2e211d; padding: 40px; }
        .logo-box { text-align: center; padding-bottom: 30px; border-bottom: 1px solid #2e211d; }
        .logo-title { font-family: 'Times New Roman', serif; font-size: 28px; letter-spacing: 4px; color: #c69255; text-transform: uppercase; margin: 0; }
        .logo-sub { font-size: 10px; letter-spacing: 6px; color: #a89b95; text-transform: uppercase; margin-top: 5px; }
        .content { padding: 30px 0; line-height: 1.6; font-size: 15px; color: #e8dfd1; }
        .btn { display: inline-block; background-color: #c69255; color: #140e0c; font-weight: bold; text-decoration: none; padding: 14px 28px; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; margin-top: 20px; border-radius: 2px; }
        .footer { border-top: 1px solid #2e211d; padding-top: 20px; text-align: center; font-size: 12px; color: #a89b95; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo-box">
          <div class="logo-title">THE RAW HOUSE</div>
          <div class="logo-sub">LUXURY ATELIER & APPAREL</div>
        </div>
        <div class="content">
          ${bodyContent}
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} The Raw House. All rights reserved.</p>
          <p>rawhouse.in | Concierge: support@rawhouse.in</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ----------------------------------------------------------------------------
// Email Template Generators
// ----------------------------------------------------------------------------

export function getOrderConfirmationEmailHtml(orderNumber: string, customerName: string, totalAmount: number) {
  const content = `
    <h2>Order Confirmation #${orderNumber}</h2>
    <p>Dear ${customerName},</p>
    <p>Thank you for choosing <strong>The Raw House</strong>. We are pleased to confirm that your order has been received and is currently being curated at our atelier.</p>
    <p><strong>Order Summary:</strong></p>
    <p style="font-size: 18px; color: #c69255;">Total: ₹${totalAmount.toLocaleString('en-IN')}</p>
    <p>You can track your order status in real time by visiting your account profile.</p>
    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/account/orders/${orderNumber}" class="btn">View Order Details</a>
  `;
  return wrapLuxuryEmailTemplate("Order Confirmation - The Raw House", content);
}

export function getWelcomeEmailHtml(customerName: string) {
  const content = `
    <h2>Welcome to The Raw House Atelier</h2>
    <p>Dear ${customerName},</p>
    <p>We are delighted to welcome you to our world of refined craftsmanship and modern editorial design.</p>
    <p>As a member, you gain priority access to limited runway releases, private capsule collections, and bespoke atelier appointments.</p>
    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/collections" class="btn">Explore Collections</a>
  `;
  return wrapLuxuryEmailTemplate("Welcome to The Raw House", content);
}

export function getAdminNewOrderEmailHtml(orderNumber: string, customerName: string, customerEmail: string, totalAmount: number) {
  const content = `
    <h2>New Order Received: #${orderNumber}</h2>
    <p>A new order has been placed on The Raw House.</p>
    <p><strong>Customer Details:</strong><br/>
    Name: ${customerName}<br/>
    Email: ${customerEmail}</p>
    <p><strong>Order Summary:</strong></p>
    <p style="font-size: 18px; color: #c69255;">Total: ₹${totalAmount.toLocaleString('en-IN')}</p>
    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/orders" class="btn">View in Admin Dashboard</a>
  `;
  return wrapLuxuryEmailTemplate("New Order Received", content);
}
