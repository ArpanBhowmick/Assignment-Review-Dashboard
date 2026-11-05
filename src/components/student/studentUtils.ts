import type { Assignment, RosterStudent, StudentSubmission } from '../../types';
import { findSubmissionForStudent } from '../../lib/assignmentScope';

export type StudentStatus = 'submitted' | 'overdue' | 'pending';

/**
 * Finds the submission record for a given student in an assignment.
 */
export function getStudentSubmission(
  assignment: Assignment,
  student: RosterStudent
): StudentSubmission | undefined {
  return findSubmissionForStudent(assignment.submissions, student);
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

  return assignment.assignedStudentIds.includes(student.id);
}

/**
 * Determines the assignment status relative to a student.
 */
export function getStudentAssignmentStatus(
  assignment: Assignment,
  student: RosterStudent
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
