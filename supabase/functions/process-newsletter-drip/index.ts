import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { getNewsletter } from "./newsletter-templates.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const DRIP_INTERVAL_DAYS = 2; // Send next newsletter every 2 days

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Find subscribers who:
    // 1. Are active
    // 2. Haven't received all 10 newsletters yet
    // 3. Last email was sent >= DRIP_INTERVAL_DAYS ago (or they just signed up >= DRIP_INTERVAL_DAYS ago)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - DRIP_INTERVAL_DAYS);
    const cutoffISO = cutoffDate.toISOString();

    const { data: subscribers, error: fetchError } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("id, email, last_newsletter_sent, last_email_sent_at, subscribed_at")
      .eq("is_active", true)
      .lt("last_newsletter_sent", 10);

    if (fetchError) {
      console.error("Fetch error:", fetchError);
      throw new Error("Failed to fetch subscribers");
    }

    if (!subscribers || subscribers.length === 0) {
      console.log("No eligible subscribers found");
      return new Response(
        JSON.stringify({ success: true, message: "No eligible subscribers", sent: 0 }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Filter to only those where enough time has passed
    const eligible = subscribers.filter((sub) => {
      const lastSentAt = sub.last_email_sent_at || sub.subscribed_at;
      return new Date(lastSentAt) <= new Date(cutoffISO);
    });

    if (eligible.length === 0) {
      console.log("No subscribers ready for next newsletter yet");
      return new Response(
        JSON.stringify({ success: true, message: "No subscribers due yet", sent: 0 }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Processing ${eligible.length} subscribers for drip emails`);

    let sentCount = 0;
    const errors: string[] = [];

    // Process in batches of 10
    for (let i = 0; i < eligible.length; i += 10) {
      const batch = eligible.slice(i, i + 10);

      const sendPromises = batch.map(async (subscriber) => {
        const nextNewsletter = subscriber.last_newsletter_sent + 1;
        const newsletter = getNewsletter(nextNewsletter);

        if (!newsletter) {
          console.log(`No newsletter #${nextNewsletter} for ${subscriber.email}`);
          return;
        }

        try {
          await resend.emails.send({
            from: "Sienvi <noreply@sienvi.com>",
            to: [subscriber.email],
            subject: newsletter.subject,
            html: newsletter.html,
          });

          // Update subscriber record
          await supabaseAdmin
            .from("newsletter_subscribers")
            .update({
              last_newsletter_sent: nextNewsletter,
              last_email_sent_at: new Date().toISOString(),
            })
            .eq("id", subscriber.id);

          sentCount++;
          console.log(`Sent newsletter #${nextNewsletter} to ${subscriber.email}`);
        } catch (err: any) {
          console.error(`Failed to send to ${subscriber.email}:`, err);
          errors.push(subscriber.email);
        }
      });

      await Promise.all(sendPromises);
    }

    console.log(`Drip complete: ${sentCount}/${eligible.length} sent`);

    return new Response(
      JSON.stringify({
        success: true,
        sent: sentCount,
        total: eligible.length,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in process-newsletter-drip:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
