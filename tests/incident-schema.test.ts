import { describe, it, expect } from "vitest";
import {
  EvidenceSchema,
  ClaimSchema,
  ContradictionSchema,
  SuggestedActionSchema,
  IntakeSubmissionSchema,
} from "../src/types/schemas";

describe("Incident Schema & Zod Validation Suite", () => {
  it("validates valid citizen intake submissions", () => {
    const validIntake = {
      citizenName: "Rahul Sharma",
      location: "Eastbank Parkway, Sector 4",
      category: "FLOOD",
      severity: "HIGH",
      complaintText: "Water level is rising near bridge, two families trapped on rooftop.",
      contactInfo: "+91-9876543210",
    };

    const result = IntakeSubmissionSchema.safeParse(validIntake);
    expect(result.success).toBe(true);
  });

  it("rejects intake submissions with short complaints or missing locations", () => {
    const invalidIntake = {
      citizenName: "R",
      location: "",
      category: "FLOOD",
      severity: "HIGH",
      complaintText: "Help", // too short (< 10 chars)
    };

    const result = IntakeSubmissionSchema.safeParse(invalidIntake);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorFields = result.error.issues.map((i) => i.path[0]);
      expect(errorFields).toContain("citizenName");
      expect(errorFields).toContain("location");
      expect(errorFields).toContain("complaintText");
    }
  });

  it("validates evidence items with multi-modal metadata", () => {
    const evidence = {
      id: "ev-001",
      incidentId: "inc-001",
      sourceType: "audio",
      title: "Citizen 911 Voice Memo Transcript",
      sender: "+1-555-0199",
      timestamp: "2026-10-23T04:15:00.000Z",
      contentSnippet: "We hear water rushing under the roadway near the ramp.",
      mimeType: "audio/ogg",
      isSynthetic: true,
    };

    const result = EvidenceSchema.safeParse(evidence);
    expect(result.success).toBe(true);
  });

  it("validates claim verification status transitions", () => {
    const validClaim = {
      id: "cl-101",
      incidentId: "inc-001",
      category: "location",
      statement: "Overpass pillar 4 is compromised",
      origin: "ai_inferred",
      verificationStatus: "in_review",
      updatedAt: "2026-10-23T04:20:00.000Z",
    };

    expect(ClaimSchema.safeParse(validClaim).success).toBe(true);

    const invalidClaim = {
      ...validClaim,
      verificationStatus: "unknown_status",
    };
    expect(ClaimSchema.safeParse(invalidClaim).success).toBe(false);
  });

  it("validates contradiction records linking contradictory claims", () => {
    const contradiction = {
      id: "ct-001",
      incidentId: "inc-001",
      title: "Conflicting Water Level Reports",
      description: "Drone imagery shows 1.2m while eyewitness reports 3m.",
      claimAId: "cl-101",
      claimBId: "cl-102",
      claimAText: "Water at 1.2 meters",
      claimBText: "Water above 3 meters",
      evidenceARef: "ev-01",
      evidenceBRef: "ev-02",
      resolutionStatus: "unresolved",
    };

    expect(ContradictionSchema.safeParse(contradiction).success).toBe(true);
  });

  it("validates human-in-the-loop action recommendations", () => {
    const action = {
      id: "act-01",
      incidentId: "inc-001",
      actionText: "Deploy inflatable boat rescue unit to Sector 4",
      reasoning: "Verified 2 families trapped on roof with rising flood waters.",
      priority: "IMMEDIATE",
      approvalStatus: "PENDING",
    };

    expect(SuggestedActionSchema.safeParse(action).success).toBe(true);
  });
});
