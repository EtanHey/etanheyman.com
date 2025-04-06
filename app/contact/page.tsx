"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { EmailIcon } from "../components/contact/EmailIcon";
import { LocationIcon } from "../components/contact/LocationIcon";
import { PhoneIcon } from "../components/contact/PhoneIcon";
import SendIcon from "../components/navigation/about/sendIcon";
import { FacebookIcon, GithubIcon, LinkedinIcon, WhatsappIcon } from "../components/navigation/socialIcons";
import { PhoneInput } from "../components/ui/phone-input";
import { ContactFormData, submitContactForm } from "./actions";

export default function Contact() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        setError(result.error || "Failed to send your message. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
      console.error("Form submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='w-full z-20 min-h-screen px-4.5 py-8 pb-20'>
      <div className='w-full max-w-3xl p-4 bg-white rounded-[20px] overflow-hidden shadow-lg'>
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className='p-8 text-blue-900'>
          <div className='flex flex-col gap-6'>
            <div className='flex flex-col focus-within:[&>label]:text-primary gap-1.5'>
              <label htmlFor='fullName' className='font-semibold'>
                Full name
              </label>
              <input
                type='text'
                id='fullName'
                name='fullName'
                required
                value={formValues.fullName}
                onChange={handleChange}
                className='w-full border-b border-gray-300 focus:outline-none focus:border-primary '
                placeholder=''
              />
            </div>

            <div className='flex flex-col focus-within:[&>label]:text-primary gap-1.5'>
              <label htmlFor='email' className='font-semibold'>
                Email
              </label>
              <input
                type='email'
                id='email'
                name='email'
                required
                value={formValues.email}
                onChange={handleChange}
                className='w-full border-b border-gray-300 focus:outline-none focus:border-primary '
                placeholder=''
              />
            </div>

            <div className='flex flex-col focus-within:[&>label]:text-primary gap-1.5'>
              <label htmlFor='phone' className='font-semibold'>
                Phone Number
              </label>
              <div className='border-b border-gray-300 focus-within:border-primary'>
                <PhoneInput
                  international
                  defaultCountry='US'
                  value={phoneValue}
                  onChange={handlePhoneChange}
                  className='border-none focus-within:outline-none [&_.rounded-e-lg]:bg-transparent [&_.rounded-e-lg]:border-none [&_.rounded-e-lg]:shadow-none [&_.rounded-e-lg]:focus:outline-none [&_.rounded-e-lg]:rounded-none'
                />
              </div>
            </div>

            <div className='flex flex-col focus-within:[&>label]:text-primary gap-1.5'>
              <label htmlFor='message' className='font-semibold'>
                Message
              </label>
              <textarea
                id='message'
                name='message'
                required
                value={formValues.message}
                onChange={handleChange}
                className='w-full border-b border-gray-300 py-2 h-20 focus:outline-none focus:border-primary '
                placeholder='Write your message.'
              />
            </div>

            {error && (
              <div className='flex items-start gap-2 text-red-500'>
                <svg className='w-6 h-6' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' />
                  <path d='M12 7v6M12 17.01V17' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full bg-primary text-white rounded-full py-4 font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed'>
              {isSubmitting ? "Sending..." : "Send message"}
              {!isSubmitting && <SendIcon />}
            </button>
          </div>

          {isSubmitted && !isSubmitting && !error && (
            <div className='flex items-start gap-2 text-primary pt-6'>
              <svg className='w-6 h-6' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <circle cx='12' cy='12' r='10' stroke='#0f82eb' strokeWidth='2' />
                <path d='M8 12L11 15L16 9' stroke='#0f82eb' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
              </svg>
              <div className='flex flex-col text-primary'>
                <p>Your message has been sent.</p>
                <p>I will get back to you as soon as possible, promise!</p>
              </div>
            </div>
          )}
        </form>

        {/* Contact Information */}
        <div className='bg-blue-900 rounded-xl text-white p-8 flex flex-col'>
          <h2 className='text-xl font-bold'>Contact Information</h2>
          <p className='text-sm pt-2 pb-6'>Say something to start a live chat!</p>

          <div className='flex flex-col gap-8'>
            <div className='flex items-center gap-6'>
              <PhoneIcon />
              <a href='tel:+10123456789' className='text-white'>
                +1012 3456 789
              </a>
            </div>

            <div className='flex items-center gap-6'>
              <EmailIcon />
              <a href='mailto:etan@heyman.com' className='text-white'>
                etan@heyman.com
              </a>
            </div>

            <div className='flex items-center gap-6'>
              <LocationIcon />
              <Link href='https://www.google.com/maps/place/Highland,+denver,+CO' target='_blank' className='text-white hover:text-blue-200 transition-colors'>
                Denver, Colorado, USA
              </Link>
            </div>
          </div>

          <div className='flex items-center gap-4 pt-8'>
            <a href='https://wa.me/+17179629684' target='_blank' className='flex items-center justify-center p-1 rounded-full bg-blue-50'>
              <WhatsappIcon />
            </a>
            <a href='https://www.facebook.com/etanheyman' target='_blank' className='flex items-center justify-center p-1 rounded-full bg-blue-50'>
              <FacebookIcon />
            </a>
            <a href='https://www.linkedin.com/in/etanheyman' target='_blank' className='flex items-center justify-center p-1 rounded-full bg-blue-50'>
              <LinkedinIcon />
            </a>
            <a href='https://github.com/etanhey' target='_blank' className='flex items-center justify-center p-1 rounded-full bg-blue-50'>
              <GithubIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
