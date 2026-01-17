// Shared email template system for clean, modern, premium emails
// Design: Minimal, calm, trustworthy - no heavy branding

export const colors = {
  primary: "#667eea",
  primaryDark: "#5a67d8",
  accent: "#764ba2",
  success: "#10b981",
  successDark: "#059669",
  text: "#1f2937",
  textSecondary: "#6b7280",
  textMuted: "#9ca3af",
  bgPage: "#f8fafc",
  bgCard: "#ffffff",
  bgSubtle: "#f1f5f9",
  border: "#e2e8f0",
  borderLight: "#f1f5f9",
};

// Base email wrapper - clean, minimal structure
export const emailWrapper = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sienvi</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; background-color: ${colors.bgPage}; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${colors.bgPage}; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="max-width: 520px; width: 100%;">
          ${content}
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 0 0 0; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 13px; color: ${colors.textMuted};">
                Questions? Contact <a href="mailto:teamsienvi@gmail.com" style="color: ${colors.primary}; text-decoration: none;">teamsienvi@gmail.com</a>
              </p>
              <p style="margin: 16px 0 0 0; font-size: 12px; color: ${colors.textMuted};">
                © 2015 Sienvi. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Card container with subtle brand accent
export const emailCard = (content: string, accentColor: string = colors.primary) => `
<tr>
  <td style="background: ${colors.bgCard}; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); overflow: hidden; border-top: 3px solid ${accentColor};">
    ${content}
  </td>
</tr>
`;

// Clean header - just text, no heavy branding
export const emailHeader = (headline: string, subtitle?: string) => `
<div style="padding: 32px 32px 24px 32px; text-align: center; border-bottom: 1px solid ${colors.borderLight};">
  <h1 style="margin: 0; font-size: 22px; font-weight: 600; color: ${colors.text}; letter-spacing: -0.3px;">${headline}</h1>
  ${subtitle ? `<p style="margin: 8px 0 0 0; font-size: 14px; color: ${colors.textSecondary};">${subtitle}</p>` : ''}
</div>
`;

// Body content wrapper
export const emailBody = (content: string) => `
<div style="padding: 28px 32px 32px 32px;">
  ${content}
</div>
`;

// Greeting with client name
export const emailGreeting = (name: string) => `
<p style="margin: 0 0 16px 0; font-size: 15px; color: ${colors.text};">Hi ${name},</p>
`;

// Body paragraph
export const emailParagraph = (text: string) => `
<p style="margin: 0 0 16px 0; font-size: 15px; color: ${colors.textSecondary}; line-height: 1.6;">${text}</p>
`;

// Primary CTA button - centered, modern, rounded
export const emailButton = (text: string, url: string, variant: 'primary' | 'success' = 'primary') => {
  const bgColor = variant === 'success' ? colors.success : colors.primary;
  return `
<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center" style="padding: 24px 0 8px 0;">
      <a href="${url}" style="display: inline-block; background: ${bgColor}; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 500; font-size: 14px;">
        ${text}
      </a>
    </td>
  </tr>
</table>
`;
};

// Info/tip box - subtle, not loud
export const emailTip = (text: string) => `
<div style="background: ${colors.bgSubtle}; border-radius: 8px; padding: 14px 16px; margin: 20px 0 0 0;">
  <p style="margin: 0; font-size: 13px; color: ${colors.textSecondary}; line-height: 1.5;">
    ${text}
  </p>
</div>
`;

// Expiry/helper note - small, muted
export const emailNote = (text: string) => `
<p style="margin: 20px 0 0 0; font-size: 12px; color: ${colors.textMuted}; text-align: center;">${text}</p>
`;

// Simple details card
export const emailDetails = (items: { label: string; value: string; highlight?: boolean }[]) => `
<div style="background: ${colors.bgSubtle}; border-radius: 8px; padding: 16px 20px; margin: 20px 0;">
  ${items.map((item, i) => `
    <div style="display: flex; justify-content: space-between; padding: 8px 0; ${i < items.length - 1 ? `border-bottom: 1px solid ${colors.border};` : ''}">
      <span style="font-size: 13px; color: ${colors.textSecondary};">${item.label}</span>
      <span style="font-size: 13px; font-weight: ${item.highlight ? '600' : '500'}; color: ${item.highlight ? colors.primary : colors.text};">${item.value}</span>
    </div>
  `).join('')}
</div>
`;

// Simple step list
export const emailSteps = (steps: { text: string; done?: boolean }[]) => `
<div style="margin: 16px 0;">
  ${steps.map((step, i) => `
    <div style="display: flex; align-items: center; padding: 8px 0;">
      <div style="width: 20px; height: 20px; background: ${step.done ? colors.success : colors.bgSubtle}; border-radius: 50%; margin-right: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
        ${step.done 
          ? `<span style="color: #ffffff; font-size: 11px;">✓</span>`
          : `<span style="color: ${colors.textMuted}; font-size: 11px; font-weight: 500;">${i + 1}</span>`
        }
      </div>
      <span style="font-size: 14px; color: ${step.done ? colors.textMuted : colors.text}; ${step.done ? 'text-decoration: line-through;' : ''}">${step.text}</span>
    </div>
  `).join('')}
</div>
`;

// Success badge for headers
export const emailSuccessBadge = () => `
<div style="width: 48px; height: 48px; background: ${colors.success}; border-radius: 50%; margin: 0 auto 16px auto; display: flex; align-items: center; justify-content: center;">
  <span style="color: #ffffff; font-size: 20px; line-height: 48px;">✓</span>
</div>
`;
