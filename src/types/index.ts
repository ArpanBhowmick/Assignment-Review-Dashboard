export interface StudentSubmission {
  id: string;
  name: string;
  studentId: string;
  status: 'Submitted' | 'Not Submitted';
  timestamp: string;
  driveRecordUrl?: string;
}

export interface RosterStudent {
  id: string;
  name: string;
  studentId: string;
  section: string;
  standing: string;
  isHonors?: boolean;
}

export interface Assignment {
  id: string;
  code: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  deadlineDisplay: string;
  dueStatusBadge?: string;
  dueStatusType?: 'urgent' | 'normal' | 'closed';
  driveUrl: string;
  isGraded?: boolean;
  cohortType: 'all' | 'selected';
  cohortBadgeText?: string;
  totalStudents: number;
  submittedCount: number;
  classMean?: string;
  classMedian?: string;
  assignedStudentIds: string[];
  submissions: StudentSubmission[];
  tag?: string;
  dueUrgencyText?: string;
  instructor?: string;
  score?: string;
  verificationHash?: string;
  auditArchive?: string;
  isOverdue?: boolean;
}
