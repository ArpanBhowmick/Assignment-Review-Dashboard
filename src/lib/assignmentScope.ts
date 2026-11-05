import type { Assignment, RosterStudent, StudentSubmission } from '../types';

const SUBMISSION_ID_PATTERN = /^sub-([^-]+)(?:-|$)/;

export interface AssignmentSummary {
  assignedStudents: RosterStudent[];
  activeSubmissions: StudentSubmission[];
  totalStudents: number;
  submittedCount: number;
  pendingCount: number;
  percentComplete: number;
}

export interface AssignmentScope {
  assignedStudents: RosterStudent[];
  activeSubmissions: StudentSubmission[];
}

export const getSubmissionStudentId = (
  submission: StudentSubmission
): string | null => {
  const match = SUBMISSION_ID_PATTERN.exec(submission.id);
  return match?.[1] ?? null;
};

export const getScopedStudents = (
  cohortType: Assignment['cohortType'],
  assignedStudentIds: string[],
  roster: RosterStudent[]
): RosterStudent[] => {
  const rosterById = new Map<string, RosterStudent>();
  roster.forEach((student) => {
    if (!rosterById.has(student.id)) {
      rosterById.set(student.id, student);
    }
  });

  if (cohortType === 'all') {
    return Array.from(rosterById.values());
  }

  const seenIds = new Set<string>();
  const assignedStudents: RosterStudent[] = [];

  assignedStudentIds.forEach((studentId) => {
    if (seenIds.has(studentId)) return;
    seenIds.add(studentId);

    const student = rosterById.get(studentId);
    if (student) {
      assignedStudents.push(student);
    }
  });

  return assignedStudents;
};

export const findSubmissionForStudent = (
  submissions: StudentSubmission[],
  student: RosterStudent
): StudentSubmission | undefined => {
  const rosterIdMatch = submissions.find(
    (submission) => getSubmissionStudentId(submission) === student.id
  );

  if (rosterIdMatch) {
    return rosterIdMatch;
  }

  return submissions.find(
    (submission) => submission.studentId === student.studentId
  );
};

const createEmptySubmission = (
  student: RosterStudent
): StudentSubmission => ({
  id: `sub-${student.id}`,
  name: student.name,
  studentId: student.studentId,
  status: 'Not Submitted',
  timestamp: 'Awaiting Student Push',
});

const getActiveSubmissions = (
  submissions: StudentSubmission[],
  assignedStudents: RosterStudent[]
): StudentSubmission[] =>
  assignedStudents.map(
    (student) =>
      findSubmissionForStudent(submissions, student) ??
      createEmptySubmission(student)
  );

export const getAssignmentSummary = (
  assignment: Assignment,
  roster: RosterStudent[]
): AssignmentSummary => {
  const assignedStudents = getScopedStudents(
    assignment.cohortType,
    assignment.assignedStudentIds,
    roster
  );
  const activeSubmissions = getActiveSubmissions(
    assignment.submissions,
    assignedStudents
  );
  const totalStudents = assignedStudents.length;
  const submittedCount = activeSubmissions.filter(
    (submission) => submission.status === 'Submitted'
  ).length;
  const pendingCount = Math.max(0, totalStudents - submittedCount);
  const percentComplete =
    totalStudents === 0
      ? 0
      : Math.min(
          100,
          Math.max(0, Math.round((submittedCount / totalStudents) * 100))
        );

  return {
    assignedStudents,
    activeSubmissions,
    totalStudents,
    submittedCount,
    pendingCount,
    percentComplete,
  };
};

export const getAssignmentScope = (
  assignment: Assignment,
  roster: RosterStudent[]
): AssignmentScope => {
  const assignedStudents = getScopedStudents(
    assignment.cohortType,
    assignment.assignedStudentIds,
    roster
  );

  return {
    assignedStudents,
    activeSubmissions: getActiveSubmissions(
      assignment.submissions,
      assignedStudents
    ),
  };
};

export const getCohortBadgeText = (
  cohortType: Assignment['cohortType'],
  assignedStudentCount: number,
  existingBadgeText?: string
): string | undefined => {
  if (cohortType === 'selected') {
    return `Restricted Cohort (${assignedStudentCount} Students)`;
  }

  return existingBadgeText
    ? `General Cohort (${assignedStudentCount} Students)`
    : undefined;
};

export const synchronizeAssignment = (
  assignment: Assignment,
  roster: RosterStudent[]
): Assignment => {
  const { assignedStudents, activeSubmissions } = getAssignmentScope(
    assignment,
    roster
  );
  const assignedStudentIdSet = new Set(
    assignedStudents.map((student) => student.id)
  );
  const assignedStudentIds = new Set(
    assignedStudents.map((student) => student.studentId)
  );
  const activeSubmissionSet = new Set(activeSubmissions);
  const historicalSubmissions = assignment.submissions.filter((submission) => {
    if (activeSubmissionSet.has(submission)) {
      return false;
    }

    const rosterStudentId = getSubmissionStudentId(submission);

    if (rosterStudentId !== null) {
      return !assignedStudentIdSet.has(rosterStudentId);
    }

    return !assignedStudentIds.has(submission.studentId);
  });
  const submissions = [...activeSubmissions, ...historicalSubmissions];
  const submittedCount = activeSubmissions.filter(
    (submission) => submission.status === 'Submitted'
  ).length;

  return {
    ...assignment,
    cohortBadgeText: getCohortBadgeText(
      assignment.cohortType,
      assignedStudents.length,
      assignment.cohortBadgeText
    ),
    totalStudents: assignedStudents.length,
    submittedCount,
    assignedStudentIds: assignedStudents.map((student) => student.id),
    submissions,
  };
};
