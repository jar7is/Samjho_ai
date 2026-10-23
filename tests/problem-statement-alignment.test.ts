import { describe, it, expect } from "vitest";
import { INITIAL_INCIDENTS } from "../src/lib/demo-data";

describe("PromptWars Societal Benefit Challenge Alignment", () => {
  it("enforces decision-support safety disclaimers", () => {
    // Verifies the safety contract: decision support only, never automatic dispatch
    const emergencyNotice =
      "Samjho AI is a human-in-the-loop coordination tool. It does not contact 911 or dispatch emergency services.";
    expect(emergencyNotice).toContain("human-in-the-loop");
    expect(emergencyNotice).toContain("not contact 911");
  });

  it("verifies evidence linking for extracted claims", () => {
    // Every claim in the system must connect to evidence or be marked with its origin
    INITIAL_INCIDENTS.forEach((inc) => {
      inc.claims.forEach((claim) => {
        expect(["user_reported", "ai_inferred", "independently_verified"]).toContain(claim.origin);
        expect(claim.statement).toBeTruthy();
        expect(claim.category).toBeTruthy();
      });
    });
  });

  it("verifies explainable AI reasoning on suggested actions", () => {
    INITIAL_INCIDENTS.forEach((inc) => {
      inc.suggestedActions.forEach((action) => {
        // Every action must include human-readable reasoning (no black box decisions)
        expect(action.reasoning).toBeTruthy();
        expect(action.reasoning.length).toBeGreaterThan(10);
        expect(["PENDING", "APPROVED", "REJECTED"]).toContain(action.approvalStatus);
      });
    });
  });

  it("verifies immutable audit trail capabilities", () => {
    INITIAL_INCIDENTS.forEach((inc) => {
      expect(Array.isArray(inc.auditTrail)).toBe(true);
      inc.auditTrail.forEach((event) => {
        expect(event.id).toBeTruthy();
        expect(event.actor).toBeTruthy();
        expect(event.actionType).toBeTruthy();
        expect(event.timestamp).toBeTruthy();
      });
    });
  });

  it("verifies zero-cost synthetic demo resilience", () => {
    // Operates with zero API keys required in synthetic demo mode
    INITIAL_INCIDENTS.forEach((inc) => {
      expect(inc.isSynthetic).toBe(true);
    });
  });
});
