import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface MidtransNotification {
  transaction_id: string;
  order_id: string;
  transaction_status: string;
  fraud_status?: string;
  status_code?: string;
  gross_amount?: string;
  signature_key?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method === "GET") {
    return new Response(
      JSON.stringify({ status: "ok" }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const notification: MidtransNotification = await req.json();
    console.log("[midtrans-webhook] Incoming notification:", notification);

    const serverKey = Deno.env.get("MIDTRANS_SERVER_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");
      return new Response(
        JSON.stringify({ error: "Configuration error" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (serverKey && notification.signature_key && notification.status_code && notification.gross_amount) {
      const crypto = await import("node:crypto");
      const hash = crypto
        .createHash("sha512")
        .update(
          `${notification.order_id}${notification.status_code}${notification.gross_amount}${serverKey}`,
        )
        .digest("hex");

      if (hash !== notification.signature_key) {
        console.error("[midtrans-webhook] Invalid signature");
        return new Response(
          JSON.stringify({ error: "Invalid signature" }),
          {
            status: 403,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let orderStatus = "pending";
    if (notification.transaction_status === "settlement") {
      orderStatus = "paid";
    } else if (
      notification.transaction_status === "capture" &&
      notification.fraud_status !== "challenge"
    ) {
      orderStatus = "paid";
    } else if (notification.transaction_status === "deny") {
      orderStatus = "cancelled";
    } else if (notification.transaction_status === "expire") {
      orderStatus = "cancelled";
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: orderStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", notification.order_id);

    if (updateError) {
      console.error("[midtrans-webhook] Error updating order:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update order" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ status: "success", order_id: notification.order_id, order_status: orderStatus }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("[midtrans-webhook] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
