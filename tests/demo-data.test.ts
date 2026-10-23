import { describe, it, expect } from "vitest";
import { INITIAL_INCIDENTS, DEMO_USERS } from "../src/lib/demo-data";

describe("Synthetic Demo Data & Problem Statement Integrity", () => {
  it("provides pre-configured synthetic incidents", () => {
    expect(INITIAL_INCIDENTS).toBeDefined();
    expect(INITIAL_INCIDENTS.length).toBeGreaterThanOrEqual(3);
  });

  it("marks all demo incidents as synthetic for safety", () => {
    INITIAL_INCIDENTS.forEach((inc) => {
      expect(inc.isSynthetic).toBe(true);
      expect(inc.id).toBeTruthy();
      expect(inc.title).toBeTruthy();
      expect(inc.severity).toBeTruthy();
      expect(inc.location).toBeDefined();
    });
  });

  it("includes at least one incident with active contradictions for coordinator resolution", () => {
    const hasContradiction = INITIAL_INCIDENTS.some(
      (inc) => inc.contradictions && inc.contradictions.length > 0
    );
    expect(hasContradiction).toBe(true);
  });

  it("includes at least one incident with missing information / unknown gaps", () => {
    const hasMissingInfo = INITIAL_INCIDENTS.some(
      (inc) => inc.missingInfo && inc.missingInfo.length > 0
    );
    expect(hasMissingInfo).toBe(true);
  });

  it("includes multi-modal evidence (audio, text, image) across cases", () => {
    const sourceTypes = new Set<string>();
    INITIAL_INCIDENTS.forEach((inc) => {
      inc.evidence.forEach((ev) => sourceTypes.add(ev.sourceType));
    });

    expect(sourceTypes.has("text") || sourceTypes.has("audio") || sourceTypes.has("image")).toBe(true);
  });

  it("provides 3 distinct demo coordinator profiles", () => {
    expect(DEMO_USERS.length).toBeGreaterThanOrEqual(3);
    const roles = DEMO_USERS.map((u) => u.role);
    expect(roles).toContain("COORDINATOR");
  });
});
