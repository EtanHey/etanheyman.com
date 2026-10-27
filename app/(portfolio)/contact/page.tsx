import ContactForm from "./ContactForm";
import { createContactToken } from "./security";

// AIDEV-NOTE: Never cache a signed issuance time at build time or across requests.
export const dynamic = "force-dynamic";

export default function Contact() {
  return <ContactForm timingToken={createContactToken()} />;
}
