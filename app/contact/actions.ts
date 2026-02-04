"use server";

import { Resend } from "resend";
import { EmailTemplate } from "../components/contact/EmailTemplate";

// Initialize Resend - you'll need to add your API key to your environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export type ContactFormData = {
  fullName: string;
  email: string;
  phone: string;
  message: string;
  // Anti-spam fields
  website?: string; // Honeypot - should always be empty
  formLoadedAt?: number; // Timestamp when form was loaded
};

// Simple phone number validation that accepts a variety of formats
// This is more lenient to accommodate different formats from the PhoneInput
function isValidPhoneNumber(phone: string): boolean {
  // If empty, consider it valid (since phone is optional)
  if (!phone || phone.trim() === "") return true;

  // Remove all non-digit characters except for the leading +
  const cleaned = phone.replace(/[^\d+]/g, "");

  // Basic check: must start with + and have at least 7 digits after that
  // or must be all digits with at least 7 digits
  return (
    (cleaned.startsWith("+") && cleaned.length >= 8) ||
    (!cleaned.includes("+") && cleaned.length >= 7)
  );
}

// Minimum time (in ms) a human would take to fill the form
const MIN_FORM_TIME_MS = 3000; // 3 seconds

export async function submitContactForm(formData: ContactFormData) {
  try {
    // SPAM CHECK 1: Honeypot field should be empty
    // Bots typically fill all fields, including hidden ones
    if (formData.website) {
      // Silently reject - don't reveal to bots that we detected them
      console.log("Spam detected: honeypot field filled");
      return { success: true }; // Fake success to confuse bots
    }

    // SPAM CHECK 2: Time-based validation
    // Real humans take at least a few seconds to fill a form
    const loadedAt = Number(formData.formLoadedAt);
    if (!Number.isFinite(loadedAt) || loadedAt <= 0) {
      // Missing or invalid timestamp = likely bot bypassing client-side code
      console.log("Spam detected: missing or invalid formLoadedAt");
      return { success: true }; // Fake success to confuse bots
    }
    const timeSpent = Date.now() - loadedAt;
    if (timeSpent < MIN_FORM_TIME_MS) {
      console.log(`Spam detected: form submitted too fast (${timeSpent}ms)`);
      return { success: true }; // Fake success to confuse bots
    }

    // Validate the form data
    if (!formData.fullName || !formData.email || !formData.message) {
      return { success: false, error: "Please fill out all required fields" };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return { success: false, error: "Please enter a valid email address" };
    }

    // Phone number validation (if provided)
    if (formData.phone && !isValidPhoneNumber(formData.phone)) {
      return { success: false, error: "Please enter a valid phone number" };
    }

    // Log the form data for debugging
    console.log("Form data received:", formData);

    // Send the email using Resend
    const { data, error } = await resend.emails.send({
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
    console.log(data);
    if (error) {
      console.error("Error submitting form:", error);
      return {
        success: false,
        error: "Failed to send your message. Please try again later.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting form:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
