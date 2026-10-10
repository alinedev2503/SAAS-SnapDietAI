# Security Specification - NutriLense AI

## 1. Data Invariants
- Each user can only access their own profile at `/users/{userId}`.
- Each user can only access their own scans at `/users/{userId}/scans/{scanId}`.
- Each user can only access their own daily logs at `/users/{userId}/dailyLogs/{date}`.
- Users MUST be authenticated with a verified email to read or write data.

## 2. "Dirty Dozen" Payloads (Examples)
1. Attempt to write to another user's profile: `{ "id": "other_user", "name": "Hack", "email": "hack@example.com" }` -> **DENIED**
2. Attempt to write a scan without a userId: `{ "id": "123", "productName": "Hack", ... }` -> **DENIED**
3. Attempt to write a scan with a different userId: `{ "id": "123", "userId": "other_user", ... }` -> **DENIED**
4. Attempt to write a scan with invalid health score: `{ "healthScore": 101, ... }` -> **DENIED**
... (additional payloads)

## 3. Hardening Plan
- Update `isSignedIn()` to enforce `request.auth.token.email_verified == true`.
- Maintain strict subcollection path isolation.
- Keep default-deny at root.
