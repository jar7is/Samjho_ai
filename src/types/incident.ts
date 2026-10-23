export type SourceType = 'text' | 'image' | 'audio' | 'document';

export type ClaimOrigin = 'user_reported' | 'ai_inferred' | 'independently_verified';

export type VerificationStatus = 'unverified' | 'in_review' | 'verified' | 'disputed' | 'retracted';

export type IncidentStatus = 'NEW' | 'TRIAGED' | 'ACTION_REQUIRED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type UserRole = 'COORDINATOR' | 'FIELD_VERIFIER' | 'DISPATCH_ANALYST';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  badgeNumber?: string;
}

export interface Evidence {
  id: string;
  incidentId: string;
  sourceType: SourceType;
  title: string;
  sender: string;
  timestamp: string;
  contentSnippet: string;
  fileSizeBytes?: number;
  mimeType?: string;
  mediaUrl?: string;
  isSynthetic: boolean;
}

export interface Claim {
  id: string;
  incidentId: string;
  category: 'location' | 'hazard' | 'people_at_risk' | 'infrastructure' | 'resource_need';
  statement: string;
  origin: ClaimOrigin;
  verificationStatus: VerificationStatus;
  evidenceId?: string;
  evidenceQuote?: string;
  editedBy?: string;
  editReason?: string;
  updatedAt: string;
}

export interface Contradiction {
  id: string;
  incidentId: string;
  title: string;
  description: string;
  claimAId: string;
  claimBId: string;
  claimAText: string;
  claimBText: string;
  evidenceARef: string;
  evidenceBRef: string;
  resolutionStatus: 'unresolved' | 'investigating' | 'resolved';
  resolutionNote?: string;
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface MissingInfo {
  id: string;
  incidentId: string;
  item: string;
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  suggestedQuestions: string[];
  status: 'pending' | 'clarified' | 'waived';
  clarificationNote?: string;
}

export interface SuggestedAction {
  id: string;
  incidentId: string;
  actionText: string;
  reasoning: string;
  priority: 'IMMEDIATE' | 'HIGH' | 'ROUTINE';
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  rejectionReason?: string;
  decidedAt?: string;
}

export interface DuplicateCandidate {
  candidateIncidentId: string;
  candidateTitle: string;
  similarityReason: string;
  distanceKm?: number;
  detectedAt: string;
}

export interface AuditEvent {
  id: string;
  incidentId: string;
  timestamp: string;
  actor: string;
  actionType:
    | 'INCIDENT_CREATED'
    | 'CLAIM_EDITED'
    | 'CLAIM_VERIFIED'
    | 'STATUS_CHANGED'
    | 'ACTION_APPROVED'
    | 'ACTION_REJECTED'
    | 'CONTRADICTION_RESOLVED'
    | 'ASSIGNED'
    | 'EVIDENCE_ADDED'
    | 'DUPLICATE_MERGE_FLAGGED';
  description: string;
  previousValue?: string;
  newValue?: string;
}

export interface IncidentLocation {
  name: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isApproximate: boolean;
  landmarks?: string[];
}

export interface Incident {
  id: string;
  title: string;
  incidentType:
    | 'FLOOD'
    | 'FLASH_FLOOD'
    | 'LANDSLIDE'
    | 'STRUCTURAL_COLLAPSE'
    | 'MEDICAL_EMERGENCY'
    | 'INFRASTRUCTURE_FAILURE';
  status: IncidentStatus;
  severity: SeverityLevel;
  reportedAt: string;
  updatedAt: string;
  location: IncidentLocation;
  summary: string;
  assignedTo?: string;
  isSynthetic: boolean;
  evidence: Evidence[];
  claims: Claim[];
  contradictions: Contradiction[];
  missingInfo: MissingInfo[];
  suggestedActions: SuggestedAction[];
  duplicateCandidates?: DuplicateCandidate[];
  auditTrail: AuditEvent[];
}
