export function isOwner({
  email,
  githubUsername,
}: {
  email?: string | null;
  githubUsername?: unknown;
}): boolean {
  const allowedEmails = (process.env.ALLOWED_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  const allowedUsernames = (process.env.ALLOWED_GITHUB_USERNAMES || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (allowedEmails.length === 0 && allowedUsernames.length === 0) {
    console.error(
      "Owner access denied: configure ALLOWED_EMAILS or ALLOWED_GITHUB_USERNAMES.",
    );
    return false;
  }
  return Boolean(
    (email && allowedEmails.includes(email.toLowerCase())) ||
      (typeof githubUsername === "string" &&
        allowedUsernames.includes(githubUsername.toLowerCase())),
  );
}
