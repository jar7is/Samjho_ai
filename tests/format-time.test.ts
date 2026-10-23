import { describe, it, expect } from "vitest";
import { formatIncidentTime, formatIncidentDate, formatIncidentDateTime } from "../src/lib/format-time";

describe("Deterministic Time Formatter", () => {
  const sampleIso = "2026-10-23T04:15:00.000Z";

  it("formats incident time deterministically across server and client", () => {
    const formatted = formatIncidentTime(sampleIso);
    expect(formatted).toMatch(/\d{2}:\d{2}\s?(AM|PM)/);
  });

  it("formats incident date in standard UTC format", () => {
    const formatted = formatIncidentDate(sampleIso);
    expect(formatted).toBe("Oct 23, 2026");
  });

  it("formats full date-time deterministically", () => {
    const formatted = formatIncidentDateTime(sampleIso);
    expect(formatted).toContain("Oct 23, 2026");
    expect(formatted).toMatch(/at\s+\d{2}:\d{2}\s?(AM|PM)/);
  });

  it("handles alternative timestamp inputs correctly", () => {
    const timestamp = "2026-01-01T12:00:00.000Z";
    expect(formatIncidentDate(timestamp)).toBe("Jan 1, 2026");
    expect(formatIncidentTime(timestamp)).toBe("12:00 PM");
  });
});
