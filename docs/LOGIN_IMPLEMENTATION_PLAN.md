# Implementation Plan - Login Page & Auth Flow (After Clicking "Log in")

This document outlines the detailed architectural and implementation plan for the **Login Page / Modal Flow** triggered when a user clicks the **"Log in"** button in the navigation header ([Navbar.tsx](../src/components/shared/Navbar.tsx)).

---

## 1. Overview & User Flow

When a user clicks the **"Log in"** button in the navigation header:
1. **Trigger Action**: Open a fast-loading **Login Modal** (`LoginModal.tsx`) or redirect to a dedicated `/login` page with return URL state.
2. **Authentication Method**:
   - Mobile Number / Email input + OTP verification (standard Practo healthcare flow).
   - Email + Password credentials fallback.
   - Social Login (Google / Single Sign-On).
3. **Role Awareness**: Differentiate between **Patient**, **Doctor**, and **Admin** accounts.
4. **Post-Authentication State**:
   - Persist JWT / Session cookie.
   - Update header state to show user profile avatar & dropdown menu (My Bookings, Medical History, Logout).
   - Automatically return user to their previous context (e.g., continuing a doctor appointment booking).

---

## 2. Technical Architecture & File Structure

```
src/
├── app/
│   ├── login/
│   │   └── page.tsx              # Dedicated Login page fallback
│   └── api/
│       └── auth/
│           ├── login/route.ts    # Credentials / OTP verification endpoint
│           ├── logout/route.ts   # Session termination endpoint
│           └── session/route.ts  # Current user session retriever
├── components/
│   └── auth/
│       ├── LoginModal.tsx        # Interactive Login dialog modal
│       ├── LoginForm.tsx        # Reusable form component (Email/Phone, Password/OTP)
│       └── UserNav.tsx          # Authenticated user dropdown in Navbar
├── context/
│   └── AuthContext.tsx           # Global authentication state provider
└── lib/
    └── auth.ts                   # JWT tokens, password hashing, session utils
```

---

## 3. Detailed Component & Implementation Steps

### A. Navigation Bar Integration (`src/components/shared/Navbar.tsx`)
- Comments and structural outline added to trigger login modal or route navigation:
  - `onLoginClick={() => setAuthModalOpen(true)}` or `<Link href="/login?redirect=...">`.
- Conditionally render `<UserNav />` when authenticated vs. `<Button>Log in</Button>` when unauthenticated.

### B. Login Modal / Page (`src/components/auth/LoginModal.tsx` & `/app/login/page.tsx`)
- **Step 1: Contact Entry**: Input email address or 10-digit mobile number.
- **Step 2: Verification**:
  - **OTP Mode**: Trigger 6-digit OTP SMS/Email simulation with resend timer.
  - **Password Mode**: Input password with "Show/Hide Password" toggle and "Forgot Password?" link.
- **Step 3: Validation & Error Handling**:
  - Input field sanitization and regex validation.
  - User-friendly error messaging (e.g., "Invalid phone number", "Incorrect OTP").

### C. Database & Backend API Integration (Prisma ORM)
- **Database Models** (`prisma/schema.prisma`):
  - `User`: `id`, `name`, `email`, `phone`, `role` (PATIENT, DOCTOR, ADMIN), `createdAt`.
  - `Session` / `Account`: Authentication tokens & expiration timestamps.
- **API Endpoint** (`src/app/api/auth/login/route.ts`):
  - Accepts credentials or OTP payload.
  - Validates against Prisma DB.
  - Returns httpOnly secure cookie containing JWT session token.

### D. Global State & Context (`src/context/AuthContext.tsx`)
- `useAuth()` hook providing:
  - `user`: User profile data (`id`, `name`, `email`, `role`).
  - `isAuthenticated`: boolean indicator.
  - `login(credentials)`: triggers authentication API call.
  - `logout()`: clears session cookies and resets state.

---

## 4. Verification Plan

### Automated Tests
- Unit test form validation logic for email/phone inputs.
- API route test for `/api/auth/login` asserting status codes (200 for valid credentials, 401 for invalid).

### Manual Verification
- Click "Log in" button in header navigation.
- Verify smooth transition into login view.
- Test authentication submit behavior and post-login UI update.
