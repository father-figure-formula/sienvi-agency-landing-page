// Shared email template helpers for Sienvi newsletter
// All CTA links mapped per implementation plan

const CALENDAR_URL = "https://calendar.app.google/EgRs3h4riwwpo4cs6";
const SITE_URL = "https://sienvi.com";
const PDF_URL = `${SITE_URL}/20-hour-reclaim.pdf`;
const LOGO_URL = "https://ikazuqhukvtdorscoads.supabase.co/storage/v1/object/public/assets/sienvi-logo.png";

function wrapEmail(subject: string, bodyContent: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.7; background-color: #0f0f13; color: #e2e8f0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f0f13; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
          <!-- Header -->
          <tr>
            <td style="text-align: center; padding: 32px 32px 24px;">
              <img src="${LOGO_URL}" alt="Sienvi" width="120" style="display: inline-block;" />
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16162a 100%); border-radius: 16px; border: 1px solid rgba(139, 92, 246, 0.15); box-shadow: 0 4px 24px rgba(0,0,0,0.3);">
              <div style="padding: 40px 36px;">
                ${bodyContent}
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 32px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 13px; color: #6b7280;">
                © 2015 Sienvi. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 12px; color: #4b5563;">
                You received this because you subscribed to the Sienvi Newsletter.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(text: string, url: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin: 28px 0;">
  <tr>
    <td align="center">
      <a href="${url}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: #ffffff; font-weight: 600; font-size: 15px; padding: 14px 32px; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 14px rgba(139, 92, 246, 0.4);">${text}</a>
    </td>
  </tr>
</table>`;
}

function heading(text: string): string {
  return `<h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 700; color: #ffffff; line-height: 1.3;">${text}</h2>`;
}

function subheading(text: string): string {
  return `<h3 style="margin: 24px 0 12px; font-size: 18px; font-weight: 600; color: #c4b5fd;">${text}</h3>`;
}

function paragraph(text: string): string {
  return `<p style="margin: 0 0 16px; font-size: 15px; color: #cbd5e1; line-height: 1.7;">${text}</p>`;
}

function bulletList(items: string[]): string {
  const lis = items.map(i => `<li style="margin: 0 0 10px; font-size: 15px; color: #cbd5e1; padding-left: 4px;"><span style="color: #8b5cf6; font-weight: 600;">●</span> ${i}</li>`).join("");
  return `<ul style="margin: 0 0 20px; padding-left: 8px; list-style: none;">${lis}</ul>`;
}

function numberedList(items: string[]): string {
  const lis = items.map((item, i) => `<li style="margin: 0 0 10px; font-size: 15px; color: #cbd5e1; padding-left: 4px;"><span style="color: #8b5cf6; font-weight: 600;">${i+1}.</span> ${item}</li>`).join("");
  return `<ul style="margin: 0 0 20px; padding-left: 8px; list-style: none;">${lis}</ul>`;
}

function signoff(): string {
  return `<div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(139, 92, 246, 0.15);">
  <p style="margin: 0 0 4px; font-size: 15px; color: #cbd5e1;">To your success,</p>
  <p style="margin: 0; font-size: 15px; color: #ffffff; font-weight: 600;">The Sienvi Team</p>
</div>`;
}

// ─── WELCOME EMAIL ─────────────────────────────────────────
export function getWelcomeEmail(): { subject: string; html: string } {
  const subject = "Welcome to the Machine ⚙️ (And your first gift from Sienvi)";
  const body = `
${heading("Welcome to the Sienvi Community")}
${paragraph("First off—welcome.")}
${paragraph("You're here because you're likely an entrepreneur, a course creator, or a brand owner who is tired of the \"hustle culture\" trap. You know your business has potential, but you're currently the bottleneck.")}
${paragraph("At Sienvi, we have a very simple philosophy: <strong style=\"color:#ffffff;\">Don't work for your business. Build a business that works for you.</strong>")}
${paragraph("We spent 10,000+ hours coaching over 750 entrepreneurs to realize that growth isn't about working harder; it's about <em>Engineering Growth Systems</em>. Whether it's AI-driven automation, high-converting Amazon designs, or custom Learning Management Systems, we build the \"engines\" that drive recurring revenue.")}

${subheading("What you can expect from this newsletter:")}
${paragraph("Every week, we're going to pull back the curtain on how we scale brands like Snarky Humans, Father Figure Formula, and Blingy Bag. You'll get:")}
${bulletList([
  "<strong style=\"color:#ffffff;\">Automation Secrets:</strong> How to use AI to reclaim 20+ hours of your week.",
  "<strong style=\"color:#ffffff;\">Amazon Wins:</strong> The exact strategies we use to automate PPC and dominate listings.",
  "<strong style=\"color:#ffffff;\">The Operator's Mindset:</strong> Shifting from \"doing the work\" to \"owning the system.\"",
  "<strong style=\"color:#ffffff;\">Early Access:</strong> You'll be the first to hear about our new tools and limited-capacity coaching spots."
])}

${paragraph("As a thank you for joining, here's our <strong style=\"color:#8b5cf6;\">'20-Hour Reclaim' Audit</strong>. Use this 5-minute worksheet to find the 'hidden' 20 hours in your week that are currently being swallowed by manual tasks.")}
${ctaButton("Download Your 20-Hour Reclaim Audit", PDF_URL)}

${subheading("Your First \"Quick Win\":")}
${paragraph("Before our next deep dive, I want you to do one thing. Look at your calendar for the last 7 days and identify one task you did more than three times.")}
${bulletList([
  "Was it adjusting an ad bid?",
  "Answering a common customer question?",
  "Formatting a social media post?"
])}
${paragraph("If you did it three times, it can be automated. And if it can be automated, Sienvi can help.")}
${paragraph("We're thrilled to have you with us. Let's stop \"running ads\" and start engineering growth.")}

${signoff()}

${paragraph("<em style=\"color:#9ca3af;\">P.S. If you're ready to skip the line and see exactly how we can automate your specific business, you don't have to wait for the next email.</em>")}
${ctaButton("Book Your Strategy Call", CALENDAR_URL)}
`;
  return { subject, html: wrapEmail(subject, body) };
}

// ─── NEWSLETTER CONTENT ────────────────────────────────────

interface NewsletterContent {
  subject: string;
  html: string;
}

const newsletters: Record<number, () => NewsletterContent> = {
  1: () => {
    const subject = "Stop Babysitting Your Amazon Ads (Let Our AI Do It)";
    const body = `
${heading("The \"Set and Forget\" Amazon Engine")}
${paragraph("Most Amazon sellers are stuck in the \"PPC Death Loop.\"")}
${paragraph("You log in, check your ACOS, manually lower bids by 5 cents, and spend hours hunting through search term reports for negative keywords. By the time you're done, the data has already changed. You're trying to outrun an algorithm with manual labor.")}
${paragraph("At Sienvi, we don't \"manage\" ads—we <strong style=\"color:#ffffff;\">engineer growth systems.</strong>")}
${paragraph("We've built a proprietary automation suite that handles the heavy lifting while you sleep:")}
${bulletList([
  "<strong style=\"color:#ffffff;\">Dynamic Bid Optimization:</strong> Our AI monitors real-time performance and hits your target ACOS instantly.",
  "<strong style=\"color:#ffffff;\">Automatic Negative Keywords:</strong> We identify bleeding spend and \"negate\" poor terms before they drain your budget.",
  "<strong style=\"color:#ffffff;\">The Graduation System:</strong> When the tool finds a winning search term, it automatically creates a new Exact Match campaign to scale that winner.",
  "<strong style=\"color:#ffffff;\">Zero Manual Editing:</strong> No spreadsheets. No manual toggling."
])}
${paragraph("<strong style=\"color:#ffffff;\">The Bottom Line:</strong> You provide the vision; our tools provide the execution. Stop being a \"Dashboard Slave\" and start being the CEO.")}
${ctaButton("Book Your Strategy Call to See the Dashboard", CALENDAR_URL)}
${signoff()}
`;
    return { subject, html: wrapEmail(subject, body) };
  },

  2: () => {
    const subject = "Why most founders \"own a job,\" not a business.";
    const body = `
${heading("The \"Operator vs. Spectator\" Trap")}
${paragraph("There's a massive difference between being a \"spectator\" who watches their business and an \"operator\" who builds a machine.")}
${paragraph("At Sienvi, we were built by operators. We've spent 10,000+ hours in the trenches coaching 750+ entrepreneurs. The #1 mistake we see? Founders trying to do \"high-value\" work with \"low-value\" systems.")}
${paragraph("If you are still manually sending welcome emails, manually checking stock levels, or manually posting to five different social media channels—you don't have a business. <strong style=\"color:#ffffff;\">You have a very stressful job.</strong>")}
${paragraph("Our Agency Support & AI Automation is designed to give you your soul back. We build the workflows so you can focus on the big ideas that actually move the needle.")}
${paragraph("Are you ready to stop \"working in\" your business and start \"working on\" it?")}
${ctaButton("Explore Our Automation Packages", `${SITE_URL}/#pricing`)}
${signoff()}
`;
    return { subject, html: wrapEmail(subject, body) };
  },

  3: () => {
    const subject = "Is your brand ready for the \"Answer Engine\" era?";
    const body = `
${heading("The Future of Search (AEO)")}
${paragraph("SEO (Search Engine Optimization) is changing. Fast.")}
${paragraph("People aren't just typing keywords into Google anymore. They are asking ChatGPT, Claude, and Perplexity questions. This is the era of <strong style=\"color:#ffffff;\">AEO—Answer Engine Optimization.</strong>")}
${paragraph("If a potential customer asks an AI: \"Who is the best provider for [Your Service]?\"—will the AI name you?")}
${paragraph("Sienvi's SEO/AEO Package is built for the future. We don't just optimize for clicks; we optimize for \"Answers.\" We use modern AI tools to ensure your brand is the one the \"Answer Engines\" trust.")}
${paragraph("Don't get left behind in the old world of search. Let's get you cited by the bots.")}
${ctaButton("Learn How AEO Works for Your Brand", `${SITE_URL}/#contact`)}
${signoff()}
`;
    return { subject, html: wrapEmail(subject, body) };
  },

  4: () => {
    const subject = "Can AI actually sound like you? (The MelBot Story)";
    const body = `
${heading("Scaling the \"Soul\" of Your Brand")}
${paragraph("The biggest fear entrepreneurs have about AI is that it will sound \"robotic.\" They worry they'll lose the unique voice that built their brand.")}
${paragraph("<strong style=\"color:#ffffff;\">We proved that fear wrong with MelBot.</strong>")}
${paragraph("Working with Mel Goodson (Founder of Snarky Ventures), we built a branded AI assistant that captures her \"snarky\" voice perfectly. It doesn't just give answers; it gives them with personality.")}
${paragraph("At Sienvi, our <strong style=\"color:#8b5cf6;\">Custom AI Assistants</strong> ingest your specific knowledge, your tone, and your brand's \"soul.\" Whether it's handling customer queries or streamlining VA workflows, it stays 100% \"you.\"")}
${paragraph("Automation doesn't have to be cold. It just has to be smart.")}
${ctaButton("Build Your Own Branded AI Assistant", `${SITE_URL}/#contact`)}
${signoff()}
`;
    return { subject, html: wrapEmail(subject, body) };
  },

  5: () => {
    const subject = "Why your \"Mini-Course\" isn't scaling to 6-figures.";
    const body = `
${heading("The High-Ticket Course Secret")}
${paragraph("Most course creators focus 100% on the marketing and 0% on the Learning Experience.")}
${paragraph("If your students are getting lost in a messy Google Drive or a generic platform, they won't finish the course. And if they don't finish, <strong style=\"color:#ffffff;\">they won't buy your next offer.</strong>")}
${paragraph("Sienvi's Custom LMS (Learning Management System) Package is designed for retention. We build:")}
${bulletList([
  "Tailored learning portals that reflect your brand.",
  "Automated student progress tracking.",
  "Interactive quizzes to keep them engaged."
])}
${paragraph("Stop selling \"information\" and start selling \"transformation.\" A professional LMS is the difference between a side hustle and a world-class education company.")}
${ctaButton("See Our LMS Solutions", `${SITE_URL}/#contact`)}
${signoff()}
`;
    return { subject, html: wrapEmail(subject, body) };
  },

  6: () => {
    const subject = "Why 1 + 1 = 3 in Business Automation.";
    const body = `
${heading("The Power of the \"Stack\"")}
${paragraph("In isolation, a social media post is just noise. An AI chatbot is just a tool. But when you <strong style=\"color:#ffffff;\">stack them?</strong> That's when you build a \"Growth Machine.\"")}
${paragraph("This is why our <strong style=\"color:#8b5cf6;\">Triple Automation</strong> package is our most popular.")}
${paragraph("Imagine this:")}
${numberedList([
  "Your <strong style=\"color:#ffffff;\">Social Media Suite</strong> drives traffic automatically.",
  "Your <strong style=\"color:#ffffff;\">SEO/AEO</strong> captures the searchers.",
  "Your <strong style=\"color:#ffffff;\">Custom AI Assistant</strong> converts that traffic into leads 24/7."
])}
${paragraph("When these systems talk to each other, you stop chasing leads. They start flowing to you. At Sienvi, we don't just give you tools; we give you an <strong style=\"color:#ffffff;\">integrated ecosystem.</strong>")}
${ctaButton("Check Out Our Bundled Pricing and Save 10-25%", `${SITE_URL}/#pricing`)}
${signoff()}
`;
    return { subject, html: wrapEmail(subject, body) };
  },

  7: () => {
    const subject = "You have 3 seconds. Don't waste them.";
    const body = `
${heading("Amazon Design That Converts")}
${paragraph("An Amazon shopper clicks your listing. You have exactly <strong style=\"color:#ffffff;\">3 seconds</strong> to prove you aren't a \"cheap knock-off\" before they bounce.")}
${paragraph("If your A+ Content looks like it was made in 2015, you are leaving money on the table.")}
${paragraph("Our Amazon Design Package focuses on \"Conversion-First\" creative:")}
${bulletList([
  "High-end Brand Story design.",
  "Psychology-driven infographics.",
  "Mobile-optimized storefronts."
])}
${paragraph("We've seen brands <strong style=\"color:#ffffff;\">double their conversion rate</strong> simply by fixing their visual storytelling. Don't let a bad image kill a great product.")}
${ctaButton("Upgrade Your Amazon Presence Today", `${SITE_URL}/#contact`)}
${signoff()}
`;
    return { subject, html: wrapEmail(subject, body) };
  },

  8: () => {
    const subject = "What would you do with 20 extra hours a week?";
    const body = `
${heading("Reclaiming Your Time")}
${paragraph("Close your eyes and imagine your Monday morning without:")}
${bulletList([
  "Checking ad spends.",
  "Scheduling social posts.",
  "Answering \"Where is my order?\" emails."
])}
${paragraph("For most founders, that's a dream. For Sienvi clients, <strong style=\"color:#ffffff;\">it's a reality.</strong>")}
${paragraph("Automation isn't about being lazy; it's about <strong style=\"color:#8b5cf6;\">leverage</strong>. By automating the \"boring\" stuff, you reclaim the time to be a visionary, spend time with family, or even start your next venture.")}
${paragraph("We provide the \"Operational Workflows\" that make growth sustainable. Let's get those 20 hours back.")}
${ctaButton("Book a Call – Let's Audit Your Time", CALENDAR_URL)}
${signoff()}
`;
    return { subject, html: wrapEmail(subject, body) };
  },

  9: () => {
    const subject = "From \"Just an Idea\" to Prototype in < 30 Days.";
    const body = `
${heading("Case Study – The \"Idea to Reality\" Journey")}
${paragraph("Most people sit on a great business idea for years. They get stuck in the \"Research Phase.\"")}
${paragraph("When Sienvi partners with an asset owner, we move at the <strong style=\"color:#ffffff;\">speed of AI</strong>. Take our recent work with Snarky Pets. We moved from a \"what if\" conversation to a working prototype of a branded AI assistant and an automated advertising workflow in less than a month.")}
${paragraph("<strong style=\"color:#ffffff;\">We don't do \"fluff.\" We do execution.</strong>")}
${paragraph("If you have an asset (an audience, a product, or a reputation) but you're missing the \"engine\" to drive it, we are the team that builds it. Fast.")}
${ctaButton("Read the Full Success Story", `${SITE_URL}/#contact`)}
${signoff()}
`;
    return { subject, html: wrapEmail(subject, body) };
  },

  10: () => {
    const subject = "Why we don't have \"Customers.\"";
    const body = `
${heading("The \"Agency Extension\" Philosophy")}
${paragraph("At Sienvi, we don't want \"customers.\" We want <strong style=\"color:#ffffff;\">Partners.</strong>")}
${paragraph("Most agencies treat you like a ticket number. They send a monthly report you don't understand and ghost you when things get tough.")}
${paragraph("We operate as an <strong style=\"color:#8b5cf6;\">extension of your team</strong>:")}
${bulletList([
  "High standards of ownership.",
  "Clear, proactive communication.",
  "A focus on outcomes, not just outputs."
])}
${paragraph("Whether you are a solo founder or a scaling company, we bring the strategy, systems, and performance thinking to unlock your next level. <strong style=\"color:#ffffff;\">We win when you win.</strong>")}
${paragraph("Are you ready for a partner that cares as much as you do?")}
${ctaButton("Let's Talk – Schedule Your Strategy Call", CALENDAR_URL)}
${signoff()}
`;
    return { subject, html: wrapEmail(subject, body) };
  },
};

export function getNewsletter(num: number): NewsletterContent | null {
  const factory = newsletters[num];
  if (!factory) return null;
  return factory();
}
