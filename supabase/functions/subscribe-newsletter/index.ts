import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { getWelcomeEmail } from "./newsletter-templates.ts";

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
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client with service role key to bypass RLS for reads/updates
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if already subscribed
    const { data: existing } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("id, is_active")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (existing) {
      if (existing.is_active) {
        return new Response(
          JSON.stringify({ success: true, alreadySubscribed: true }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      // Reactivate
      await supabaseAdmin
        .from("newsletter_subscribers")
        .update({ is_active: true, last_newsletter_sent: 0 })
        .eq("id", existing.id);
    } else {
      // Insert new subscriber
      const { error: insertError } = await supabaseAdmin
        .from("newsletter_subscribers")
        .insert({ email: email.toLowerCase(), last_email_sent_at: new Date().toISOString() });

      if (insertError) {
        console.error("Insert error:", insertError);
        throw new Error("Failed to save subscriber");
      }
    }

    // Send welcome email
    const welcomeEmail = getWelcomeEmail();
    const emailResponse = await resend.emails.send({
      from: "Sienvi <noreply@sienvi.com>",
      to: [email],
      subject: welcomeEmail.subject,
      html: welcomeEmail.html,
    });

    console.log("Welcome email sent:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, data: emailResponse }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in subscribe-newsletter:", error);
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
