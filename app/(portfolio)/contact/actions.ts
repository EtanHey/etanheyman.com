"use server";

import { Resend } from "resend";
import { EmailTemplate } from "@/app/components/contact/EmailTemplate";
import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import {
  allowContactAttempt,
  parseContactForm,
  validContactToken,
} from "./security";
export type { ContactFormData } from "./security";

type ContactResult = { success: true } | { success: false; error: string };

export async function submitContactForm(
  input: unknown,
): Promise<ContactResult> {
  const submissionId = randomUUID();
  const reject = (outcome: string, error: string): ContactResult => {
    console.info({ submissionId, outcome });
    return { success: false, error };
  };
  try {
    if (!allowContactAttempt(await headers())) {
      return reject(
        "rate_limited",
        "Too many attempts. Please try again in ten minutes.",
      );
    }
    const formData = parseContactForm(input);
    if (!formData)
      return reject(
        "invalid",
        "Please check your contact details and message length.",
      );
    if (formData.website) {
      console.info({ submissionId, outcome: "honeypot" });
      return { success: true };
    }
    if (!validContactToken(formData.timingToken)) {
      return reject(
        "invalid_timing",
        "Please reload the form and wait at least three seconds before sending.",
      );
    }
    const resend = new Resend(process.env.RESEND_API_KEY);
    // Send the email using Resend
    const { error } = await resend.emails.send({
      from: "no-reply@contact.heymans.dev", // Using subdomain for better deliverability
      to: "etan@heyman.net", // Replace with your actual email
      subject: `New contact message from ${formData.fullName}`,
      replyTo: formData.email,
      react: await EmailTemplate({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      }),
      text: `
New Contact Form Submission

You received a new message from your website contact form.

Contact Details:
Name: ${formData.fullName}
Email: ${formData.email}
${formData.phone ? `Phone: ${formData.phone}` : ""}

Message:
${formData.message}
      `.trim(),
    });
    if (error) {
      console.error({ submissionId, outcome: "send_failed" });
      return {
        success: false,
        error: "Failed to send your message. Please try again later.",
      };
    }

    console.info({ submissionId, outcome: "sent" });
    return { success: true };
  } catch {
    console.error({ submissionId, outcome: "error" });
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
