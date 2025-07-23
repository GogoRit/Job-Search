import { RequestHandler } from "express";
import { config } from "../config";

// Mock email sending service
async function sendEmail(to: string, subject: string, content: string) {
  if (!config.gmail.clientId && !config.smtp.host) {
    throw new Error("Email service not configured");
  }

  // TODO: Implement actual email sending (Gmail API or SMTP)
  console.log(`[MOCK EMAIL] To: ${to}, Subject: ${subject}`);
  return { messageId: `mock_${Date.now()}`, status: "sent" };
}

// Send outreach email
export const handleSendEmail: RequestHandler = async (req, res) => {
  try {
    const { to, subject, content } = req.body;

    if (!to || !subject || !content) {
      return res.status(400).json({ 
        error: "to, subject, and content are required" 
      });
    }

    if (!config.gmail.clientId && !config.smtp.host) {
      return res.status(503).json({
        error: "Email service not available",
        message: "Please configure Gmail or SMTP credentials in your environment variables."
      });
    }

    const result = await sendEmail(to, subject, content);
    
    res.json({
      success: true,
      data: result,
      message: "Email sent successfully (currently using mock service)"
    });

  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ 
      error: "Failed to send email",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Get email templates
export const handleGetTemplates: RequestHandler = (_req, res) => {
  const templates = [
    {
      id: "cold_outreach",
      name: "Cold Outreach",
      subject: "Interest in {{jobTitle}} position at {{company}}",
      content: `Hi {{recipientName}},

I hope this message finds you well. I noticed the {{jobTitle}} position at {{company}} and I'm very interested in the opportunity.

{{personalNote}}

I believe my background in {{yourBackground}} would be a great fit for this role. Would you be open to a brief conversation about the position?

Best regards,
{{yourName}}`
    },
    {
      id: "follow_up",
      name: "Follow Up",
      subject: "Following up on {{jobTitle}} application",
      content: `Hi {{recipientName}},

I hope you're doing well. I wanted to follow up on my application for the {{jobTitle}} position at {{company}} that I submitted on {{applicationDate}}.

I'm very excited about this opportunity and would love to discuss how my experience in {{relevantExperience}} could contribute to your team.

Thank you for your time and consideration.

Best regards,
{{yourName}}`
    },
    {
      id: "thank_you",
      name: "Thank You",
      subject: "Thank you for the interview - {{jobTitle}} position",
      content: `Hi {{recipientName}},

Thank you for taking the time to interview me for the {{jobTitle}} position yesterday. I enjoyed our conversation about {{interviewTopic}} and learning more about {{company}}.

I'm even more excited about the opportunity to contribute to your team, particularly in {{specificArea}}.

Please let me know if you need any additional information from me.

Best regards,
{{yourName}}`
    }
  ];

  res.json({
    success: true,
    data: templates
  });
};
