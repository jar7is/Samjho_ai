# Samjho AI — Project Context & Architecture

**Project Name:** Samjho AI  
**Challenge:** PromptWars Societal Benefit Challenge  
**Core Purpose:** Transform scattered, contradictory emergency reports (text, images, voice notes) into structured, evidence-linked incident cases for relief coordinators with a human-in-the-loop Evidence and Conflict Review System.  
**Critical Notice:** Decision-support application only. Not an autonomous emergency dispatch system. No external 911/emergency services are contacted automatically.

---

## Architecture Overview

- **Framework:** Next.js 16 (App Router), React 19, TypeScript (Strict Mode)
- **Styling:** Tailwind CSS v4, Lucide Icons
- **State & Data Layer (Milestone 1):** In-memory & local-storage backed reactive state store with comprehensive synthetic demo datasets.
- **Backend & Database (Milestones 2 & 3):** Supabase Auth, PostgreSQL (with strict Row Level Security), Private Storage, and server-side Google Gemini with Zod structured output validation.
- **Zero-Cost Constraint:** Operates on standard free tiers (Supabase free tier, Gemini free quota). Seamless fallback to local Synthetic DEMO_MODE when API quotas are unavailable or keys are unconfigured.

---

## Status & Milestones

- [x] **Milestone 1: Workspace Inspection & Complete Functional Frontend with Synthetic Data**
  - Fully typed schema (`Incident`, `Claim`, `Evidence`, `Contradiction`, `SuggestedAction`, `AuditEvent`).
  - Interactive Evidence & Conflict Review interface (`/incidents/[id]`).
  - Claim editing with mandatory rationale logging & verification badges (`User Reported`, `AI Inferred`, `Independently Verified`).
  - Contradiction side-by-side comparison (`ConflictAlert`) & missing information tracking (`MissingInfoList`).
  - Action approval/rejection workflows (`ActionApprovalList`) & immutable audit log recording (`AuditTimeline`).
  - Duplicate incident detection & merge review UI (`DuplicateMergeModal`).
  - Responsive pages: Landing (`/`), Dashboard (`/dashboard`), Intake & Submission (`/submit`), Auth & Role Switcher (`/auth`), Settings & Privacy (`/settings`).
- [ ] **Milestone 2: Supabase Database, Migrations, Authentication, Private Storage, and RLS**
- [ ] **Milestone 3: Real Server-Side Gemini Integration with Structured Validation & Graceful Fallback**
- [ ] **Milestone 4: Evidence Linking, Contradiction Engine, and Audit Persistence**
- [ ] **Milestone 5: Security Tests, Acceptance Checklist, and Final Deployment Prep**

---

## Key Files Created in Milestone 1
- `src/types/incident.ts`: Strict schema definitions for incidents, claims, evidence, contradictions, and audit logs.
- `src/lib/demo-data.ts`: Synthetic incidents satisfying Section 10 (location contradiction, trapped person gap, duplicate candidate).
- `src/lib/store.tsx`: Reactive state context with localStorage persistence, claim editing, conflict resolution, action approval, and audit trail.
- `src/components/layout/Navbar.tsx`: Responsive navigation with role switcher and persona indicator.
- `src/components/layout/DemoBanner.tsx`: Decision support disclaimer & Synthetic Demo / Live AI mode toggle.
- `src/components/incidents/StatusBadge.tsx`: Visual badges for status, severity, claim origin, and verification.
- `src/components/incidents/IncidentCard.tsx`: Dashboard summary cards with conflict, action, and duplicate flags.
- `src/components/incidents/ConflictAlert.tsx`: Side-by-side contradiction card with interactive reconciliation.
- `src/components/incidents/ClaimsReviewList.tsx`: Central claims table with inline editing, reason tracking, and status controls.
- `src/components/incidents/EvidenceCard.tsx`: Raw evidence cards with multi-modal metadata and transcripts.
- `src/components/incidents/MissingInfoList.tsx`: Missing information items and responder field queries.
- `src/components/incidents/ActionApprovalList.tsx`: Explainable AI recommendations with human approval/rejection buttons.
- `src/components/incidents/DuplicateMergeModal.tsx`: Proximity duplicate detection with merge reconciliation.
- `src/components/incidents/AuditTimeline.tsx`: Immutable chronological event stream of all human and AI actions.
- `src/app/page.tsx`: Landing page highlighting architecture, zero-cost design, and emergency disclaimers.
- `src/app/dashboard/page.tsx`: Emergency dashboard with search, multi-faceted filters, and metrics.
- `src/app/incidents/[id]/page.tsx`: Incident case review workspace with tabbed workflow.
- `src/app/submit/page.tsx`: Intake form with sample report loader and structured preview.
- `src/app/auth/page.tsx`: Authentication screen with 1-click coordinator role switcher.
- `src/app/settings/page.tsx`: Settings, cache purge, zero-cost limitations, and privacy controls.

---

## Verification & Checks Performed
- `npx tsc --noEmit`: Exited 0 (Clean TypeScript strict mode check).
- `npm run build`: Exited 0 (Successful compilation of all static and partially prerendered App Router routes).
- `browser_subagent`: Verified full user walkthrough across Landing, Dashboard, Case Detail, Claim Edit, Action Authorization, and Audit Timeline on `http://localhost:3001`.

---

## Known Issues / Limitations (Current Milestone)
- Milestone 1 uses synthetic in-browser reactive state with `localStorage` persistence.
- Supabase backend persistence and live Gemini API calls are planned for Milestones 2 and 3.

---

## Exact Next Step
Proceed to **Milestone 2**: Supabase database schema design, SQL migrations (`profiles`, `incidents`, `evidence`, `incident_claims`, `incident_events`), Row Level Security policies, authentication integration, and private storage bucket configuration.
