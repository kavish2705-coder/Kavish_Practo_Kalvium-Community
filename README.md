# Practo - Medical Consultancy Platform 🏥

A full-stack medical consultancy platform inspired by Practo, built for Sprint 1.

## 👥 The Team
- **Kavish (Lead)**: Architecture, Integration, DevOps (GitHub Actions), and Global Layouts.
- **Joel Joy**: Patient-side UI, Browsing, Booking form, and Validation.
- **Harjodh Singh**: Doctor-side APIs, Prisma Schema, Slot Generation, and Dashboard.

## 🚀 Tech Stack
- **Frontend/Backend**: Next.js (App Router, React 19)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **CI/CD**: GitHub Actions (Configured in `.github/workflows/ci.yml`)
- **Cloud/Hosting**: Google Cloud Platform (GCP)
- **Styling**: Tailwind CSS & Glassmorphism UI
- **Validation**: Zod + React Hook Form

## 🎯 Sprint 1 MVP Scope
The Sprint 1 MVP is hyper-focused on **appointment scheduling** without double-booking.
- Patients can browse doctors and book 30-minute time slots.
- Doctors can manage their profile and view their dashboard.
- **Double-booking is physically prevented** at the database level using a unique constraint `@@unique([doctorId, startTime])`.

## 💻 Getting Started for Developers

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kavish2705-coder/Kavish_Practo_Kalvium-Community.git
   cd Kavish_Practo_Kalvium-Community
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory (use `.env.example` as a template).
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/practo_db"
   NEXTAUTH_SECRET="your_secret_here"
   ```

4. **Initialize Database:**
   Sync the Prisma schema to your PostgreSQL instance:
   ```bash
   npx prisma db push
   ```
   Generate the Prisma Client types:
   ```bash
   npx prisma generate
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the Landing Page.

## 🌿 Git Workflow
- `master` is the main branch and is protected by GitHub Actions.
- Create feature branches for your tasks:
  - Joel: `git checkout -b feature/patient-booking`
  - Harjodh: `git checkout -b feature/doctor-dashboard`
- Open a Pull Request for Kavish to review. Merging requires the CI pipeline (TypeScript, ESLint) to pass!
