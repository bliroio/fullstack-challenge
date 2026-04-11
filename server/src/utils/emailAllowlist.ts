/**
 * Email allowlist based on the EMAIL_ALLOWLIST environment variable.
 * Format: comma-separated list of patterns.
 *   - "*@domain.com" matches any email at that domain
 *   - "alice@company.com" matches that exact address
 * If empty or unset, all emails are allowed.
 */

const getAllowedPatterns = (): string[] => {
  const raw = process.env.EMAIL_ALLOWLIST ?? "";
  if (!raw.trim()) return [];
  return raw
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
};

export const isEmailAllowed = (email: string): boolean => {
  const patterns = getAllowedPatterns();
  if (patterns.length === 0) return true;

  const normalizedEmail = email.toLowerCase();

  return patterns.some((pattern) => {
    if (pattern.startsWith("*@")) {
      const domainSuffix = pattern.slice(1); // "@example.com"
      return normalizedEmail.endsWith(domainSuffix);
    }
    return normalizedEmail === pattern;
  });
};
