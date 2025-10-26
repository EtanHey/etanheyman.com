"use client";

import { useEffect, useState } from "react";

export type Region = "israel" | "worldwide";

export interface ContactInfo {
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  whatsappDisplay: string;
  location: string;
  locationUrl: string;
  defaultCountry: string;
}

const CONTACT_INFO: Record<Region, ContactInfo> = {
  israel: {
    phone: "+972547589755",
    phoneDisplay: "+972 54 758 9755",
    whatsapp: "+972547589755",
    whatsappDisplay: "+972 54 758 9755",
    location: "Rehovot, Israel",
    locationUrl: "https://www.google.com/maps/place/Rehovot,+Israel",
    defaultCountry: "IL",
  },
  worldwide: {
    phone: "+17179629684",
    phoneDisplay: "+1 717 962 9684",
    whatsapp: "+17179629684",
    whatsappDisplay: "+1 717 962 9684",
    location: "Denver, Colorado, USA",
    locationUrl: "https://www.google.com/maps/place/Denver,+CO",
    defaultCountry: "US",
  },
};

export function useRegion(): { region: Region; contactInfo: ContactInfo; isLoading: boolean } {
  const [region, setRegion] = useState<Region>("worldwide");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Detect region using Vercel's Edge geolocation
    async function detectRegion() {
      try {
        // Try Vercel's geolocation API
        const vercelResponse = await fetch("/api/region");
        const vercelData = await vercelResponse.json();

        let country = vercelData.country;

        // If we're in development (Vercel geo not available), use IP fallback
        if (!country && vercelData.isDevelopment) {
          try {
            const ipResponse = await fetch("https://ipapi.co/json/");
            const ipData = await ipResponse.json();
            country = ipData.country_code;
          } catch (ipError) {
            // Silently fail - likely rate limited. Default to US.
            country = "US";
          }
        }

        // Check if user is in Israel
        if (country === "IL") {
          setRegion("israel");
        } else {
          setRegion("worldwide");
        }
      } catch (error) {
        // On error, default to worldwide
        setRegion("worldwide");
      } finally {
        setIsLoading(false);
      }
    }

    detectRegion();
  }, []);

  return {
    region,
    contactInfo: CONTACT_INFO[region],
    isLoading,
  };
}
