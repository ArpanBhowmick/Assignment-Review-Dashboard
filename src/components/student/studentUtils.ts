import type { Assignment, RosterStudent, StudentSubmission } from '../../types';

export type StudentStatus = 'submitted' | 'overdue' | 'pending';

type StudentReference =
  | RosterStudent
  | { id: string; studentId?: string; name?: string };

/**
 * Finds the submission record for a given student in an assignment.
 */
export function getStudentSubmission(
  assignment: Assignment,
  student: StudentReference
): StudentSubmission | undefined {
  return assignment.submissions.find(
    (submission) =>
      (student.studentId && submission.studentId === student.studentId) ||
      submission.id === `sub-${student.id}` ||
      (student.name && submission.name === student.name)
  );
}

/**
 * Determines whether an assignment is assigned to the given student.
 */
export function isAssignmentAssignedToStudent(
  assignment: Assignment,
  student: RosterStudent
): boolean {
  if (assignment.cohortType === 'all') {
    return true;
  }

  const isExplicitlyAssigned = assignment.assignedStudentIds.includes(student.id);
  const hasExistingSubmission = assignment.submissions.some(
    (submission) =>
      submission.studentId === student.studentId ||
      submission.name === student.name
  );

  return isExplicitlyAssigned || hasExistingSubmission;
}

/**
 * Determines the assignment status relative to a student.
 */
export function getStudentAssignmentStatus(
  assignment: Assignment,
  student: StudentReference
): StudentStatus {
  const submission = getStudentSubmission(assignment, student);
  if (submission?.status === 'Submitted') {
    return 'submitted';
  }
  if (assignment.isOverdue) {
    return 'overdue';
  }
  return 'pending';
}

/**
 * Formats a clean standard folder token: e.g. [STU-4819_DOE_ALEX]
 */
export function getStudentFolderFormat(student: RosterStudent): string {
  const cleanId = student.studentId.replace('#', '');
  const cleanName = student.name.toUpperCase().replace(/\s+/g, '_');
  return `[${cleanId}_${cleanName}]`;
}

/**
 * Generates an official submission timestamp string.
 */
export function createSubmissionTimestamp(date = new Date()): string {
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${formattedDate} at ${formattedTime}`;
}
