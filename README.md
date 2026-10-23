# Samjho AI — Evidence & Conflict Review System

[![PromptWars Societal Benefit Challenge](https://img.shields.io/badge/PromptWars-Societal_Benefit_Challenge-orange.svg)](https://hack2skill.com)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.2-black.svg)](https://nextjs.org/)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict_Mode-blue.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Tests-31_Passed-brightgreen.svg)](tests/)
[![Security](https://img.shields.io/badge/Security-Sanitized_%26_Hardened-emerald.svg)](SECURITY.md)

> **CRITICAL DECISION-SUPPORT NOTICE:**  
> Samjho AI is a human-in-the-loop coordination and decision-support system. It does **not** contact 911 or execute autonomous emergency dispatch. All recommended actions require human coordinator review and authorization.

---

## 🎯 Problem Statement & Societal Alignment

During rapid-onset natural disasters (floods, flash floods, landslides, urban collapse), disaster relief command centers are inundated by hundreds of chaotic, unstructured reports from citizens, social feeds, and field teams.

### The Emergency Coordination Crisis:
1. **Conflicting Reports:** Eyewitnesses often state contradictory facts (e.g. "Overpass is passable" vs "Overpass flooded and blocked").
2. **Missing Critical Data:** Vital rescue data (e.g. number of trapped individuals, elderly/infants present, water depth) is frequently missing.
3. **Duplicate Noise:** Multiple panicked callers report the same incident, cluttering dispatch queues.
4. **Black-Box AI Danger:** Autonomous AI agents that dispatch emergency resources without human oversight pose lethal life-safety risks.

### The Samjho AI Solution:
Samjho AI solves this through a **Human-in-the-Loop Evidence & Conflict Review System** that extracts evidence-backed claims, exposes contradictions side-by-side, tracks unknown variables, and proposes explainable action recommendations that require explicit coordinator sign-off.

---

## ⚡ Core Features & Innovations

| Feature | Description | Societal Impact |
| :--- | :--- | :--- |
| **Multimodal Citizen Intake** | Accessible complaint submission with browser Web Speech API voice recording and manual fallback. | Allows citizens in panic or low-literacy environments to report instantly via voice. |
| **Evidence-Linked Claims** | Dissects unstructured reports into atomic, typed claims linked to raw source quotes. | Eliminates coordinator guesswork; every claim traces to its origin. |
| **Contradiction Engine** | Detects conflicting claims side-by-side with interactive human reconciliation. | Prevents sending rescue teams into impassable routes or false locations. |
| **Unknowns & Missing Info Tracker** | Automatically flags life-critical gaps (e.g., number of trapped victims). | Generates targeted clarification questions for field verifiers. |
| **Explainable AI Recommendations** | Proposes prioritized interventions with transparent reasoning. | Accelerates coordinator decision-making without black-box automation. |
| **Immutable Audit Timeline** | Chronological ledger recording who edited claims, resolved conflicts, or approved actions. | Provides legal accountability and post-incident review integrity. |
| **Zero-Cost Resilience** | In-browser Synthetic Demo Mode operates seamlessly with zero paid API keys. | Deployable instantly in bandwidth-constrained disaster response hubs. |

---

## 🏗️ Architecture & Technology Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript (Strict Mode)
- **Styling:** Tailwind CSS v4, Lucide Icons
- **Runtime Validation:** Zod schemas (`src/types/schemas.ts`)
- **Testing:** Vitest 5 (`npm test` — 31 unit & integration tests)
- **Security:** CSP & OWASP HTTP security headers, input sanitization against XSS (`src/lib/sanitize.ts`), role-based access controls
- **Deployment:** Vercel edge deployment with Turbopack

---

## 🧪 Testing & Quality Assurance

Samjho AI includes a comprehensive automated test suite covering schemas, security sanitization, deterministic time rendering, state workflows, and problem statement alignment.

```bash
# Run all unit and integration tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Suite Summary (31 Tests Passing):
- `tests/incident-schema.test.ts`: Zod schema validation for incidents, claims, evidence, and intake.
- `tests/security-sanitization.test.ts`: XSS attack mitigation, script injection stripping, coordinate validation.
- `tests/format-time.test.ts`: Deterministic date/time formatting eliminating SSR/client hydration mismatches.
- `tests/demo-data.test.ts`: Synthetic demo incident data integrity and coverage.
- `tests/state-store.test.ts`: Claim editing rationale enforcement, contradiction resolution, action approvals, audit log immutability.
- `tests/problem-statement-alignment.test.ts`: Verification of PromptWars safety guidelines, human-in-the-loop constraints, and zero-cost resilience.

---

## 🚀 Getting Started Locally

```bash
# Clone the repository
git clone https://github.com/jar7is/Samjho_ai.git
cd Samjho_ai

# Install dependencies
npm install

# Run automated tests
npm test

# Start the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) or [http://localhost:3001](http://localhost:3001) in your browser.

---

## 🔒 Security & Privacy

For full security policy, threat mitigations, and disclosure procedures, please see [SECURITY.md](SECURITY.md).
