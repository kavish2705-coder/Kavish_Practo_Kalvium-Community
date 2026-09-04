# Implementation Plan: Patient-Side Features (Practo Platform)

## 1. Objective

This document provides a comprehensive, architectural implementation plan for the patient-side features of the Practo platform. The goal is to define the technical requirements, user experience workflows, database and API structures, security guardrails, and verification strategies necessary to expand the patient experience. 

Specifically, this plan addresses three critical functional domains:
1. **Doctor Search & Filtering**: Enabling patients to efficiently discover practitioners by specialty, clinic, experience, fees, availability, and geographic criteria.
2. **Patient Profile & Medical History**: Empowering patients to manage personal health information, emergency contacts, and historical consultation records.
3. **Reviews & Ratings**: Providing a transparent, verified feedback loop where patients evaluate completed consultations and inform future healthcare choices.

> **Note**: This document is strictly an implementation plan. All features, schema changes, and API contracts detailed herein represent proposed architecture and are explicitly marked as **Planned**.

---

## 2. Current Situation

### 2.1 Repository & Technology Stack Overview
- **Framework**: Next.js 15 (App Router, React 19)
- **Database & ORM**: PostgreSQL managed via Prisma ORM
- **Authentication**: JWT session tokens signed via `jose` and stored in `httpOnly` secure cookies (`SESSION_COOKIE`)
- **Styling**: Tailwind CSS with custom glassmorphism utilities and Lucide React icons
- **Architecture**: API Route handlers under `src/app/api/` with unified JSON response helpers (`apiResponse.ts`)

### 2.2 Baseline Implementation Status

| Feature Area | Current Repository State | Existing Limitations |
| :--- | :--- | :--- |
| **Doctor Search & Filtering** | - Route: `src/app/doctors/page.tsx`<br>- Filter component: `src/components/doctors/DoctorFilters.tsx`<br>- API: `GET /api/doctors` supporting text search (`specialization`, `clinicInfo`, `qualification`, `name`), `minExperience`, `maxFee`, and in-memory sorting. | - No database-level pagination (returns all matching records).<br>- Search input lacks debouncing in UI.<br>- Sorting performed in-memory rather than at query level.<br>- Slot availability is hardcoded in card view (`"Today at 04:00 PM"`).<br>- No filter by date, day-of-week, or real-time schedule slots. |
| **Patient Profile & Medical History** | - Dashboard: `src/app/dashboard/patient/page.tsx`<br>- API: `GET /api/patient/profile` and `PATCH /api/patient/profile`<br>- Data Model: `User` model (`id`, `name`, `email`, `role`, `createdAt`). | - No dedicated `PatientProfile` table in Prisma schema.<br>- Only `name` can be updated.<br>- Medical history is limited to viewing past appointments and text notes (`patientNotes`).<br>- No support for blood group, emergency contacts, chronic conditions, prescriptions, or document attachments. |
| **Reviews & Ratings** | - Model: `Review` in `prisma/schema.prisma` (`appointmentId`, `patientId`, `doctorId`, `rating`, `comment`).<br>- API: `GET /api/reviews` and `POST /api/reviews`<br>- Components: `ReviewModal.tsx`, `StarRating.tsx` | - Average rating calculated on-the-fly inside `GET /api/doctors` on each request without caching or indexing.<br>- No doctor response capability.<br>- No patient review editing or deletion flow.<br>- No review pagination or moderation/flagging system. |

---

## 3. Doctor Search & Filtering — Implementation Plan

### 3.1 Overview & Requirements
The doctor search experience must allow patients to pinpoint relevant doctors quickly with sub-second response times, informative filtering criteria, and real-time availability visibility.

### 3.2 Planned Architecture & Workflows

1. **Query Debouncing & URL State Synchronization [Planned]**:
   - Introduce a 300ms debounce on the text search input in `DoctorFilters.tsx` to eliminate redundant network requests during keystrokes.
   - Synchronize all filter parameters (`search`, `specialization`, `minExperience`, `maxFee`, `sortBy`, `date`, `page`) seamlessly with Next.js `useSearchParams` and `useRouter` to ensure URLs are bookmarkable and shareable.

2. **Availability & Schedule Integration [Planned]**:
   - Connect doctor search cards to real schedule availability instead of static placeholders.
   - Query doctor schedules (`Schedule` model) and active appointments (`Appointment` model) to determine the genuine next open time slot for each doctor.
   - Introduce an "Availability" filter: `Available Today`, `Available Tomorrow`, or `Available This Week`.

3. **Database-Level Sorting & Cursor/Offset Pagination [Planned]**:
   - Refactor `GET /api/doctors` to execute sorting and pagination directly inside PostgreSQL via Prisma queries (`skip`, `take`, `orderBy`).
   - Default page size: 10 doctors per page, returning pagination metadata (`totalCount`, `page`, `totalPages`, `hasMore`).

4. **Refined UI & Mobile Responsiveness [Planned]**:
   - Add collapsible filter sheet / drawer for mobile viewports.
   - Display active filter pills with individual remove buttons and a "Clear All Filters" shortcut.
   - Implement skeleton loaders for doctor cards during query transitions.

---

## 4. Patient Profile & Medical History — Implementation Plan

### 4.1 Overview & Requirements
Patients require a centralized, secure medical record and profile hub. This feature will transition the patient dashboard from a basic appointment list into a comprehensive personal health record (PHR).

### 4.2 Planned Architecture & Workflows

1. **Extended Profile Management [Planned]**:
   - Create a dedicated profile management interface inside `src/app/dashboard/patient/page.tsx` allowing patients to maintain:
     - Demographics: Date of birth, gender, blood group.
     - Contact details: Primary phone number, residential address/city.
     - Emergency contacts: Contact name, relationship, contact phone number.

2. **Structured Consultation & Medical History Timeline [Planned]**:
   - Transform the "Medical History" view into a chronological clinical timeline.
   - Group past consultations by year and specialty.
   - Display doctor consultation summaries, assigned follow-up instructions, and doctor-provided diagnostic notes.

3. **Digital Prescriptions & Document Records [Planned]**:
   - Introduce a structured view for prescribed medications (medication name, dosage, frequency, duration).
   - Provide a read-only consultation summary export option (printable / downloadable PDF summary of completed appointments).
   - Display lab test recommendations or referral advice recorded by doctors during appointments.

---

## 5. Reviews & Ratings — Implementation Plan

### 5.1 Overview & Requirements
Patient reviews provide credibility and assist new patients in selecting suitable healthcare providers. Reviews must be verified (only patients who attended completed consultations may review), tamper-resistant, and transparent.

### 5.2 Planned Architecture & Workflows

1. **Verified Review Submission [Planned]**:
   - Retain and reinforce strict validation:
     - Patient must be authenticated (`Role.PATIENT`).
     - Appointment must exist and belong to the authenticated patient (`patientId == user.id`).
     - Appointment status must strictly be `COMPLETED`.
     - Exactly one review per appointment (`appointmentId` unique constraint).
   - Rating range: 1 to 5 integer stars.
   - Optional text feedback: 10 to 1,000 characters.

2. **Review Aggregation & Caching Strategy [Planned]**:
   - To eliminate performance degradation when querying doctor listings, maintain aggregated rating statistics:
     - Store `averageRating` (Float) and `reviewCount` (Int) directly on `DoctorProfile`.
     - Update these counters atomically whenever a review is added, updated, or removed using Prisma transactions.

3. **Public Doctor Profile Review Showcase [Planned]**:
   - Enhance the doctor detail page (`src/app/doctors/[id]/page.tsx`) to display:
     - Rating breakdown bar chart (distribution of 5-star, 4-star, 3-star, etc.).
     - Paginated list of verified patient reviews with creation timestamps and verified consultation badges.
     - Patient privacy option: Option for patients to publish reviews anonymously (displaying "Verified Patient" instead of full name).

4. **Doctor Replies & Review Moderation [Planned]**:
   - Provide a formal channel for doctors to publish a single, professional response to patient reviews.
   - Introduce a basic reporting mechanism for patients or doctors to flag abusive or policy-violating content for administrator review.

---

## 6. Database and API Considerations

### 6.1 Database Schema Extensions (Prisma ORM) [Planned]

The following model additions and modifications are planned for future implementation in `prisma/schema.prisma`:

1. **`PatientProfile` Model [Planned]**:
   - Linked 1-to-1 with `User` where `role == PATIENT`.
   - Fields: `id`, `userId`, `phone`, `dateOfBirth`, `gender`, `bloodGroup`, `address`, `city`, `emergencyContactName`, `emergencyContactPhone`, `createdAt`, `updatedAt`.

2. **`DoctorProfile` Enhancements [Planned]**:
   - Add `averageRating` (Float, default 0.0) and `reviewCount` (Int, default 0) to avoid dynamic aggregation on every search query.
   - Add database indexes on `[specialization]`, `[experience]`, `[fee]`, and `[averageRating]`.

3. **`Prescription` / `MedicalRecord` Model [Planned]**:
   - Linked 1-to-1 or 1-to-many with `Appointment`.
   - Fields: `id`, `appointmentId`, `patientId`, `doctorId`, `diagnosis`, `medicines` (JSON or separate relation), `advice`, `followUpDate`, `createdAt`.

4. **`Review` Model Extensions [Planned]**:
   - Add `isAnonymous` (Boolean, default false).
   - Add `doctorReply` (String, optional) and `doctorRepliedAt` (DateTime, optional).

### 6.2 API Endpoints Specification [Planned]

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/doctors` | Search & filter doctors with DB-level pagination, sorting, and availability | Public |
| `GET` | `/api/doctors/[id]/reviews` | Paginated reviews for a specific doctor with rating breakdown | Public |
| `GET` | `/api/patient/profile` | Retrieve extended patient profile and medical record summary | Patient (`Role.PATIENT`) |
| `PUT` / `PATCH` | `/api/patient/profile` | Update demographics, address, and emergency contact details | Patient (`Role.PATIENT`) |
| `GET` | `/api/patient/medical-history` | Fetch paginated past consultation history with prescriptions/notes | Patient (`Role.PATIENT`) |
| `POST` | `/api/reviews` | Submit verified review for completed appointment | Patient (`Role.PATIENT`) |
| `PATCH` | `/api/reviews/[id]` | Update review text or rating within 48 hours of posting | Patient (Owner) |
| `POST` | `/api/reviews/[id]/reply` | Doctor response to a verified review | Doctor (Target Doctor) |

---

## 7. Authentication and Authorization Considerations

1. **Role-Based Access Control (RBAC)**:
   - Enforce explicit role verification on every patient endpoint using `getCurrentUser()`.
   - Access to patient-specific APIs (`/api/patient/*`, review submission) must reject any token not bearing `Role.PATIENT` with HTTP 403 Forbidden.

2. **Object-Level Ownership Enforcement (IDOR Prevention)**:
   - Authenticated patients must never access or modify another patient's medical history or profile.
   - In all database mutations and queries, scope data access by `user.id` extracted directly from the verified session payload, never trusting request body or URL path parameters for identity.

3. **Session Security**:
   - JWT tokens signed using `HS256` or `RS256` with strict expiration (`SESSION_MAX_AGE`).
   - Cookies must have `httpOnly: true`, `sameSite: "lax"`, and `secure: true` in production environments.

---

## 8. Validation and Security Considerations

1. **Input Validation (Zod Schemas) [Planned]**:
   - Formulate strict Zod validation schemas for all incoming patient payloads:
     - Search queries: Sanitized strings, numeric bounds for fee/experience.
     - Profile updates: Valid phone formats (E.164 or 10-digit Indian standard), valid blood group enums (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`), character limits on address.
     - Reviews: Rating strictly constrained to integers `[1, 2, 3, 4, 5]`, comment strings bounded between 10 and 1,000 characters.

2. **Data Sanitization & Injection Prevention**:
   - Prisma ORM automatically parameterizes SQL queries, neutralizing SQL injection vectors.
   - All free-text fields (patient notes, review comments) must be HTML-escaped and sanitized prior to rendering to eliminate Cross-Site Scripting (XSS).

3. **Rate Limiting & Abuse Prevention [Planned]**:
   - Implement IP and user-based rate limiting on search queries (prevent scraping) and review submissions (prevent spamming).

4. **Health Data Privacy (Compliance Readiness)**:
   - Restrict logging of sensitive patient information (medical notes, diagnoses) in application stdout / production log aggregators.
   - Ensure soft-delete / data export capabilities align with healthcare privacy standards.

---

## 9. Testing Plan

### 9.1 Unit Testing [Planned]
- Validate Zod schema parsers with valid, malformed, boundary, and malicious input objects.
- Test rating calculation helpers and filter query builder utilities.
- Test date and availability slot parsing routines.

### 9.2 Integration Testing [Planned]
- **Search & Filter Endpoint (`/api/doctors`)**:
  - Verify filtering by single and combined criteria (specialty + maxFee + minExperience).
  - Test pagination offsets and limit caps (e.g., requesting 1,000 items capped to max allowed).
- **Patient Profile Endpoint (`/api/patient/profile`)**:
  - Test 401 response for unauthenticated requests.
  - Test 403 response for users logged in with `Role.DOCTOR`.
  - Test successful profile retrieval and update for authorized patient.
- **Review Submission Endpoint (`/api/reviews`)**:
  - Test rejection of review on `CONFIRMED` or `CANCELLED` appointments (must be `COMPLETED`).
  - Test rejection of duplicate review submission on the same appointment.
  - Test rejection when a patient attempts to review another patient's appointment.

### 9.3 End-to-End (E2E) Testing [Planned]
- **Scenario A**: Patient searches for a specialist, applies fee and experience filters, navigates through paginated results, and opens the doctor detail page.
- **Scenario B**: Patient updates full name and emergency contact details in the dashboard and verifies persistent storage across sessions.
- **Scenario C**: Patient completes a consultation, opens the review modal from past appointments, submits a 5-star review, and observes immediate UI update and rating reflection.

---

## 10. Acceptance Criteria

When implementation commences, the pull requests must satisfy the following criteria:

- [ ] **Doctor Search**: Search returns accurate matches for doctor name, specialty, and clinic within 300ms on standard dataset.
- [ ] **Filter Controls**: Multi-criteria filters (specialty, experience, fee, sort order) can be applied simultaneously and reflect in URL parameters.
- [ ] **Pagination**: Doctor search results are paginated at the database layer with navigation controls and correct total count metadata.
- [ ] **Profile Management**: Patients can view and update their profile details with immediate validation feedback and database persistence.
- [ ] **Medical Records View**: Patient dashboard displays a clear, chronological history of completed appointments, doctor details, and consultation notes.
- [ ] **Review Eligibility**: Reviews can only be submitted for appointments marked `COMPLETED` and owned by the logged-in patient.
- [ ] **Duplicate Prevention**: Submitting multiple reviews for a single appointment is strictly blocked with a 409 Conflict status.
- [ ] **Rating Calculations**: Doctor profile accurately updates average rating and review count upon valid review creation.
- [ ] **Authorization Safeguards**: No patient can view or modify another patient's private records; API routes return 401/403 where appropriate.

---

## 11. Future Improvements

Beyond the immediate planned roadmap, the following enhancements are identified for subsequent iterations:

1. **Symptom-Based AI Discovery**: Integrating natural language symptom analysis to recommend appropriate medical specialties to patients before searching.
2. **Teleconsultation & Video Calling**: WebRTC-based in-browser video appointments integrated directly into the patient consultation dashboard.
3. **Prescription-to-Pharmacy Pipeline**: Enabling patients to order prescribed medicines directly through integrated pharmacy fulfillment partners.
4. **Dependents & Family Profiles**: Allowing a primary patient account to manage health profiles and appointments for children, spouses, or elderly dependents.
5. **Real-Time Notification System**: WebSockets or SMS/WhatsApp integration for appointment status updates, doctor delays, and prescription readiness alerts.
