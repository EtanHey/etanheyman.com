import { createHmac, timingSafeEqual } from "node:crypto";
import { isIP } from "node:net";

const limits = {
  fullName: 100,
  email: 254,
  phone: 32,
  message: 5000,
  website: 200,
  timingToken: 81,
};
export type ContactFormData = {
  fullName: string;
  email: string;
  phone: string;
  message: string;
  website?: string;
  timingToken?: string;
};

function readField(input: object, key: keyof typeof limits) {
  const value: unknown = Reflect.get(input, key);
  if (value === undefined && (key === "phone" || key === "website")) return "";
  if (typeof value !== "string" || value.length > limits[key]) return null;
  // AIDEV-NOTE: Bound raw input first; preserve message formatting, sanitize header fields.
  return key === "message"
    ? value
        .replace(/\r\n/g, "\n")
        .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/g, "")
        .trim()
    : value.replace(/[\u0000-\u001f\u007f-\u009f]+/g, " ").trim();
}
export function parseContactForm(input: unknown): ContactFormData | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  if (Object.keys(input).some((key) => !Object.hasOwn(limits, key)))
    return null;
  const fullName = readField(input, "fullName");
  const email = readField(input, "email");
  const phone = readField(input, "phone");
  const message = readField(input, "message");
  const website = readField(input, "website");
  const timingToken = readField(input, "timingToken");
  if (
    !fullName ||
    !email ||
    !message ||
    phone === null ||
    website === null ||
    timingToken === null
  )
    return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  if (phone && !/^\+?[\d ().-]+$/.test(phone)) return null;
  if (phone && phone.replace(/\D/g, "").length < 7) return null;
  return { fullName, email, phone, message, website, timingToken };
}

function signature(issuedAt: string, secret: string) {
  return createHmac("sha256", secret).update(`contact:${issuedAt}`).digest();
}
// AIDEV-NOTE: NEXTAUTH_SECRET is a historical env name; retain it for contact timing-token HMACs.
export function createContactToken() {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) return "";
  const issuedAt = String(Date.now());
  return `${issuedAt}.${signature(issuedAt, secret).toString("hex")}`;
}
export function validContactToken(token: string | undefined) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret || !token) return false;
  const match = /^([1-9]\d{0,15})\.([a-f0-9]{64})$/.exec(token);
  if (!match) return false;
  const [, issuedAt, signed] = match;
  const age = Date.now() - Number(issuedAt);
  return (
    Number.isSafeInteger(Number(issuedAt)) &&
    age >= 3000 &&
    age <= 3_600_000 &&
    timingSafeEqual(signature(issuedAt, secret), Buffer.from(signed, "hex"))
  );
}

// AIDEV-NOTE: Best effort per-instance on serverless; not a distributed quota.
const attempts = new Map<string, { count: number; expires: number }>();
function ipv6Prefix(ip: string) {
  const normalized = new URL(`http://[${ip}]/`).hostname.slice(1, -1);
  const [left, right = ""] = normalized.split("::");
  const leading = left ? left.split(":") : [];
  const trailing = right ? right.split(":") : [];
  const groups = [
    ...leading,
    ...Array<string>(8 - leading.length - trailing.length).fill("0"),
    ...trailing,
  ];
  return `${groups
    .slice(0, 4)
    .map((group) => group.padStart(4, "0"))
    .join(":")}/64`;
}
export function allowContactAttempt(requestHeaders: {
  get(name: string): string | null;
}) {
  // Vercel supplies this header; other hosting must overwrite forwarded headers at its trusted edge.
  const forwarded =
    requestHeaders.get("x-vercel-forwarded-for") ??
    requestHeaders.get("x-forwarded-for");
  const ip = forwarded?.split(",", 1)[0].trim() ?? "";
  const key = isIP(ip) === 6 ? ipv6Prefix(ip) : isIP(ip) === 4 ? ip : "unknown";
  const now = Date.now();
  for (const [entry, bucket] of attempts)
    if (bucket.expires <= now) attempts.delete(entry);
  let bucket = attempts.get(key);
  if (!bucket) {
    if (attempts.size >= 10_000) {
      const oldest = attempts.keys().next();
      if (!oldest.done) attempts.delete(oldest.value);
    }
    bucket = { count: 0, expires: now + 600_000 };
    attempts.set(key, bucket);
  }
  return ++bucket.count <= 3;
}
