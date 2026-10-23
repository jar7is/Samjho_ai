'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Incident,
  UserProfile,
  VerificationStatus,
  IncidentStatus,
  AuditEvent,
  Claim,
  SuggestedAction,
} from '@/types/incident';
import { INITIAL_DEMO_INCIDENTS, DEMO_USERS } from './demo-data';

interface ReliefBridgeContextType {
  incidents: Incident[];
  currentUser: UserProfile;
  isDemoMode: boolean;
  switchUser: (userId: string) => void;
  toggleDemoMode: () => void;
  resetDemoData: () => void;
  getIncident: (id: string) => Incident | undefined;
  updateClaim: (
    incidentId: string,
    claimId: string,
    newStatement: string,
    reason: string,
    newStatus?: VerificationStatus
  ) => void;
  setClaimVerification: (
    incidentId: string,
    claimId: string,
    newStatus: VerificationStatus,
    reason: string
  ) => void;
  resolveContradiction: (
    incidentId: string,
    contradictionId: string,
    resolutionNote: string
  ) => void;
  decideAction: (
    incidentId: string,
    actionId: string,
    status: 'APPROVED' | 'REJECTED',
    reason?: string
  ) => void;
  updateIncidentStatus: (
    incidentId: string,
    newStatus: IncidentStatus,
    reason?: string
  ) => void;
  assignIncident: (incidentId: string, assigneeName: string) => void;
  mergeDuplicateIncident: (
    primaryId: string,
    duplicateId: string,
    mergeNote: string
  ) => void;
  addIncident: (newIncident: Incident) => void;
}

const ReliefBridgeContext = createContext<ReliefBridgeContextType | undefined>(undefined);

const STORAGE_KEY = 'reliefbridge_incidents_v1';
const USER_KEY = 'reliefbridge_active_user_v1';
const DEMO_MODE_KEY = 'reliefbridge_demo_mode_v1';

export function ReliefBridgeProvider({ children }: { children: ReactNode }) {
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_DEMO_INCIDENTS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS[0]);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Hydrate from localStorage if present
  useEffect(() => {
    try {
      const storedIncidents = localStorage.getItem(STORAGE_KEY);
      if (storedIncidents) {
        setIncidents(JSON.parse(storedIncidents));
      }
      const storedUser = localStorage.getItem(USER_KEY);
      if (storedUser) {
        const found = DEMO_USERS.find((u) => u.id === storedUser);
        if (found) setCurrentUser(found);
      }
      const storedDemo = localStorage.getItem(DEMO_MODE_KEY);
      if (storedDemo !== null) {
        setIsDemoMode(storedDemo === 'true');
      }
    } catch {
      // Local storage disabled or corrupted, use defaults
    }
    setIsMounted(true);
  }, []);

  // Save to localStorage when modified
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
      localStorage.setItem(USER_KEY, currentUser.id);
      localStorage.setItem(DEMO_MODE_KEY, String(isDemoMode));
    } catch {
      // Ignore write errors in restricted sandbox
    }
  }, [incidents, currentUser, isDemoMode, isMounted]);

  const switchUser = (userId: string) => {
    const found = DEMO_USERS.find((u) => u.id === userId);
    if (found) setCurrentUser(found);
  };

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => !prev);
  };

  const resetDemoData = () => {
    setIncidents(INITIAL_DEMO_INCIDENTS);
    setCurrentUser(DEMO_USERS[0]);
    setIsDemoMode(true);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(DEMO_MODE_KEY);
    } catch {
      // Ignore
    }
  };

  const getIncident = (id: string): Incident | undefined => {
    return incidents.find((inc) => inc.id === id);
  };

  const addAuditEvent = (
    incident: Incident,
    actionType: AuditEvent['actionType'],
    description: string,
    previousValue?: string,
    newValue?: string
  ): Incident => {
    const newEvent: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-5)}`,
      incidentId: incident.id,
      timestamp: new Date().toISOString(),
      actor: currentUser.name,
      actionType,
      description,
      previousValue,
      newValue,
    };
    return {
      ...incident,
      updatedAt: new Date().toISOString(),
      auditTrail: [newEvent, ...incident.auditTrail],
    };
  };

  const updateClaim = (
    incidentId: string,
    claimId: string,
    newStatement: string,
    reason: string,
    newStatus?: VerificationStatus
  ) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== incidentId) return inc;
        const targetClaim = inc.claims.find((c) => c.id === claimId);
        if (!targetClaim) return inc;

        const previousStatement = targetClaim.statement;
        const updatedClaims: Claim[] = inc.claims.map((c) =>
          c.id === claimId
            ? {
                ...c,
                statement: newStatement,
                editReason: reason,
                editedBy: currentUser.name,
                origin: 'independently_verified',
                verificationStatus: newStatus || c.verificationStatus,
                updatedAt: new Date().toISOString(),
              }
            : c
        );

        const updatedInc: Incident = {
          ...inc,
          claims: updatedClaims,
        };

        return addAuditEvent(
          updatedInc,
          'CLAIM_EDITED',
          `Claim corrected by ${currentUser.name}: "${reason}"`,
          previousStatement,
          newStatement
        );
      })
    );
  };

  const setClaimVerification = (
    incidentId: string,
    claimId: string,
    newStatus: VerificationStatus,
    reason: string
  ) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== incidentId) return inc;
        const targetClaim = inc.claims.find((c) => c.id === claimId);
        if (!targetClaim) return inc;

        const prevStatus = targetClaim.verificationStatus;
        const updatedClaims = inc.claims.map((c) =>
          c.id === claimId
            ? {
                ...c,
                verificationStatus: newStatus,
                editReason: reason || c.editReason,
                editedBy: currentUser.name,
                updatedAt: new Date().toISOString(),
              }
            : c
        );

        const updatedInc: Incident = {
          ...inc,
          claims: updatedClaims,
        };

        return addAuditEvent(
          updatedInc,
          'CLAIM_VERIFIED',
          `Claim status updated to ${newStatus}. Note: "${reason}"`,
          prevStatus,
          newStatus
        );
      })
    );
  };

  const resolveContradiction = (
    incidentId: string,
    contradictionId: string,
    resolutionNote: string
  ) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== incidentId) return inc;
        const updatedContradictions = inc.contradictions.map((con) =>
          con.id === contradictionId
            ? {
                ...con,
                resolutionStatus: 'resolved' as const,
                resolutionNote,
                resolvedBy: currentUser.name,
                resolvedAt: new Date().toISOString(),
              }
            : con
        );

        const updatedInc: Incident = {
          ...inc,
          contradictions: updatedContradictions,
        };

        return addAuditEvent(
          updatedInc,
          'CONTRADICTION_RESOLVED',
          `Contradiction marked resolved by ${currentUser.name}: "${resolutionNote}"`
        );
      })
    );
  };

  const decideAction = (
    incidentId: string,
    actionId: string,
    status: 'APPROVED' | 'REJECTED',
    reason?: string
  ) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== incidentId) return inc;
        const updatedActions: SuggestedAction[] = inc.suggestedActions.map((act) =>
          act.id === actionId
            ? {
                ...act,
                approvalStatus: status,
                approvedBy: currentUser.name,
                rejectionReason: status === 'REJECTED' ? reason : undefined,
                decidedAt: new Date().toISOString(),
              }
            : act
        );

        const targetAction = inc.suggestedActions.find((a) => a.id === actionId);
        const updatedInc: Incident = {
          ...inc,
          suggestedActions: updatedActions,
        };

        return addAuditEvent(
          updatedInc,
          status === 'APPROVED' ? 'ACTION_APPROVED' : 'ACTION_REJECTED',
          `${status === 'APPROVED' ? 'Approved' : 'Rejected'} action: "${targetAction?.actionText}". ${
            reason ? `Reason: ${reason}` : ''
          }`
        );
      })
    );
  };

  const updateIncidentStatus = (
    incidentId: string,
    newStatus: IncidentStatus,
    reason?: string
  ) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== incidentId) return inc;
        const prevStatus = inc.status;
        const updatedInc: Incident = {
          ...inc,
          status: newStatus,
        };

        return addAuditEvent(
          updatedInc,
          'STATUS_CHANGED',
          `Incident status transitioned from ${prevStatus} to ${newStatus}. ${
            reason ? `Notes: ${reason}` : ''
          }`,
          prevStatus,
          newStatus
        );
      })
    );
  };

  const assignIncident = (incidentId: string, assigneeName: string) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== incidentId) return inc;
        const prevAssignee = inc.assignedTo || 'Unassigned';
        const updatedInc: Incident = {
          ...inc,
          assignedTo: assigneeName,
        };

        return addAuditEvent(
          updatedInc,
          'ASSIGNED',
          `Assigned incident to ${assigneeName}`,
          prevAssignee,
          assigneeName
        );
      })
    );
  };

  const mergeDuplicateIncident = (
    primaryId: string,
    duplicateId: string,
    mergeNote: string
  ) => {
    const primary = incidents.find((i) => i.id === primaryId);
    const duplicate = incidents.find((i) => i.id === duplicateId);
    if (!primary || !duplicate) return;

    setIncidents((prev) => {
      // 1. Mark duplicate as CLOSED with note
      const updatedDuplicate: Incident = {
        ...duplicate,
        status: 'CLOSED',
        summary: `[MERGED INTO ${primary.id}] ${duplicate.summary}`,
        auditTrail: [
          {
            id: `AUD-${Date.now().toString().slice(-5)}`,
            incidentId: duplicate.id,
            timestamp: new Date().toISOString(),
            actor: currentUser.name,
            actionType: 'STATUS_CHANGED',
            description: `Merged into primary incident ${primary.id}. Note: "${mergeNote}"`,
            previousValue: duplicate.status,
            newValue: 'CLOSED',
          },
          ...duplicate.auditTrail,
        ],
      };

      // 2. Append duplicate evidence into primary incident
      const mergedEvidence = [
        ...primary.evidence,
        ...duplicate.evidence.map((ev) => ({
          ...ev,
          title: `[From ${duplicate.id}] ${ev.title}`,
        })),
      ];

      // Remove candidate flag
      const remainingCandidates = (primary.duplicateCandidates || []).filter(
        (c) => c.candidateIncidentId !== duplicateId
      );

      const updatedPrimary: Incident = {
        ...primary,
        evidence: mergedEvidence,
        duplicateCandidates: remainingCandidates,
        auditTrail: [
          {
            id: `AUD-${Date.now().toString().slice(-5)}`,
            incidentId: primary.id,
            timestamp: new Date().toISOString(),
            actor: currentUser.name,
            actionType: 'DUPLICATE_MERGE_FLAGGED',
            description: `Merged auxiliary incident ${duplicate.id} into this case. Attached ${duplicate.evidence.length} evidence records. Note: "${mergeNote}"`,
          },
          ...primary.auditTrail,
        ],
      };

      return prev.map((inc) => {
        if (inc.id === primaryId) return updatedPrimary;
        if (inc.id === duplicateId) return updatedDuplicate;
        return inc;
      });
    });
  };

  const addIncident = (newIncident: Incident) => {
    const withAudit: Incident = {
      ...newIncident,
      auditTrail: [
        {
          id: `AUD-${Date.now().toString().slice(-5)}`,
          incidentId: newIncident.id,
          timestamp: new Date().toISOString(),
          actor: currentUser.name,
          actionType: 'INCIDENT_CREATED',
          description: `Incident recorded by ${currentUser.name}. Mode: ${
            isDemoMode ? 'SYNTHETIC DEMO' : 'LIVE AI'
          }`,
        },
        ...newIncident.auditTrail,
      ],
    };
    setIncidents((prev) => [withAudit, ...prev]);
  };

  return (
    <ReliefBridgeContext.Provider
      value={{
        incidents,
        currentUser,
        isDemoMode,
        switchUser,
        toggleDemoMode,
        resetDemoData,
        getIncident,
        updateClaim,
        setClaimVerification,
        resolveContradiction,
        decideAction,
        updateIncidentStatus,
        assignIncident,
        mergeDuplicateIncident,
        addIncident,
      }}
    >
      {children}
    </ReliefBridgeContext.Provider>
  );
}

export function useReliefBridge() {
  const context = useContext(ReliefBridgeContext);
  if (!context) {
    throw new Error('useReliefBridge must be used within a ReliefBridgeProvider');
  }
  return context;
}
