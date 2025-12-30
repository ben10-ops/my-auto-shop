import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderStatusRequest {
  orderId: string;
  newStatus: string;
  customerEmail: string;
  customerName: string;
  orderNumber: string;
}

const getStatusMessage = (status: string): { subject: string; message: string } => {
  const messages: Record<string, { subject: string; message: string }> = {
    processing: {
      subject: "Your order is being processed",
      message: "We have received your order and are now processing it. We'll notify you once it's shipped.",
    },
    shipped: {
      subject: "Your order has been shipped!",
      message: "Great news! Your order is on its way. You can expect delivery within 2-5 business days.",
    },
    delivered: {
      subject: "Your order has been delivered",
      message: "Your order has been successfully delivered. Thank you for shopping with us!",
    },
    cancelled: {
      subject: "Your order has been cancelled",
      message: "Your order has been cancelled. If you have any questions, please contact our support team.",
    },
  };

  return messages[status] || {
    subject: `Order status update: ${status}`,
    message: `Your order status has been updated to: ${status}`,
  };
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, newStatus, customerEmail, customerName, orderNumber }: OrderStatusRequest = await req.json();

    console.log(`Sending order status email for order ${orderNumber} to ${customerEmail}`);

    const { subject, message } = getStatusMessage(newStatus);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #ffffff; border-radius: 8px; padding: 32px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #f59e0b; margin: 0; font-size: 24px;">Mahalaxmi Automobiles</h1>
            </div>
            
            <h2 style="color: #1f2937; margin-bottom: 16px;">Hello ${customerName || 'Valued Customer'},</h2>
            
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 16px;">
              ${message}
            </p>
            
            <div style="background-color: #f9fafb; border-radius: 6px; padding: 16px; margin: 24px 0;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Order Number</p>
              <p style="margin: 4px 0 0; color: #1f2937; font-size: 18px; font-weight: 600;">${orderNumber}</p>
              <p style="margin: 12px 0 0; color: #6b7280; font-size: 14px;">Status</p>
              <p style="margin: 4px 0 0; color: #f59e0b; font-size: 16px; font-weight: 600; text-transform: capitalize;">${newStatus}</p>
            </div>
            
            <p style="color: #4b5563; line-height: 1.6;">
              If you have any questions about your order, please don't hesitate to contact us.
            </p>
            
            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
                Mahalaxmi Automobiles<br>
                123 Auto Market Road, Mumbai - 400001<br>
                +91 98765 43210
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Mahalaxmi Automobiles <onboarding@resend.dev>",
        to: [customerEmail],
        subject: `${subject} - Order #${orderNumber}`,
        html: emailHtml,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend API error:", data);
      throw new Error(data.message || "Failed to send email");
    }

    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending order status email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
