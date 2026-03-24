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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { newsletter_number } = await req.json();

    if (!newsletter_number || newsletter_number < 1 || newsletter_number > 10) {
      return new Response(
        JSON.stringify({ error: "newsletter_number must be between 1 and 10" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const newsletter = getNewsletter(newsletter_number);
    if (!newsletter) {
      return new Response(
        JSON.stringify({ error: `Newsletter #${newsletter_number} not found` }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get all active subscribers who haven't received this newsletter yet
    const { data: subscribers, error: fetchError } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("id, email")
      .eq("is_active", true)
      .lt("last_newsletter_sent", newsletter_number);

    if (fetchError) {
      console.error("Fetch error:", fetchError);
      throw new Error("Failed to fetch subscribers");
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No eligible subscribers found", sent: 0 }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Sending newsletter #${newsletter_number} to ${subscribers.length} subscribers`);

    let sentCount = 0;
    const errors: string[] = [];

    // Send in batches of 10 to respect rate limits
    for (let i = 0; i < subscribers.length; i += 10) {
      const batch = subscribers.slice(i, i + 10);

      const sendPromises = batch.map(async (subscriber) => {
        try {
          await resend.emails.send({
            from: "Sienvi <noreply@sienvi.com>",
            to: [subscriber.email],
            subject: newsletter.subject,
            html: newsletter.html,
          });

          // Update last_newsletter_sent
          await supabaseAdmin
            .from("newsletter_subscribers")
            .update({ last_newsletter_sent: newsletter_number })
            .eq("id", subscriber.id);

          sentCount++;
        } catch (err: any) {
          console.error(`Failed to send to ${subscriber.email}:`, err);
          errors.push(subscriber.email);
        }
      });

      await Promise.all(sendPromises);
    }

    console.log(`Newsletter #${newsletter_number} sent to ${sentCount}/${subscribers.length} subscribers`);

    return new Response(
      JSON.stringify({
        success: true,
        sent: sentCount,
        total: subscribers.length,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-newsletter:", error);
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
