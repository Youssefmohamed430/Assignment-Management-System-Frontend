---
name: Frontend Sync — Assignment Status Workflow & Dashboards
overview: Implementation plan for the Angular frontend to consume the latest backend commit (AddAssignmentStatusAndDashboards migration) — assignment lifecycle states, submission status/attempt tracking, instructor feedback, and the new Student/Instructor dashboard endpoints.
source_commit: 20261007175353_AddAssignmentStatusAndDashboards (+ 20261008024750_UpdataData, no-op)
backend_repo: Assignment -Management-System
frontend_repo: Assignment-Management-System-Frontend
---

# Frontend Implementation Plan — Assignment Status & Dashboards

## 0. Context

The latest backend commit adds an **assignment lifecycle** (Draft → Published → Closed/Archived), **submission status tracking** (late/resubmission/grading state), **per-submission instructor feedback**, and two new **dashboard endpoints** (Student + Instructor). It also fixes `DeadLine` from `DateOnly` to `DateTime`.

None of the existing routes were removed; several were extended (new optional fields) and three new `PATCH` routes plus one new `PUT` route were added, along with two new `GET dashboard` routes.

**JSON casing note:** ASP.NET Core's default `System.Text.Json` serializer returns **camelCase** property names (no custom naming policy is configured in `Program.cs`), so all payloads below are written in camelCase as the frontend will actually receive/send them.

---

## 1. New Enums (mirror as TypeScript enums)

```ts
// src/app/Models/enums.ts
export enum AssignmentStatus {
  Draft = 0,
  Published = 1,
  Closed = 2,
  Archived = 3
}

export enum SubmissionStatus {
  Pending = 0,
  Graded = 1,
  Late = 2,
  Resubmitted = 3
}
```

---

## 2. Updated DTOs (extend existing TS interfaces)

### `AssignmentDTO` — add fields
```ts
export interface AssignmentDTO {
  assignmentId?: number;
  title: string;
  crsName?: string;
  crsId?: number;
  deadLine: string;        // ISO datetime now (was date-only)
  file?: File;              // create only, multipart
  fileName?: string;
  status?: AssignmentStatus;    // NEW — optional on create (defaults Published), returned always on read
  publishedAt?: string | null;  // NEW
  closedAt?: string | null;     // NEW
}
```

### `SubmitDTO` — add fields
```ts
export interface SubmitDTO {
  file?: File;
  fileName?: string;
  assignmentId: number;
  assignmentTitle?: string;
  grade?: number | null;
  stuname?: string;
  submissionId?: number;
  attemptNumber: number;        // NEW — 1-based, increments per resubmission
  submitedAt: string;           // NEW
  feedback?: string;            // NEW — instructor-set
  isLate: boolean;              // NEW
  status: SubmissionStatus;     // NEW
}
```

### New DTOs to add

```ts
// Instructor dashboard
export interface InstructorRecentActivityDto {
  activityType: string;   // "Submission" | "DeadlineApproaching" | "Notification"
  description: string;
  timestamp: string;
}
export interface InstructorDashboardDto {
  myCourses: number;
  totalStudents: number;
  pendingSubmissions: number;
  totalAssignments: number;
  averageCourseGrade: number;
  lateSubmissions: number;
  recentActivity: InstructorRecentActivityDto[];
}

// Student dashboard
export interface UpcomingAssignmentDto {
  assignmentId: number;
  title: string;
  courseId: number;
  courseName: string;
  deadline: string;
  remainingTime: string;   // pre-formatted string, e.g. "2 days 5 hours"
  status: string;          // "Pending" | "Submitted" | "Graded"
}
export interface RecentGradeDto {
  assignmentId: number;
  assignmentTitle: string;
  courseId: number;
  courseName: string;
  grade: number;
  gradedAt: string | null;
}
export interface StudentDashboardDto {
  myCourses: number;
  pendingAssignments: number;
  dueTomorrow: number;
  averageGrade: number;
  upcomingDeadlines: UpcomingAssignmentDto[];
  recentGrades: RecentGradeDto[];
}
```

---

## 3. New API Endpoints

### 3.1 `GET /api/Instructor/dashboard`
- **Auth:** `Instructor`
- **Response:** `ResponseModel<InstructorDashboardDto>`
- **Use:** instructor landing/dashboard page — course count, total students, pending grading count, average grade, late-submission count, 10-item merged activity feed (recent submissions, upcoming deadlines ≤3 days, recent notifications).
- **Empty state:** backend returns `IsSuccess: true` with zeroed/empty dashboard when instructor has no courses — do not treat this as an error.

### 3.2 `GET /api/Student/dashboard`
- **Auth:** `Student`
- **Response:** `ResponseModel<StudentDashboardDto>`
- **Use:** student landing/dashboard page — enrolled course count, pending assignment count, due-tomorrow count, average grade, next 10 upcoming deadlines, last 5 graded submissions.
- **Empty state:** same as above — zeroed dashboard with `IsSuccess: true` for students with no enrollments.

### 3.3 `PATCH /api/Instructor/assignments/{id}/publish`
- **Auth:** `Instructor`
- **Path param:** `id` (assignment id)
- **Response:** `ResponseModel<AssignmentDTO>`
- **Behavior:** Draft → Published. Sets `publishedAt`, triggers student notifications for the course. Fails (`BadRequest`) if assignment not found, caller isn't the course's instructor, or it's already Published.

### 3.4 `PATCH /api/Instructor/assignments/{id}/close`
- **Auth:** `Instructor`
- **Path param:** `id`
- **Response:** `ResponseModel<AssignmentDTO>`
- **Behavior:** → Closed. Sets `closedAt`. Once closed, students can no longer submit/resubmit.

### 3.5 `PATCH /api/Instructor/assignments/{id}/archive`
- **Auth:** `Instructor`
- **Path param:** `id`
- **Response:** `ResponseModel<AssignmentDTO>`
- **Behavior:** → Archived. Archived assignments are excluded from the student-facing assignment list (`GET /api/Assignment/{crsid}`).

### 3.6 `PUT /api/Instructor/feedback/{submissionId}`
- **Auth:** `Instructor`
- **Path param:** `submissionId`
- **Body:** raw JSON string (not an object) — e.g. `"Good work, but check edge cases."` with `Content-Type: application/json`
- **Response:** `ResponseModel<string>`
- **Use:** separate from grading — lets instructor leave free-text feedback on a submission independent of the numeric grade.

---

## 4. Behavior Changes on Existing Endpoints

| Endpoint | Change |
|---|---|
| `POST /api/Instructor` (add assignment) | `status` in the form payload is now optional; omitted = `Published`. Deadline must be in the future or request is rejected. Notifications only fire if the resulting status is `Published` (i.e. not for Drafts). |
| `PUT /api/Assignment/{id}` (update assignment) | Body may now include `status`; if present it overwrites the current status (no transition validation performed here — only the dedicated publish/close/archive endpoints enforce lifecycle rules). |
| `GET /api/Assignment/{crsid}` (list by course) | Now **excludes** assignments with status `Draft` or `Archived`. Student-facing assignment lists will silently show fewer items than before if drafts/archives exist. |
| `GET /api/Assignment/ById/{id}` | Response now includes `status`, `publishedAt`, `closedAt`. |
| `POST /api/Submisision` (submit assignment) | Now rejects submission with a `400` + message if the assignment is `Draft`, `Closed`, or `Archived` (previously only deadline-agnostic). Computes `isLate` (deadline passed), `attemptNumber` (increments from the student's prior submissions to this assignment), and `status` (`Late` / `Pending` / `Resubmitted`). |
| `DeadLine` type (all assignment payloads) | Changed from date-only to full `DateTime`. Any date-only `<input type="date">` bound to deadline should move to a datetime picker, or at minimum send a full ISO datetime string. |

---

## 5. Frontend Implementation Tasks

### 5.1 Models
- [ ] Add `AssignmentStatus` and `SubmissionStatus` enums (`src/app/Models/enums.ts`).
- [ ] Extend `AssignmentDTO` with `status`, `publishedAt`, `closedAt`.
- [ ] Extend `SubmitDTO` with `attemptNumber`, `submitedAt`, `feedback`, `isLate`, `status`.
- [ ] Add `InstructorDashboardDto`, `InstructorRecentActivityDto`, `StudentDashboardDto`, `UpcomingAssignmentDto`, `RecentGradeDto`.

### 5.2 Services
**`instructor-service.ts`**
- [ ] `getDashboard(): Observable<ResponseModel<InstructorDashboardDto>>` → `GET /Instructor/dashboard`
- [ ] `publishAssignment(id: number)` → `PATCH /Instructor/assignments/${id}/publish`
- [ ] `closeAssignment(id: number)` → `PATCH /Instructor/assignments/${id}/close`
- [ ] `archiveAssignment(id: number)` → `PATCH /Instructor/assignments/${id}/archive`
- [ ] `setFeedback(submissionId: number, feedback: string)` → `PUT /Instructor/feedback/${submissionId}` with raw JSON string body (`JSON.stringify(feedback)` as the request body, not wrapped in an object)

**`student-service.ts`**
- [ ] `getDashboard(): Observable<ResponseModel<StudentDashboardDto>>` → `GET /Student/dashboard`

**`assignment-service.ts`**
- [ ] Allow `status` in create/update payloads (optional field).
- [ ] Update any deadline date-input binding to full datetime.

**`submisiion-service.ts`**
- [ ] No new endpoints, but surface the new `SubmitDTO` fields (`status`, `isLate`, `attemptNumber`, `feedback`) through existing calls — update the response-mapping/types only.

### 5.3 New Components
- [ ] **Instructor Dashboard** (`/Dashboard` or `/Instructor/Dashboard`) — stat cards for `myCourses`, `totalStudents`, `pendingSubmissions`, `totalAssignments`, `averageCourseGrade`, `lateSubmissions`; activity feed list rendering `recentActivity` (icon/style per `activityType`).
- [ ] **Student Dashboard** (`/Dashboard` or `/Student/Dashboard`) — stat cards for `myCourses`, `pendingAssignments`, `dueTomorrow`, `averageGrade`; `upcomingDeadlines` list (show `remainingTime`, `status` badge); `recentGrades` list.
- [ ] **Status badge** shared component — maps `AssignmentStatus`/`SubmissionStatus` enum values to a label + color (e.g. Draft=gray, Published=green, Closed=amber, Archived=dark gray; Pending=blue, Graded=green, Late=red, Resubmitted=purple).
- [ ] **Feedback editor** (small form/modal in `submissions` component) — textarea bound to `setFeedback`, separate from the existing grade input.

### 5.4 Existing Component Updates
- [ ] `add-assignment` — add a Status selector (Draft/Published) at creation time; default Published to preserve current behavior if omitted.
- [ ] `edit-assignment` — allow editing `status` directly, but prefer wiring the dedicated Publish/Close/Archive buttons on `assignment-details` over free-form status edits so lifecycle rules aren't bypassed.
- [ ] `assignment-details` — show status badge, `publishedAt`/`closedAt` when present; show Publish/Close/Archive action buttons conditionally based on current status and instructor ownership; disable/hide the student "Submit" action when status is not `Published`.
- [ ] `submit-assignment` — handle the new `400` rejection reasons (draft/closed/archived) with explicit error messages instead of a generic failure toast; show `attemptNumber` when resubmitting.
- [ ] `submissions` (instructor grading list) — display `status` badge (incl. Late), `isLate`, `attemptNumber`; add feedback entry/display alongside the grade input.
- [ ] `courses`/`assignment-details` lists consuming `GET /Assignment/{crsid}` — no code change required, but QA should confirm Draft/Archived assignments correctly disappear from student views.
- [ ] Any `<input type="date">` bound to `deadLine` — switch to a datetime-capable input or explicitly append a time component before sending.

### 5.5 Routing
- [ ] Add dashboard routes for both roles (or a single `/Dashboard` route that renders role-specific content based on the logged-in role).
- [ ] Point post-login redirect (per the existing frontend plan) to the new dashboard route instead of `/Courses`, if desired.

---

## 6. QA / Testing Checklist

- [ ] Create assignment as Draft → confirm it does **not** appear in student assignment list and does **not** trigger notifications.
- [ ] Publish a Draft assignment → confirm notifications fire and it now appears for enrolled students.
- [ ] Close an assignment → confirm student submission attempt is rejected with the correct error message.
- [ ] Archive an assignment → confirm it disappears from the student list but instructor can still view it directly by id.
- [ ] Submit after deadline → confirm `isLate: true` and `status: Late` are reflected in the UI.
- [ ] Resubmit → confirm `attemptNumber` increments and `status` shows `Resubmitted`.
- [ ] Set instructor feedback → confirm it's distinct from (and doesn't overwrite) the grade.
- [ ] Load Student Dashboard with zero enrollments → confirm a graceful empty state renders (`IsSuccess: true`, all-zero payload), not an error.
- [ ] Load Instructor Dashboard with zero courses → same empty-state check.
- [ ] Verify all new/changed JSON payloads are consumed in camelCase.

---

## 7. Out of Scope (unchanged by this commit)

- Auth, course CRUD/enrollment, notifications list, profile images — all unchanged.
- No new Admin-controller functionality (still empty).
- No resubmission-after-deadline override or assignment file replacement on edit.
