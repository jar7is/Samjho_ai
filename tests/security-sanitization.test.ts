import { describe, it, expect } from "vitest";
import { sanitizeInput, escapeHtml, validateCoordinates } from "../src/lib/sanitize";

describe("Security & Input Sanitization Suite", () => {
  it("strips malicious script tags from input strings", () => {
    const malicious = "Emergency at bridge <script>alert('xss')</script> please help";
    const cleaned = sanitizeInput(malicious);
    expect(cleaned).toBe("Emergency at bridge  please help");
    expect(cleaned).not.toContain("<script>");
    expect(cleaned).not.toContain("alert('xss')");
  });

  it("removes inline event handler injection attempts", () => {
    const malicious = '<img src="x" onerror="stealCookies()" /> Flooding near school';
    const cleaned = sanitizeInput(malicious);
    expect(cleaned).not.toContain("onerror");
    expect(cleaned).not.toContain("stealCookies");
  });

  it("removes javascript: protocol pseudo-URLs", () => {
    const malicious = 'Check map at javascript:fetch("http://attacker.com")';
    const cleaned = sanitizeInput(malicious);
    expect(cleaned).not.toContain("javascript:");
  });

  it("escapes dangerous HTML characters", () => {
    const input = 'Water level > 5m & rising < 1hr "urgent"';
    const escaped = escapeHtml(input);
    expect(escaped).toBe("Water level &gt; 5m &amp; rising &lt; 1hr &quot;urgent&quot;");
  });

  it("validates geographic coordinates accurately", () => {
    expect(validateCoordinates(28.6139, 77.209)).toBe(true);
    expect(validateCoordinates(-90, 180)).toBe(true);
    expect(validateCoordinates(91, 50)).toBe(false); // Latitude out of bounds
    expect(validateCoordinates(45, -181)).toBe(false); // Longitude out of bounds
    expect(validateCoordinates(NaN, 50)).toBe(false);
  });

  it("handles null and non-string inputs safely", () => {
    // @ts-expect-error test invalid types
    expect(sanitizeInput(null)).toBe("");
    // @ts-expect-error test invalid types
    expect(sanitizeInput(undefined)).toBe("");
    // @ts-expect-error test invalid types
    expect(escapeHtml(123)).toBe("");
  });
});
