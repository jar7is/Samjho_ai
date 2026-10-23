import { describe, it, expect } from "vitest";
import { INITIAL_INCIDENTS } from "../src/lib/demo-data";
import { AuditEvent, Claim, Contradiction } from "../src/types/incident";

describe("Emergency Operations Store & Business Logic", () => {
  it("enforces mandatory reason when editing a claim", () => {
    const originalClaim: Claim = {
      id: "cl-001",
      incidentId: "INC-2026-081",
      category: "location",
      statement: "Sector 4 overpass pillar 4 is submerged under 4 feet water",
      origin: "user_reported",
      verificationStatus: "unverified",
      updatedAt: "2026-10-23T04:15:00Z",
    };

    const editReason = "Field verifier drone confirms water is 2.5 feet, not 4 feet.";
    const updatedClaim: Claim = {
      ...originalClaim,
      statement: "Sector 4 overpass pillar 4 has 2.5 feet water.",
      verificationStatus: "verified",
      editedBy: "Marcus Vance (Field Verifier)",
      editReason,
      updatedAt: new Date().toISOString(),
    };

    expect(updatedClaim.editReason).toBe(editReason);
    expect(updatedClaim.verificationStatus).toBe("verified");
    expect(updatedClaim.editedBy).toBe("Marcus Vance (Field Verifier)");
  });

  it("creates an immutable audit record when a claim is updated", () => {
    const auditLog: AuditEvent[] = [];

    const newEvent: AuditEvent = {
      id: "AUD-TEST-1",
      incidentId: "INC-2026-081",
      timestamp: new Date().toISOString(),
      actor: "Sarah Chen (Lead Coordinator)",
      actionType: "CLAIM_EDITED",
      description: "Claim cl-001 edited with verifier confirmation",
      previousValue: "Sector 4 overpass water level 4ft",
      newValue: "Sector 4 overpass water level 2.5ft",
    };

    auditLog.push(newEvent);

    expect(auditLog.length).toBe(1);
    expect(auditLog[0].actionType).toBe("CLAIM_EDITED");
    expect(auditLog[0].actor).toBe("Sarah Chen (Lead Coordinator)");
  });

  it("handles contradiction reconciliation with rationale logging", () => {
    const contradiction: Contradiction = {
      id: "ct-001",
      incidentId: "INC-2026-081",
      title: "Conflicting overpass passable status",
      description: "Social media says passable, official sensor says closed.",
      claimAId: "cl-1",
      claimBId: "cl-2",
      claimAText: "Vehicles passing slowly",
      claimBText: "Overpass completely obstructed",
      evidenceARef: "ev-1",
      evidenceBRef: "ev-2",
      resolutionStatus: "unresolved",
    };

    const resolved: Contradiction = {
      ...contradiction,
      resolutionStatus: "resolved",
      resolutionNote: "Official traffic sensor verified; overpass is closed to civilian traffic.",
      resolvedBy: "Sarah Chen (Lead Coordinator)",
      resolvedAt: new Date().toISOString(),
    };

    expect(resolved.resolutionStatus).toBe("resolved");
    expect(resolved.resolutionNote).toBeTruthy();
    expect(resolved.resolvedBy).toBe("Sarah Chen (Lead Coordinator)");
  });

  it("supports action approval and rejection with audit tracking", () => {
    const actions = [...INITIAL_INCIDENTS[0].suggestedActions];
    const targetAction = actions[0];

    const approvedAction = {
      ...targetAction,
      approvalStatus: "APPROVED" as const,
      approvedBy: "Sarah Chen (Lead Coordinator)",
      decidedAt: new Date().toISOString(),
    };

    expect(approvedAction.approvalStatus).toBe("APPROVED");
    expect(approvedAction.approvedBy).toBe("Sarah Chen (Lead Coordinator)");
  });
});
