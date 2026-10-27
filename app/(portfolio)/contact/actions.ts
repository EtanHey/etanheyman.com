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

type ContactError =
  | "unavailable"
  | "invalid"
  | "invalid_timing"
  | "rate_limited"
  | "send_failed"
  | "error";
type ContactResult =
  | { success: true }
  | { success: false; code: ContactError; error: string };

export async function submitContactForm(
  input: unknown,
): Promise<ContactResult> {
  const submissionId = randomUUID();
  const reject = (outcome: ContactError, error: string): ContactResult => {
    console.info({ submissionId, outcome });
    return { success: false, code: outcome, error };
  };
  try {
    if (!process.env.NEXTAUTH_SECRET) {
      return reject(
        "unavailable",
        "The contact form is temporarily unavailable. Please email me at etan@heyman.net.",
      );
    }
    const formData = parseContactForm(input);
    if (!formData)
      return reject(
        "invalid",
        "Please check your contact details and message length.",
      );
    if (!allowContactAttempt(await headers())) {
      return reject(
        "rate_limited",
        "Too many attempts. Please try again in ten minutes.",
      );
    }
    if (formData.website) {
      console.info({ submissionId, outcome: "honeypot" });
      return { success: true };
    }
    if (!validContactToken(formData.timingToken)) {
      return reject(
        "invalid_timing",
        "Your form session needs refreshing. Please wait at least three seconds and try again.",
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
        code: "send_failed",
        error: "Failed to send your message. Please try again later.",
      };
    }

    console.info({ submissionId, outcome: "sent" });
    return { success: true };
  } catch {
    console.error({ submissionId, outcome: "error" });
    return {
      success: false,
      code: "error",
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
