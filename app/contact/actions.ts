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
  return (cleaned.startsWith("+") && cleaned.length >= 8) || (!cleaned.includes("+") && cleaned.length >= 7);
}

export async function submitContactForm(formData: ContactFormData) {
  try {
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
      return { success: false, error: "Failed to send your message. Please try again later." };
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting form:", error);
    return { success: false, error: "An unexpected error occurred. Please try again later." };
  }
}
