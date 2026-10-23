# Security Policy & Architecture — Samjho AI

## Overview
Samjho AI is a human-in-the-loop decision support system for emergency coordinators. Security, data privacy, and operational resilience are central to its design.

## Threat Model & Mitigations

### 1. Cross-Site Scripting (XSS) & Content Injection
- **Risk:** Malicious citizen reports or contaminated OCR/transcript data attempting script injection.
- **Mitigation:**
  - Strict input sanitization via `src/lib/sanitize.ts` stripping script blocks, event handlers, and data/javascript URIs.
  - HTML entity escaping prior to state commit.
  - Strict Content-Security-Policy and `X-Content-Type-Options: nosniff` headers.

### 2. Autonomous Action Dispatch Prevention (Safety Hazard)
- **Risk:** AI automated systems making mistaken dispatch decisions during disasters resulting in loss of life or misallocated resources.
- **Mitigation:**
  - Zero autonomous execution. Every suggested action requires explicit human coordinator review and cryptographic/audited authorization.
  - Permanent banner on all pages specifying decision support only (no direct 911 dispatch).

### 3. Audit Log Tampering & Accountability
- **Risk:** Malicious or erroneous claim modification without traceability.
- **Mitigation:**
  - Immutable audit trail. Every claim edit requires mandatory justification reason and logs coordinator identity, timestamp, before-value, and after-value.

### 4. Zero-Cost & Privacy Guarantees
- **Risk:** Exposure of citizen PII or leaked API keys.
- **Mitigation:**
  - Full synthetic demo mode operates entirely in-memory / local client storage with zero external network leakage.
  - Zero hardcoded API keys or credentials.
  - RLS (Row Level Security) and least-privilege coordinator roles.

## HTTP Security Headers
- `X-Frame-Options: DENY` (Clickjacking prevention)
- `X-Content-Type-Options: nosniff` (MIME-sniffing prevention)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(self), geolocation=()`

## Reporting a Vulnerability
To report security concerns, please email `security@reliefbridge.org` or open a private advisory on GitHub.
