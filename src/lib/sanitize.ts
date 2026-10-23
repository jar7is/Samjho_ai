/**
 * Samjho AI — Security Input Sanitizer
 * Protects citizen intake and coordinator edit inputs against XSS and malicious payloads.
 */

export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") return "";

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+\s*=\s*(?:["'][^"']*["']|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/data:text\/html/gi, "")
    .trim();
}

export function escapeHtml(input: string): string {
  if (!input || typeof input !== "string") return "";

  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return input.replace(/[&<>"']/g, (match) => htmlEscapes[match] || match);
}

export function validateCoordinates(lat: number, lng: number): boolean {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}
