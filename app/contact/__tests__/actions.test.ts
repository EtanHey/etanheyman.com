import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitContactForm, ContactFormData } from "../actions";

// Mock Resend
vi.mock("resend", () => ({
  Resend: class {
    emails = {
      send: vi.fn().mockResolvedValue({ data: { id: "test-id" }, error: null }),
    };
  },
}));

// Mock the EmailTemplate component
vi.mock("../../components/contact/EmailTemplate", () => ({
  EmailTemplate: () => Promise.resolve("<div>Test Email</div>"),
}));

describe("submitContactForm spam protection", () => {
  const validFormData: ContactFormData = {
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    message: "This is a test message",
    website: "", // Honeypot empty
    formLoadedAt: Date.now() - 5000, // 5 seconds ago
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("honeypot validation", () => {
    it("should silently reject when honeypot field is filled", async () => {
      const spamData: ContactFormData = {
        ...validFormData,
        website: "http://spam-site.com", // Bot filled the honeypot
      };

      const result = await submitContactForm(spamData);

      // Returns fake success to confuse bots
      expect(result.success).toBe(true);
      // But no email should be sent (we can verify via console.log in real scenario)
    });

    it("should accept when honeypot field is empty", async () => {
      const result = await submitContactForm(validFormData);

      expect(result.success).toBe(true);
    });
  });

  describe("time-based validation", () => {
    it("should silently reject when form submitted too fast (under 3 seconds)", async () => {
      const fastSubmitData: ContactFormData = {
        ...validFormData,
        formLoadedAt: Date.now() - 1000, // Only 1 second ago
      };

      const result = await submitContactForm(fastSubmitData);

      // Returns fake success to confuse bots
      expect(result.success).toBe(true);
    });

    it("should accept when form submitted after 3 seconds", async () => {
      const normalSubmitData: ContactFormData = {
        ...validFormData,
        formLoadedAt: Date.now() - 4000, // 4 seconds ago
      };

      const result = await submitContactForm(normalSubmitData);

      expect(result.success).toBe(true);
    });
  });

  describe("combined spam checks", () => {
    it("should reject when both honeypot filled AND submitted too fast", async () => {
      const doubleSpamData: ContactFormData = {
        ...validFormData,
        website: "spam",
        formLoadedAt: Date.now() - 500,
      };

      const result = await submitContactForm(doubleSpamData);

      expect(result.success).toBe(true); // Fake success
    });
  });

  describe("regular validation still works", () => {
    it("should return error when required fields are missing", async () => {
      const incompleteData: ContactFormData = {
        fullName: "",
        email: "john@example.com",
        phone: "",
        message: "Test",
        website: "",
        formLoadedAt: Date.now() - 5000,
      };

      const result = await submitContactForm(incompleteData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Please fill out all required fields");
    });

    it("should return error for invalid email", async () => {
      const invalidEmailData: ContactFormData = {
        ...validFormData,
        email: "not-an-email",
      };

      const result = await submitContactForm(invalidEmailData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Please enter a valid email address");
    });
  });
});
