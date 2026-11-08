/**
 * Professional transactional email templates
 * HTML responsive & accessible, professional corporate design
 */

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export function getOtpVerificationEmailTemplate(otpCode: string): EmailTemplate {
  const charcoal = '#0B0F19';
  const accent = '#10B981';
  const lightGray = '#F3F4F6';
  const darkGray = '#4B5563';
  const mediumGray = '#6B7280';
  const borderGray = '#E5E7EB';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9fafb;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: white;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid ${borderGray};
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, ${charcoal} 0%, #1a2332 100%);
      padding: 32px 24px;
      text-align: center;
    }
    .header-title {
      margin: 0;
      color: white;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 32px 24px;
      color: ${charcoal};
    }
    .greeting {
      font-size: 16px;
      font-weight: 500;
      margin: 0 0 16px 0;
      color: ${charcoal};
    }
    .message {
      font-size: 14px;
      line-height: 1.6;
      color: ${darkGray};
      margin: 0 0 24px 0;
    }
    .otp-section {
      background-color: ${lightGray};
      border-radius: 8px;
      padding: 24px;
      text-align: center;
      margin: 28px 0;
      border-left: 4px solid ${accent};
    }
    .otp-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: ${mediumGray};
      margin: 0 0 12px 0;
    }
    .otp-code {
      font-size: 42px;
      font-weight: 700;
      letter-spacing: 8px;
      color: ${charcoal};
      font-family: 'Courier New', monospace;
      margin: 12px 0;
      word-spacing: 12px;
    }
    .otp-validity {
      font-size: 12px;
      color: ${mediumGray};
      margin: 12px 0 0 0;
      font-style: italic;
    }
    .security-notice {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 12px 16px;
      border-radius: 4px;
      margin: 24px 0;
      font-size: 13px;
      color: #92400e;
      line-height: 1.5;
    }
    .footer {
      border-top: 1px solid ${borderGray};
      padding: 24px;
      background-color: #fafbfc;
      font-size: 12px;
      color: ${mediumGray};
      text-align: center;
    }
    .footer-text {
      margin: 8px 0;
    }
    .company-signature {
      font-weight: 600;
      color: ${charcoal};
      margin-top: 12px;
    }
    a {
      color: ${accent};
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    @media (max-width: 600px) {
      .container {
        margin: 0;
        border-radius: 0;
      }
      .header {
        padding: 24px 16px;
      }
      .content {
        padding: 24px 16px;
      }
      .otp-code {
        font-size: 36px;
        letter-spacing: 6px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="header-title">Email Verification</h1>
    </div>

    <div class="content">
      <p class="greeting">Hello,</p>

      <p class="message">
        Thank you for registering with CMMM Exporter. To complete your account activation and ensure the security of your account, please verify your email address using the code below.
      </p>

      <div class="otp-section">
        <p class="otp-label">Your Verification Code</p>
        <div class="otp-code">${otpCode}</div>
        <p class="otp-validity">This code expires in 10 minutes</p>
      </div>

      <div class="security-notice">
        <strong>Security Notice:</strong> Do not share this code with anyone. CMMM support staff will never ask for your verification code. If you did not initiate this registration, please ignore this email or <a href="mailto:support@cmmm.com">contact our support team</a>.
      </div>

      <p class="message">
        Once you enter this code in the verification field, your account will be fully activated and you can begin placing orders.
      </p>
    </div>

    <div class="footer">
      <p class="footer-text">CMMM Charcoal Briquettes Exporter</p>
      <p class="footer-text">Customer Support Team</p>
      <p class="footer-text">
        <a href="https://cmmm.com">Visit our website</a> |
        <a href="mailto:support@cmmm.com">Contact Support</a>
      </p>
      <p class="footer-text" style="margin-top: 16px; font-size: 11px; color: #9ca3af;">
        This is an automated security email. Please do not reply to this message.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
CMMM Exporter - Email Verification

Hello,

Thank you for registering with CMMM Exporter. To complete your account activation, please use the following verification code:

${otpCode}

This code expires in 10 minutes.

IMPORTANT SECURITY NOTICE:
Do not share this code with anyone. CMMM support staff will never ask for your verification code. If you did not initiate this registration, please ignore this email or contact our support team at support@cmmm.com.

Once you enter this code, your account will be fully activated and you can begin placing orders.

---
CMMM Charcoal Briquettes Exporter
Customer Support Team
https://cmmm.com
  `.trim();

  return {
    subject: 'Verify Your Email Address — Account Activation',
    html,
    text,
  };
}
