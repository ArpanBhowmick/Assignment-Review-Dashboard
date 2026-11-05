# Joineazy — Assignment & Review Dashboard

An academic course workflow and assignment management dashboard built with React 19, TypeScript, Vite, and Tailwind CSS. The application provides dedicated, role-tailored portals for faculty course instructors (**Admin**) and enrolled students (**Student**) in a computer science distributed systems course (`CS101 Distributed Systems`).

> **Project Notice:** This repository is a frontend assignment and demonstration application. It implements client-side mock authentication, realistic institutional workflow simulation, and browser-local persistence (`localStorage`). It does not connect to a live backend database or cloud authentication provider.

---

## Table of Contents

1. [Features](#features)
   - [Student Portal Features](#student-portal-features)
   - [Faculty Admin Features](#faculty-admin-features)
   - [System & General Features](#system--general-features)
2. [Technology Stack](#technology-stack)
3. [Setup Instructions](#setup-instructions)
4. [Login & Demo Accounts](#login--demo-accounts)
5. [Folder Structure](#folder-structure)
6. [Component Architecture](#component-architecture)
   - [Application Bootstrap & Layouts](#application-bootstrap--layouts)
   - [Student Workflow Data Flow](#student-workflow-data-flow)
   - [Admin Workflow Data Flow](#admin-workflow-data-flow)
7. [Data Storage & Persistence](#data-storage--persistence)
8. [Key Design Decisions](#key-design-decisions)
9. [Current Limitations](#current-limitations)
10. [Available Scripts](#available-scripts)
11. [Project Status](#project-status)

---

## Features

The application features have been verified against the actual codebase and categorized by operational status:

### Student Portal Features

| Feature | Status | Description |
| :--- | :---: | :--- |
| **Role-Specific Login** | Fully Implemented | Select from 5 seeded student profiles with pre-assigned academic tracks and roster IDs. |
| **Enrolled Assignments Stream** | Fully Implemented | Displays only deliverables scoped to the authenticated student via deterministic cohort filtering. |
| **Completion Telemetry** | Fully Implemented | Live completion progress bar (`submitted / total` percentage) and metric distribution cards (Pending, Submitted, Overdue). |
| **Search & Filtering** | Fully Implemented | Live keyword search across title, code, and description; category tabs for `ALL COHORT TASKS`, `PENDING`, `SUBMITTED`, and `ARCHIVED`. |
| **Assignment Details View** | Fully Implemented | Comprehensive spec sheet with due dates, instructor details, submission instructions, and Google Drive directory links. |
| **Submission Workflow** | Fully Implemented | Two-step confirmation dialog with pre-submission checklist; records official timestamp upon confirmation. |
| **Status Attestation Banners** | Fully Implemented | Dynamic status badges and persistent alerts indicating verification time and Drive sync status. |
| **Identity Guard Screen** | Fully Implemented | Dedicated fallback screen (`StudentIdentityUnavailable`) if an account has no matching student roster record. |
| **Direct File Upload** | External Simulation | Direct file upload is not handled on a custom backend; deliverables are managed via linked external Google Drive folders. |

### Faculty Admin Features

| Feature | Status | Description |
| :--- | :---: | :--- |
| **Course Assignment Dashboard** | Fully Implemented | Central management view displaying all course assignments, active counts, and status indicators. |
| **Assignment Completion Telemetry** | Fully Implemented | Real-time visual progress bar tracking submission percentage, submitted counts, and pending student counts. |
| **Student Audit Table & Verification** | Fully Implemented | Per-assignment student submission table showing submission status, timestamp verification, and Drive record links. |
| **Pagination & Row Control** | Fully Implemented | Configurable table pagination (5, 10, or 20 rows per page) with page jump buttons, previous/next controls, and range counters. |
| **Roster Expansion** | Fully Implemented | Collapsible roster drawer allowing faculty to preview additional student submission records beyond the current page slice. |
| **Assignment Creation Workflow** | Fully Implemented | Form to draft title, markdown description, date, cutoff time (EST), external Drive repository URL, and cohort scope. |
| **Rubric Boilerplate Insertion** | Fully Implemented | One-click insertion of standardized ACM rubric criteria (Clarity, Architecture, Test Suite Coverage) into assignment directives. |
| **Roster Cohort Allocation** | Fully Implemented | Dual-mode distribution: **Option A (Whole Class)** assigns all 28 students; **Option B (Selected Cohort)** allows fine-grained selection with live search, Select All, and Clear Selection controls. |
| **Assignment Editing Workflow** | Fully Implemented | Modify parameters, deadlines, Drive URLs, and cohort selection for existing assignments, syncing updates to student views. |
| **Assignment Deletion** | Fully Implemented | Modal confirmation with academic security protocol warning; detaches assignment and removes it from the faculty ledger. |
| **Drive Folder Clipboard Copy** | Fully Implemented | One-click button copying the Google Drive repository URL to the system clipboard with visual confirmation feedback. |
| **Archive & Gradebook Actions** | Simulated / Alert Stubs | Graded assignment cards feature "Download Archive" and "View Gradebook" buttons that trigger simulated alert dialogs. |

### System & General Features

- **Role-Based Routing & Protection:** Client-side route guards prevent unauthenticated access, disallow students from accessing admin paths, and prevent admins from viewing student views.
- **Strict Session Navigation Lock:** Custom hook (`useNavigationLock`) intercepts browser Back/Forward popstate events to keep users on their active page without losing in-flight state or unintentionally logging out.
- **State Synchronization & Auto-Persistence:** Full assignment and session state persists in browser `localStorage`, preserving changes across page reloads.
- **Comprehensive Responsive Design:** Fully responsive layout tested across 8 breakpoint tiers (from 320px small mobile to 1536px+ desktop).

---

## Technology Stack

The project uses the following dependencies and configurations:

| Category | Technology | Version | Purpose in Project |
| :--- | :--- | :--- | :--- |
| **Core Framework** | React | `^19.3.1` | Component-based user interface rendering. |
| **DOM Renderer** | React DOM | `^19.3.1` | React DOM bindings for client-side web rendering. |
| **Language** | TypeScript | `^6.0.3` | Type safety, interface definitions, and static type checking. |
| **Build Tool & Bundler** | Vite | `^8.3.5` | Fast development server, Hot Module Replacement (HMR), and production bundling. |
| **Routing** | React Router DOM | `^7.18.5` | Declarative client-side routing, route protection, and parameter resolution. |
| **CSS Framework** | Tailwind CSS | `^4.3.4` | Utility-first CSS framework configured via `@tailwindcss/vite`. |
| **UI Component System** | shadcn / Base UI | `@base-ui/react ^1.9.0` | Accessible unstyled primitives powering dialogs, tabs, checkboxes, and tables. |
| **Class Utilities** | Class Variance Authority | `^0.7.1` | Variant-driven CSS utility class organization (`cva`). |
| **CSS Merging** | `cn` | `^0.5.2` | Conditional Tailwind class name merging utility. |
| **Animation Utilities** | tw-animate-css | `^1.4.0` | Tailwind-compatible CSS keyframe animation classes. |
| **Typography** | Hanken Grotesk & JetBrains Mono | Web Fonts | Primary headline/body typography and monospace code/telemetry font. |
| **Icon System** | Google Material Symbols | Web Font | Outlined icons across navigation, buttons, status indicators, and badges. |
| **Icon Library** | Lucide React | `^1.68.0` | Auxiliary React icon set for UI primitives. |
| **Linter & Code Quality** | ESLint | `^10.13.0` | Static analysis with flat configuration (`eslint.config.js`). |

---

## Setup Instructions

Follow these steps to clone, install, and run the project locally.

### Prerequisites

- **Node.js:** `v20.19.0` or higher (Tested and verified on `v24.17.0`).
- **Package Manager:** `npm` `v10.0.0` or higher (Tested on `npm v11.13.0`).
- **Git:** Installed on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/ArpanBhowmick/Assignment-Review-Dashboard.git
cd Assignment-Review-Dashboard
```

### 2. Install Dependencies

Install project dependencies using `npm`:

```bash
npm install
```

### 3. Environment Variables

> **Note:** No `.env` configuration or external API keys are required. The application runs entirely client-side with mock data.

### 4. Run the Development Server

Start the local Vite development server:

```bash
npm run dev
```

Once started, open your browser and navigate to:

```text
http://localhost:5173/
```

### 5. Build for Production

To create an optimized production build:

```bash
npm run build
```

This executes `tsc -b` (TypeScript type check) followed by `vite build`. Production assets will be written to the `dist/` directory.

### 6. Preview Production Build

To preview the generated production build locally:

```bash
npm run preview
```

### 7. Run Code Linter

To verify code style and TypeScript rules with ESLint:

```bash
npm run lint
```

---

## Login & Demo Accounts

The application uses a **Sandbox Authentication Mode**. No passwords or tokens are required. Reviewers can toggle between **Student** and **Admin (Professor)** roles and select any seeded account.

```text
1. Open http://localhost:5173/ (redirects to /login).
2. Select either the "Student" or "Admin (Professor)" role tab.
3. Click any of the available account profiles.
4. Click "Continue as [Account Name] →".
```

### Seeded Admin (Faculty) Accounts

| Name | Faculty ID | Role Description |
| :--- | :--- | :--- |
| **Prof. Sarah Jenkins** | `#FAC-08821` | Lead Instructor · CS101 Distributed Systems |
| **Prof. Marcus Vance** | `#FAC-04192` | Associate Professor · CS101 Distributed Systems |

### Seeded Student Accounts

| Name | Student ID | Academic Standing | Cohort Assignments Available |
| :--- | :--- | :--- | :--- |
| **Alex Doe** *(Primary Demo)* | `#STU-4819` | Regular Standing | Enrolled in all course deliverables; submitted Lab 3, HW 1, Lab 1; pending ASN-003 and PRJ-001. |
| **Liam Chen** | `#STU-9921` | Regular Standing | Submitted ASN-003. |
| **Maya Patel** | `#STU-8153` | Honors Track | Submitted ASN-003. |
| **Lucas Romero** | `#STU-7862` | Regular Standing | Awaiting submission for ASN-003. |
| **Zoe Washington** | `#STU-9104` | Regular Standing | Submitted ASN-003. |

---

## Folder Structure

The project follows a modular, feature-oriented structure organized by domain and role:

```text
assignment-review-dashboard/
├── public/
│   └── favicon.svg                       # Joineazy browser tab icon
├── src/
│   ├── components/                       # React presentation & layout components
│   │   ├── admin/                        # Faculty administrative components
│   │   │   ├── common/
│   │   │   │   ├── AdminNavbar.tsx         # Faculty top navigation header
│   │   │   │   └── SecurityAuditFooter.tsx # Academic security & isolation audit strip
│   │   │   ├── AssignmentCard.tsx          # Faculty assignment card with telemetry & student table
│   │   │   ├── DeleteModal.tsx             # Irreversible deletion confirmation dialog
│   │   │   └── RosterSelectionTable.tsx    # Cohort allocation workstation (all vs selected)
│   │   ├── layout/                       # Role-based layout wrappers
│   │   │   ├── AdminLayout.tsx             # Admin header, fixed padding, and <Outlet />
│   │   │   └── StudentLayout.tsx           # Student header, footer, and <Outlet />
│   │   ├── student/                      # Student portal components
│   │   │   ├── common/
│   │   │   │   ├── StudentFooter.tsx       # Student academic systems footer
│   │   │   │   └── StudentNavbar.tsx       # Student top navigation header with user avatar
│   │   │   ├── studentUtils.ts             # Status resolution, folder naming, timestamp helpers
│   │   │   ├── StudentAssignmentCard.tsx   # Student deliverable card with metadata & submit button
│   │   │   ├── StudentIdentityUnavailable.tsx # Fallback view for unlinked student accounts
│   │   │   └── SubmissionConfirmModal.tsx  # Two-step submission confirmation dialog
│   │   └── ui/                           # Reusable shadcn / Base UI primitive components
│   │       ├── alert-dialog.tsx          # Accessible modal dialog primitive
│   │       ├── alert.tsx                 # Alert banner and notification callout
│   │       ├── badge.tsx                 # Status, tag, and urgency badge component
│   │       ├── button.tsx                # Variant-based button component
│   │       ├── checkbox.tsx              # Accessible checkbox input primitive
│   │       ├── input.tsx                 # Styled text input component
│   │       ├── label.tsx                 # Form field label component
│   │       ├── progress.tsx              # Completion percentage progress bar
│   │       ├── table.tsx                 # Responsive HTML table wrapper with horizontal scroll
│   │       ├── tabs.tsx                  # Accessible tab list, triggers, and tab contents
│   │       └── textarea.tsx              # Multi-line text input component
│   ├── data/
│   │   └── mockData.ts                   # Seeded assignment records and CS101 student roster
│   ├── hooks/
│   │   └── useNavigationLock.ts          # History API capture-phase browser navigation lock hook
│   ├── lib/
│   │   ├── assignmentScope.ts            # Cohort scoping engine, progress calculations, synchronization
│   │   └── utils.ts                      # Class merging utility function (cn)
│   ├── pages/                            # Top-level page route views
│   │   ├── admin/                        # Faculty page views
│   │   │   ├── AdminDashboardPage.tsx      # Overview of active assignments & submission metrics
│   │   │   ├── CreateAssignmentPage.tsx    # Multi-section assignment authoring workflow
│   │   │   └── EditAssignmentPage.tsx      # Assignment parameter & cohort editing workflow
│   │   ├── Auth/                         # Authentication views & definitions
│   │   │   ├── authAccounts.ts             # Seeded accounts & account-to-student resolution
│   │   │   └── LoginPage.tsx               # Role toggle, profile list, and login transition
│   │   └── student/                      # Student portal views
│   │       ├── AssignmentDetailsPage.tsx   # Directives, Google Drive link, submission action
│   │       └── StudentDashboardPage.tsx    # Deliverables stream, filter strip, cadence telemetry
│   ├── types/
│   │   └── index.ts                      # Core TypeScript interfaces (Assignment, RosterStudent, etc.)
│   ├── App.tsx                           # Root route definitions, global state, persistence
│   ├── index.css                         # Tailwind CSS v4 directives, design tokens, typography
│   └── main.tsx                          # Application bootstrap and BrowserRouter mount
├── components.json                       # shadcn UI CLI configuration
├── eslint.config.js                      # ESLint flat configuration file
├── index.html                            # HTML entry template and web font imports
├── package.json                          # Project dependencies, scripts, and metadata
├── package-lock.json                     # Dependency lockfile
├── tsconfig.json                         # Root TypeScript project references
├── tsconfig.app.json                     # Application TypeScript compiler configuration
├── tsconfig.node.json                    # Node/Vite build tool TypeScript configuration
└── vite.config.ts                        # Vite bundler, path aliases, and plugin setup
```

---

## Component Architecture

### Application Bootstrap & Layouts

```text
index.html
  └── main.tsx (React 19 createRoot + StrictMode + BrowserRouter)
        └── App.tsx (Global State, Routing, Route Guards, Navigation Lock)
              ├── /login ────────────────────────> LoginPage
              ├── /assignments ──────────────────> AdminLayout ──> AdminDashboardPage
              ├── /new-assignment ───────────────> AdminLayout ──> CreateAssignmentPage
              ├── /edit/:assignmentId ───────────> AdminLayout ──> EditAssignmentPage
              ├── /student/dashboard ────────────> StudentLayout ─> StudentDashboardPage
              └── /student/assignments/:id ──────> StudentLayout ─> AssignmentDetailsPage
```

1. **State Ownership (`App.tsx`):**
   - Holds `currentUser` (`UserAccount | null`), initialized from `localStorage`.
   - Computes `currentStudent` using `resolveStudentForAccount(currentUser, mockRoster)`.
   - Holds `assignments` (`Assignment[]`), initialized from `localStorage` or `initialAssignments`.
   - Subscribes an auto-sync `useEffect` that writes updated assignments to `localStorage` on any modification.
2. **Strict Route Guards:**
   - Unauthenticated users trying to reach `/assignments` or `/student/dashboard` are redirected to `/login`.
   - Authenticated users attempting to visit `/login` are automatically redirected to their role dashboard.
   - Cross-role navigation is rejected: an Admin cannot load `/student/*` and a Student cannot load `/assignments` or `/new-assignment`.
3. **Session Navigation Lock (`useNavigationLock`):**
   - Intercepts browser Back/Forward navigation (`popstate`) at capture phase, re-arming the history stack so the active view never unmounts unexpectedly.

---

### Student Workflow Data Flow

```text
[Login Page]
     │
     ▼ (Select Student Profile: Alex Doe #STU-4819)
[App.tsx] ──> Resolves Student Roster Record #6
     │
     ▼
[StudentLayout]
     │
     ├──> [StudentDashboardPage]
     │         │
     │         ├── Computes personal completion telemetry (Submitted, Pending, Overdue)
     │         ├── Filters assignments via `isAssignmentAssignedToStudent`
     │         └── Applies live search & category filter (All, Pending, Submitted, Archived)
     │
     ▼ (Click "Open Assignment & Submit")
[AssignmentDetailsPage]
     │
     ├── Renders assignment description, cutoff deadline, instructor details
     ├── Displays external Google Drive repository URL & folder naming protocol
     │
     ▼ (Click "✓ Yes, I Have Submitted")
[SubmissionConfirmModal]
     │
     ▼ (User confirms submission)
[App.tsx] `handleSubmitAssignment`
     │
     ├── Updates submission status to "Submitted" with localized timestamp
     ├── `synchronizeAssignment` recalculates completion stats & scoped lists
     └── Writes updated state to `localStorage`
```

---

### Admin Workflow Data Flow

```text
[Login Page]
     │
     ▼ (Select Faculty Profile: Prof. Sarah Jenkins #FAC-08821)
[App.tsx] ──> Role: "admin"
     │
     ▼
[AdminLayout]
     │
     ├──> [AdminDashboardPage]
     │         │
     │         └── Renders list of `AssignmentCard` components
     │                  ├── Computes completion percentage & pending count
     │                  ├── Renders paginated student submission verification table
     │                  └── Provides Copy Drive, Edit, and Delete actions
     │
     ├──> [CreateAssignmentPage] (`/new-assignment`)
     │         │
     │         ├── Drafts directives, deadline, Drive repository link
     │         ├── `RosterSelectionTable`: Chooses Option A (All) or Option B (Selective Cohort)
     │         │         └── Fine-grained student selection with search & select-all
     │         │
     │         ▼ (Click "Publish Assignment")
     │    `handleCreateAssignment` in `App.tsx` synchronizes & prepends assignment
     │
     └──> [EditAssignmentPage] (`/edit/:assignmentId`)
               │
               ├── Loads existing assignment parameters
               ├── Updates cohort assignment, due dates, or repository links
               └── `handleUpdateAssignment` in `App.tsx` updates assignment state
```

---

## Data Storage & Persistence

The application relies on browser **`localStorage`** for client-side state persistence:

| Storage Key | Data Structure | Responsibility |
| :--- | :--- | :--- |
| `joineazy_auth_user` | `UserAccount` object | Stores the currently authenticated user's ID, role, display name, and roster linkage. Cleared upon logout. |
| `joineazy_assignments` | Array of `Assignment` objects | Stores the complete state of all course assignments, including titles, descriptions, deadlines, cohort types, assigned student ID arrays, and individual student submission records. |

### Persistence Lifecycle

1. **Initial Bootstrap:** On application startup, `App.tsx` reads `joineazy_assignments` from `localStorage`. If absent or corrupted, it falls back to `initialAssignments` in `mockData.ts`.
2. **Normalization & Synchronization:** Loaded assignments are passed through `synchronizeAssignment`, ensuring student counts, submission statuses, and cohort badge labels are strictly synchronized with `mockRoster`.
3. **Reactive Write-back:** Whenever an assignment is created, edited, deleted, or submitted, a `useEffect` in `App.tsx` updates `localStorage`.
4. **Refresh Safety:** Refreshing the browser preserves the active session, current URL, and all modifications made to assignments or submissions.

> **Important:** `localStorage` is purely client-side browser storage. Data does not synchronize across different browsers, private windows, or external devices. Clearing browser site data will restore the default seeded assignments.

---

## Key Design Decisions

1. **Client-Side Mock Authentication:**
   - Rather than requiring a backend authentication server, the project uses a seeded profile selector. This allows immediate, credential-free demonstration of both Student and Faculty personas.
2. **Deterministic Account-to-Roster Linkage:**
   - Student user accounts contain a `rosterStudentId` property that resolves to a record in `mockRoster` via `resolveStudentForAccount`. This decouples authentication entities from roster records while ensuring referential integrity.
3. **Cohort Scoping Engine (`src/lib/assignmentScope.ts`):**
   - Assignment visibility and completion metrics are determined by a dedicated scoping module. Assignments configured as `all` dynamically assign all 28 enrolled students; assignments marked as `selected` restrict access strictly to student IDs listed in `assignedStudentIds`.
4. **Historical Submissions Preservation:**
   - When an instructor edits an assignment's cohort scope, `synchronizeAssignment` preserves submission records from students who were previously assigned, preventing accidental data loss if a student is temporarily unassigned and re-assigned.
5. **Strict Session Navigation Lock (`src/hooks/useNavigationLock.ts`):**
   - To satisfy strict academic session requirements, browser Back and Forward navigation events are intercepted at the window capture phase (`popstate`). This keeps users anchored to their active page while permitting seamless in-app navigation via links and buttons.
6. **Accessible UI Architecture with shadcn / Base UI:**
   - Built with unstyled `@base-ui/react` primitives and Tailwind CSS v4 design tokens to guarantee accessible keyboard navigation, ARIA semantics, and consistent styling without large component library overhead.

---

## Current Limitations

To provide transparent technical documentation, the following limitations reflect the actual state of the codebase:

- **No Remote Backend or Cloud Database:** State is persisted solely in the local browser's `localStorage`.
- **Mock Authentication:** Authentication is client-side only; passwords and authorization tokens (JWT/OAuth) are not implemented.
- **Simulated File Submission:** The application does not upload binary files to a server; students submit deliverables by uploading files to a specified Google Drive directory and confirming submission in the app.
- **Simulated Archive & Gradebook Buttons:** The "Download Archive" and "View Gradebook" buttons on graded faculty cards trigger alert dialogs rather than downloading ZIP files or launching an external gradebook interface.
- **Automated Test Suite:** There are currently no automated unit or end-to-end test suites (e.g., Vitest, Jest, Playwright) configured in the repository. Build integrity is verified via `tsc -b` and ESLint.

---

## Available Scripts

The following scripts are defined in `package.json`:

| Command | Action | Description |
| :--- | :--- | :--- |
| `npm run dev` | `vite` | Starts the local Vite development server with Hot Module Replacement (HMR) at `http://localhost:5173/`. |
| `npm run build` | `tsc -b && vite build` | Runs the TypeScript project compiler in build mode, then generates an optimized production bundle in `dist/`. |
| `npm run lint` | `eslint .` | Runs ESLint across all `.ts` and `.tsx` source files to verify linting and formatting rules. |
| `npm run preview` | `vite preview` | Boots a local web server to preview the compiled production build from `dist/`. |

---

## Project Status

- **Status:** Complete Frontend Demo & Internship Assignment Implementation.
- **Build Status:** Passing (`tsc -b` compiles with 0 errors; ESLint passes with 0 warnings; production bundle built cleanly).
- **Responsive Verification:** Tested and fully responsive across small mobile (320px), mobile (375px–430px), tablet (768px–1024px), and desktop (1280px–1536px+) viewports.
