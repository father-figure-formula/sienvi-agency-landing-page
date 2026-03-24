-- Create newsletter_subscribers table
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_newsletter_sent INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (signup from landing page)
CREATE POLICY "Allow anonymous inserts" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Allow service role full access (for edge functions)
CREATE POLICY "Allow service role full access" ON public.newsletter_subscribers
  FOR ALL USING (true) WITH CHECK (true);
