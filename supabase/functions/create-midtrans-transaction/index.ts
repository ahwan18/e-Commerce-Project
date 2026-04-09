import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import midtransClient from "npm:midtrans-client@1.4.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface TransactionRequest {
  order_id: string;
  gross_amount: number;
  customer_details: {
    first_name: string;
    phone: string;
  };
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
      JSON.stringify({ status: "ok", message: "Use POST to create transaction" }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
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
      },
    );
  }

  try {
    let body: TransactionRequest;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON payload" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }
    console.log("[create-midtrans-transaction] Incoming payload:", body);

    const serverKey = Deno.env.get("MIDTRANS_SERVER_KEY");
    const isProduction = false;

    if (!serverKey) {
      return new Response(
        JSON.stringify({ error: "MIDTRANS_SERVER_KEY is not configured" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!body.order_id || !body.gross_amount || !body.customer_details?.first_name || !body.customer_details?.phone) {
      return new Response(
        JSON.stringify({ error: "Missing required transaction fields" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const snap = new midtransClient.Snap({
      isProduction,
      serverKey,
    });

    const parameter = {
      transaction_details: {
        order_id: body.order_id,
        gross_amount: body.gross_amount,
      },
      customer_details: {
        first_name: body.customer_details.first_name,
        phone: body.customer_details.phone,
      },
    };

    console.log("[create-midtrans-transaction] Creating snap transaction:", parameter);
    const transaction = await snap.createTransaction(parameter);
    console.log("[create-midtrans-transaction] Midtrans response:", transaction);

    return new Response(
      JSON.stringify({
        snap_token: transaction.token,
        transaction_id: body.order_id,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("[create-midtrans-transaction] Error:", error);
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
