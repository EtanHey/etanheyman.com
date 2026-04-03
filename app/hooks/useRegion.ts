export interface ContactInfo {
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  whatsappDisplay: string;
  location: string;
  locationUrl: string;
  defaultCountry: string;
}

export const CONTACT_INFO: ContactInfo = {
  phone: "+972547589755",
  phoneDisplay: "+972 54 758 9755",
  whatsapp: "+972547589755",
  whatsappDisplay: "+972 54 758 9755",
  location: "Rehovot, Israel",
  locationUrl: "https://www.google.com/maps/place/Rehovot,+Israel",
  defaultCountry: "IL",
};
