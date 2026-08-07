import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getServerConfig } from "../config.server";

// Sends the contact form to the studio inbox via Resend (https://resend.com).
// Setup (one-time):
//   1. Create a free Resend account and API key: https://resend.com/api-keys
//   2. Add RESEND_API_KEY=re_xxxxxxxx to your environment (Vercel Project
//      Settings -> Environment Variables, or a local .env file for `vite dev`).
//   3. By default this sends from Resend's shared test domain
//      (onboarding@resend.dev), which works immediately with no extra setup
//      and delivers straight to TO_EMAIL below. For a branded "from" address
//      (e.g. hello@gairystudio.com), verify your domain in the Resend
//      dashboard and swap the `from` value.

const TO_EMAIL = "shankargairy99@gmail.com";
const FROM_EMAIL = "Gairy Studio <onboarding@resend.dev>";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().optional(),
  email: z.string().email("A valid email is required"),
  projectType: z.string().min(1, "Project type is required"),
  budget: z.string().min(1, "Budget is required"),
  timeline: z.string().min(1, "Timeline is required"),
  message: z.string().min(1, "Project details are required"),
});

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator(contactSchema)
  .handler(async ({ data }) => {
    const config = getServerConfig();

    if (!config.resendApiKey) {
      console.error("[contact] RESEND_API_KEY is not set — cannot send email.");
      throw new Error("Email sending isn't configured yet. Please set RESEND_API_KEY.");
    }

    const escapeHtml = (value: string) =>
      value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

    const rows: [string, string][] = [
      ["Name", data.name],
      ["Company / Brand", data.company || "—"],
      ["Email", data.email],
      ["Type of project", data.projectType],
      ["Estimated budget", data.budget],
      ["Ideal timeline", data.timeline],
    ];

    const html = `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="margin-bottom: 4px;">New project enquiry</h2>
        <p style="color: #666; margin-top: 0;">Submitted via the Gairy Studio contact form.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          ${rows
            .map(
              ([label, value]) => `
            <tr>
              <td style="padding: 6px 12px 6px 0; color: #666; font-size: 13px; vertical-align: top; white-space: nowrap;">${escapeHtml(label)}</td>
              <td style="padding: 6px 0; font-size: 14px;">${escapeHtml(value)}</td>
            </tr>`,
            )
            .join("")}
        </table>
        <div>
          <div style="color: #666; font-size: 13px; margin-bottom: 4px;">Project details</div>
          <div style="white-space: pre-wrap; font-size: 14px; border-left: 3px solid #ccc; padding-left: 12px;">${escapeHtml(data.message)}</div>
        </div>
      </div>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: data.email,
        subject: `New project enquiry from ${data.name}`,
        html,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error("[contact] Resend API error:", response.status, errorBody);
      throw new Error("Failed to send your message. Please try again in a moment.");
    }

    return { ok: true as const };
  });
