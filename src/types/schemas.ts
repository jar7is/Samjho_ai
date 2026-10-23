import { z } from "zod";

export const SourceTypeSchema = z.enum(["text", "image", "audio", "document"]);

export const ClaimOriginSchema = z.enum(["user_reported", "ai_inferred", "independently_verified"]);

export const VerificationStatusSchema = z.enum([
  "unverified",
  "in_review",
  "verified",
  "disputed",
  "retracted",
]);

export const IncidentStatusSchema = z.enum([
  "NEW",
  "TRIAGED",
  "ACTION_REQUIRED",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
]);

export const SeverityLevelSchema = z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]);

export const EvidenceSchema = z.object({
  id: z.string().min(1),
  incidentId: z.string().min(1),
  sourceType: SourceTypeSchema,
  title: z.string().min(1),
  sender: z.string().min(1),
  timestamp: z.string().datetime({ offset: true }).or(z.string().min(1)),
  contentSnippet: z.string().min(1),
  fileSizeBytes: z.number().optional(),
  mimeType: z.string().optional(),
  mediaUrl: z.string().optional(),
  isSynthetic: z.boolean(),
});

export const ClaimSchema = z.object({
  id: z.string().min(1),
  incidentId: z.string().min(1),
  category: z.enum(["location", "hazard", "people_at_risk", "infrastructure", "resource_need"]),
  statement: z.string().min(1),
  origin: ClaimOriginSchema,
  verificationStatus: VerificationStatusSchema,
  evidenceId: z.string().optional(),
  evidenceQuote: z.string().optional(),
  editedBy: z.string().optional(),
  editReason: z.string().optional(),
  updatedAt: z.string(),
});

export const ContradictionSchema = z.object({
  id: z.string().min(1),
  incidentId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  claimAId: z.string().min(1),
  claimBId: z.string().min(1),
  claimAText: z.string().min(1),
  claimBText: z.string().min(1),
  evidenceARef: z.string().min(1),
  evidenceBRef: z.string().min(1),
  resolutionStatus: z.enum(["unresolved", "investigating", "resolved"]),
  resolutionNote: z.string().optional(),
  resolvedBy: z.string().optional(),
  resolvedAt: z.string().optional(),
});

export const SuggestedActionSchema = z.object({
  id: z.string().min(1),
  incidentId: z.string().min(1),
  actionText: z.string().min(1),
  reasoning: z.string().min(1),
  priority: z.enum(["IMMEDIATE", "HIGH", "ROUTINE"]),
  approvalStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  approvedBy: z.string().optional(),
  rejectionReason: z.string().optional(),
  decidedAt: z.string().optional(),
});

export const IntakeSubmissionSchema = z.object({
  citizenName: z.string().min(2, "Name must be at least 2 characters").max(100),
  location: z.string().min(3, "Location description is required"),
  category: z.enum(["FLOOD", "FLASH_FLOOD", "LANDSLIDE", "STRUCTURAL_COLLAPSE", "MEDICAL_EMERGENCY", "INFRASTRUCTURE_FAILURE"]),
  severity: SeverityLevelSchema,
  complaintText: z.string().min(10, "Complaint must be at least 10 characters").max(5000),
  voiceTranscript: z.string().optional(),
  contactInfo: z.string().optional(),
});
