-- Add last_email_sent_at column to track drip timing
ALTER TABLE public.newsletter_subscribers
  ADD COLUMN IF NOT EXISTS last_email_sent_at TIMESTAMPTZ;

-- Enable pg_cron and pg_net extensions (needed for scheduled HTTP calls)
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Schedule the drip processor to run daily at 9:00 AM UTC
-- It checks each subscriber's timing and sends the next newsletter if 2+ days have passed
SELECT cron.schedule(
  'newsletter-drip-processor',
  '0 9 * * *',  -- every day at 09:00 UTC
  $$
  SELECT net.http_post(
    url := 'https://ikazuqhukvtdorscoads.supabase.co/functions/v1/process-newsletter-drip',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);
