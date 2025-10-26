"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { EmailIcon } from "../components/contact/EmailIcon";
import { LocationIcon } from "../components/contact/LocationIcon";
import { PhoneIcon } from "../components/contact/PhoneIcon";
import SendIcon from "../components/navigation/about/SendIcon";
import { PhoneInput } from "../components/ui/phone-input";
import { ContactFormData, submitContactForm } from "./actions";
import { SocialLinks } from "../components/SocialLinks";
import { useRegion } from "../hooks/useRegion";

export default function Contact() {
  const { contactInfo } = useRegion();
  const [formValues, setFormValues] = useState({
    fullName: "",
    email: "",
    message: "",
  });
  const [phoneValue, setPhoneValue] = useState<string | undefined>("");
  const phoneInputRef = useRef<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhoneChange = useRef((value: string | undefined) => {
    setPhoneValue(value);
  }).current;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing again
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Get the current phone value from state
    const phone = phoneValue || "";

    const formData: ContactFormData = {
      ...formValues,
      phone,
    };

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        setIsSubmitted(true);
        // Reset form
        setFormValues({
          fullName: "",
          email: "",
          message: "",
        });
        // Reset phone input
        setPhoneValue("");
      } else {
        setError(
          result.error || "Failed to send your message. Please try again.",
        );
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
      console.error("Form submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="z-20 flex min-h-screen w-full flex-col items-center justify-center px-4.5 py-8 pb-20">
      <h1 className="sr-only">Contact Etan Heyman</h1>
      <div className="flex w-full max-w-3xl flex-col gap-10 overflow-hidden rounded-[20px] bg-white p-4 shadow-lg">
        {/* Contact Form */}
        <section aria-labelledby="contact-form-heading">
          <h2 id="contact-form-heading" className="sr-only">
            Contact Form
          </h2>
          <form
            onSubmit={handleSubmit}
            className="text-blue-900"
            aria-describedby={error ? "form-error" : undefined}
          >
            <div className="flex flex-col gap-6">
              <div className="focus-within:[&>label]:text-primary flex flex-col gap-1.5">
                <label htmlFor="fullName" className="font-semibold">
                  Full name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formValues.fullName}
                  onChange={handleChange}
                  className="focus:border-primary focus:ring-primary/20 w-full border-b border-blue-900 p-2 focus:ring-2 focus:outline-none"
                  placeholder="Your full name"
                  aria-required="true"
                />
              </div>

              <div className="focus-within:[&>label]:text-primary flex flex-col gap-1.5">
                <label htmlFor="email" className="font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formValues.email}
                  onChange={handleChange}
                  className="focus:border-primary focus:ring-primary/20 w-full border-b border-blue-900 p-2 focus:ring-2 focus:outline-none"
                  placeholder="Your email address"
                  aria-required="true"
                />
              </div>

              <div className="focus-within:[&>label]:text-primary flex flex-col gap-1.5">
                <label htmlFor="phone" className="font-semibold">
                  Phone Number
                </label>
                <div className="focus-within:border-primary border-b border-blue-900">
                  <PhoneInput
                    international
                    defaultCountry={contactInfo.defaultCountry as any}
                    value={phoneValue}
                    onChange={handlePhoneChange}
                    className="border-none focus-within:outline-none [&_.rounded-e-lg]:rounded-none [&_.rounded-e-lg]:border-none [&_.rounded-e-lg]:bg-transparent [&_.rounded-e-lg]:shadow-none [&_.rounded-e-lg]:focus:outline-none"
                    aria-label="Phone number"
                  />
                </div>
              </div>

              <div className="focus-within:[&>label]:text-primary flex flex-col gap-1.5">
                <label htmlFor="message" className="font-semibold">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formValues.message}
                  onChange={handleChange}
                  className="focus:border-primary focus:ring-primary/20 h-20 w-full border-b border-blue-900 p-2 py-2 focus:ring-2 focus:outline-none"
                  placeholder="Write your message here"
                  aria-required="true"
                />
              </div>

              {error && (
                <div
                  className="flex items-start gap-2 text-red-500"
                  id="form-error"
                  role="alert"
                >
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M12 7v6M12 17.01V17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary focus:ring-primary flex w-full items-center justify-center gap-2 rounded-full py-4 font-bold text-white transition-colors hover:bg-blue-600 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Sending..." : "Send message"}
                {!isSubmitting && <SendIcon aria-hidden="true" />}
              </button>
            </div>

            {isSubmitted && !isSubmitting && !error && (
              <div
                className="text-primary flex items-start gap-2 pt-6"
                role="status"
                aria-live="polite"
              >
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#0f82eb"
                    strokeWidth="2"
                  />
                  <path
                    d="M8 12L11 15L16 9"
                    stroke="#0f82eb"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="text-primary flex flex-col">
                  <p>Your message has been sent.</p>
                  <p>I will get back to you as soon as possible, promise!</p>
                </div>
              </div>
            )}
          </form>
        </section>

        {/* Contact Information */}
        <section
          aria-labelledby="contact-info-heading"
          className="flex flex-col gap-22.5 rounded-xl bg-blue-900 px-6 py-8 text-white"
        >
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-1.5">
              <h2
                id="contact-info-heading"
                className="text-xl font-semibold text-blue-200"
              >
                Contact Information
              </h2>
              <p className="text-sm font-[260]">
                Reach out directly using the information below!
              </p>
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-6">
                <PhoneIcon aria-hidden="true" />
                <Link
                  href={`tel:${contactInfo.phone}`}
                  className="rounded-sm text-white underline underline-offset-1 transition-colors hover:text-blue-200 hover:decoration-2 hover:underline-offset-2 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  aria-label={`Call me at ${contactInfo.phoneDisplay}`}
                >
                  {contactInfo.phoneDisplay}
                </Link>
              </div>

              <div className="flex items-center gap-6">
                <EmailIcon aria-hidden="true" />
                <Link
                  href="mailto:etan@heyman.net"
                  className="rounded-sm text-white underline underline-offset-1 transition-colors hover:text-blue-200 hover:decoration-2 hover:underline-offset-2 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  aria-label="Email me at etan@heyman.net"
                >
                  etan@heyman.net
                </Link>
              </div>

              <div className="flex items-center gap-6">
                <LocationIcon aria-hidden="true" />
                <Link
                  href={contactInfo.locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm text-white underline underline-offset-1 transition-colors hover:text-blue-200 hover:decoration-2 hover:underline-offset-2 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  aria-label={`View ${contactInfo.location} on Google Maps`}
                >
                  {contactInfo.location}
                </Link>
              </div>
            </div>
          </div>

          <SocialLinks
            className="w-full justify-center"
            iconContainerClassName="flex items-center justify-center p-1 rounded-full bg-blue-50"
          />
        </section>
      </div>
    </main>
  );
}
