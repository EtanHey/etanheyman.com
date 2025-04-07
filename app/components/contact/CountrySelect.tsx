"use client";
import React, { useEffect, useRef, useState } from "react";
import { Country } from "react-phone-number-input";
import { getCountryCallingCode } from "react-phone-number-input/input";

// Define the option type for type safety
export type CountryOption = {
  value?: Country;
  label: string;
};

// Types for the component props
export interface CountrySelectProps {
  value?: Country;
  onChange: (value: Country | undefined) => void;
  options: Array<CountryOption>;
  [key: string]: any;
}

// Create a component that generates flag emojis from country codes
export const CountryFlag = ({ country }: { country?: string }) => {
  if (!country) return null;

  // Convert country code to flag emoji (offset + country code unicode)
  const codePoints = country
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));

  return (
    <span role="img" aria-hidden="true">
      {String.fromCodePoint(...codePoints)}
    </span>
  );
};

export const CountrySelect = ({
  value,
  onChange,
  options,
  ...rest
}: CountrySelectProps) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // Helper function to get calling code with + prefix - moved up before use
  const getCallingCode = (country: Country): string => {
    try {
      return `+${getCountryCallingCode(country)}`;
    } catch (error) {
      return "";
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsSelectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOptions = options
    .filter(
      (option: CountryOption) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (option.value || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (option.value
          ? getCallingCode(option.value).includes(searchTerm)
          : false),
    )
    // Move international to the top, then sort by country code
    .sort((a, b) => {
      // International should always be first
      if (!a.value) return -1;
      if (!b.value) return 1;

      // Then sort alphabetically by country code
      return a.value.localeCompare(b.value);
    });

  return (
    <div className="relative flex items-center self-stretch" ref={ref}>
      <button
        type="button"
        className="flex cursor-pointer items-center gap-1 rounded px-1 py-1 transition-colors hover:bg-blue-50"
        onClick={() => setIsSelectOpen(!isSelectOpen)}
      >
        <span className="text-base">
          <CountryFlag country={value} />
        </span>
        <span className="text-xs font-medium text-blue-700">
          {value?.toUpperCase()}
        </span>
        <span
          className={`h-0 w-0 border-x-[0.15rem] border-t-[0.25rem] border-solid border-x-transparent border-t-current opacity-70 transition-transform ${isSelectOpen ? "rotate-180" : ""}`}
        ></span>
      </button>

      {isSelectOpen && (
        <div className="absolute top-full left-0 z-10 max-h-[300px] w-60 overflow-y-auto rounded-lg bg-white py-2 shadow-lg max-sm:-left-4">
          <div className="px-2 pb-2">
            <input
              type="text"
              className="w-full rounded border border-gray-200 p-1.5 text-xs"
              placeholder="Search countries or codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {filteredOptions.map((option: CountryOption, index) => (
            <React.Fragment key={option.value || "international"}>
              {index > 0 && (
                <div className="mx-2 border-t border-gray-100"></div>
              )}
              <div
                className={`flex cursor-pointer items-center px-2 py-1.5 transition-colors hover:bg-blue-50 ${value === option.value ? "bg-blue-50/60" : ""}`}
                onClick={() => {
                  onChange(option.value as Country);
                  setIsSelectOpen(false);
                  setSearchTerm("");
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">
                    <CountryFlag country={option.value} />
                  </span>
                  <span className="text-xs font-medium text-blue-700">
                    {option.value?.toUpperCase()}
                  </span>
                </div>
                {option.value && (
                  <span className="ml-auto text-xs font-medium text-gray-600">
                    {getCallingCode(option.value as Country)}
                  </span>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
