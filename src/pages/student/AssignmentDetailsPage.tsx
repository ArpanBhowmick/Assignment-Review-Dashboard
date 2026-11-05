import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Assignment, RosterStudent } from '../../types';
import { SubmissionConfirmModal } from '../../components/student/SubmissionConfirmModal';
import {
  getStudentSubmission,
  getStudentAssignmentStatus,
  getStudentFolderFormat,
  createSubmissionTimestamp,
} from '../../components/student/studentUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface AssignmentDetailsPageProps {
  assignments: Assignment[];
  currentStudent: RosterStudent;
  onSubmitAssignment: (assignmentId: string, timestamp: string) => void;
}

export const AssignmentDetailsPage: React.FC<AssignmentDetailsPageProps> = ({
  assignments,
  currentStudent,
  onSubmitAssignment,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const assignment = assignments.find((a) => a.id === id);

  // If assignment is not found
  if (!assignment) {
    return (
      <div className="max-w-3xl mx-auto py-space-xl text-center">
        <span className="material-symbols-outlined text-[48px] text-error mb-2">
          error_outline
        </span>
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">
          Assignment Not Found
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">
          The requested assignment spec could not be found or has been archived from CS101 registry.
        </p>
        <Link
          to="/student/dashboard"
          className="inline-flex items-center gap-2 px-space-md py-2 bg-primary text-on-primary font-label-code text-label-code uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Return to Student Dashboard</span>
        </Link>
      </div>
    );
  }

  const studentSubmission = getStudentSubmission(assignment, currentStudent);
  const rawStatus = getStudentAssignmentStatus(assignment, currentStudent);
  const isSubmitted = rawStatus === 'submitted' || justSubmitted;
  const isOverdue = rawStatus === 'overdue';

  const subfolderStandard = getStudentFolderFormat(currentStudent);
  const submissionTimestamp = studentSubmission?.timestamp || 'Official Registration Verified';

  // Derived status configuration for badges
  const statusConfig = isSubmitted
    ? {
        cardLabel: `● SUBMITTED (${submissionTimestamp})`,
        navLabel: 'Submitted',
        badgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
        dotClass: 'bg-on-tertiary-container',
      }
    : isOverdue
    ? {
        cardLabel: '[PAST DEADLINE]',
        navLabel: 'Past Deadline',
        badgeClass: 'bg-error-container text-on-error-container',
        dotClass: 'bg-error',
      }
    : {
        cardLabel: '[PENDING SUBMISSION]',
        navLabel: 'Pending Submission',
        badgeClass: 'bg-secondary-fixed text-on-secondary-fixed-variant',
        dotClass: 'bg-secondary animate-pulse',
      };

  const handleConfirmSubmit = () => {
    const timestamp = createSubmissionTimestamp();
    onSubmitAssignment(assignment.id, timestamp);
    setJustSubmitted(true);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-space-lg py-space-lg pb-space-xl">
      {/* Back Bar & Status Header Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pt-space-xs pb-space-xs border-b border-surface-dim">
        <Link
          to="/student/dashboard"
          className="inline-flex items-center gap-space-xs font-label-mono-xs text-label-mono-xs uppercase text-secondary hover:text-on-surface transition-colors font-semibold tracking-wider cursor-pointer"
        >
          <span className="material-symbols-outlined text-[15px]">arrow_back</span>
          <span>Return to Student Dashboard</span>
        </Link>
        <div className="flex items-center gap-space-xs font-label-mono-xs text-label-mono-xs">
          <span className="text-on-surface-variant uppercase font-medium">Status:</span>
          <Badge
            className={`inline-flex items-center gap-1.5 px-space-xs py-0.5 rounded-DEFAULT font-label-code text-label-code uppercase font-semibold border-0 h-auto ${statusConfig.badgeClass}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass}`} />
            <span>{statusConfig.navLabel}</span>
          </Badge>
        </div>
      </div>

      {/* Page Title Header */}
      <div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mb-1">
          Assignment Details &amp; Submission
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Review assignment instructions, submit your work to the designated Google Drive folder, and confirm submission.
        </p>
      </div>

      {/* Success Banner (Displayed when Submitted) */}
      {isSubmitted && (
        <div
          role="alert"
          className="p-space-md bg-tertiary-fixed text-on-tertiary-fixed-variant border border-on-tertiary-container rounded-DEFAULT flex items-center gap-space-sm animate-in fade-in slide-in-from-top-2"
        >
          <span className="material-symbols-outlined text-[20px] text-on-tertiary-container">
            check_circle
          </span>
          <div className="flex-1 text-body-sm font-medium">
            <span className="font-semibold block text-on-surface">
              Your submission has been recorded successfully.
            </span>
            <span className="text-on-surface-variant font-label-mono-xs uppercase">
              Official timestamp registered with Academic Course Registry: {submissionTimestamp}
            </span>
          </div>
        </div>
      )}

      {/* CARD 1: Assignment Information */}
      <section className="bg-surface-container-lowest p-space-lg rounded-DEFAULT border border-surface-dim">
        <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-sm pb-space-sm border-b border-surface-dim">
          <div className="flex items-center gap-space-xs">
            <Badge className="font-label-code text-label-code px-space-xs py-0.5 bg-primary text-on-primary rounded-DEFAULT uppercase font-semibold border-0 h-auto">
              {assignment.code}
            </Badge>
            <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase tracking-wider font-semibold">
              Core Course Requirement
            </span>
          </div>
          <Badge
            className={`inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-DEFAULT font-label-code text-label-code uppercase font-semibold border-0 h-auto ${statusConfig.badgeClass}`}
          >
            <span className={`w-2 h-2 rounded-full ${statusConfig.dotClass}`} />
            <span>{statusConfig.cardLabel}</span>
          </Badge>
        </div>

        <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight mb-space-md">
          {assignment.title}
        </h2>

        {/* Due Date & Meta Bar */}
        <div className="bg-surface-container-low p-space-md rounded-DEFAULT mb-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-[20px] text-secondary">
              event
            </span>
            <div>
              <span className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant block font-medium">
                Cutoff Due Date
              </span>
              <div className="font-body-md text-body-md font-semibold text-on-surface">
                {assignment.deadlineDisplay}
              </div>
            </div>
          </div>
          <Badge
            className={`inline-flex items-center self-start sm:self-center px-2 py-1 rounded-DEFAULT font-label-code text-label-code uppercase font-bold tracking-wider border-0 h-auto ${
              isSubmitted
                ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                : isOverdue
                ? 'bg-error-container text-on-error-container'
                : 'bg-secondary-container text-on-secondary'
            }`}
          >
            {isSubmitted
              ? 'Submission Verified'
              : isOverdue
              ? 'Deadline Passed'
              : assignment.dueStatusBadge || 'Due in 2 days'}
          </Badge>
        </div>

        {/* Description */}
        <div className="mb-space-md">
          <h3 className="font-label-mono-xs text-label-mono-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-space-xs">
            Assignment Description
          </h3>
          <p className="font-body-md text-body-md text-on-surface leading-relaxed bg-surface-container-low p-space-md rounded-DEFAULT">
            {assignment.description}
          </p>
        </div>

        {/* Instructor Footer */}
        <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm pt-space-xs">
          <span className="material-symbols-outlined text-[16px]">school</span>
          <span>
            {assignment.instructor || 'Prof. Sarah Jenkins'} • Dept. of Computer Science
          </span>
        </div>
      </section>

      {/* CARD 2: External Submission Repository (Google Drive) */}
      <section className="bg-surface-container-lowest p-space-lg rounded-DEFAULT border border-surface-dim">
        <div className="flex items-center gap-space-xs mb-space-xs">
          <span className="material-symbols-outlined text-[20px] text-secondary">
            cloud_upload
          </span>
          <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">
            Submission Repository (Google Drive)
          </h2>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
          Upload your completed deliverables (compiled PDF and source code archive) to your assigned subfolder in the Google Drive folder linked below.
        </p>

        {/* Drive Link Input & Action Box */}
        <div className="bg-surface-container-low p-space-md rounded-DEFAULT">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm">
            <div className="flex-1 bg-surface-container-lowest border border-surface-dim px-space-md py-2.5 rounded-DEFAULT font-label-code text-label-code text-on-surface truncate flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-outline">
                folder_shared
              </span>
              <span className="truncate">{assignment.driveUrl}</span>
            </div>
            <a
              href={assignment.driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-space-md py-2.5 bg-surface-container-highest hover:bg-surface-container text-on-surface font-label-code text-label-code rounded-DEFAULT font-semibold uppercase flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer text-decoration-none"
            >
              <span>Open Google Drive Folder</span>
              <span className="material-symbols-outlined text-[15px]">open_in_new</span>
            </a>
          </div>
          <div className="flex items-center gap-1.5 text-on-surface-variant font-label-mono-xs text-label-mono-xs mt-space-sm">
            <span className="material-symbols-outlined text-[14px] text-outline">
              info
            </span>
            <span>
              Subfolder naming standard:{' '}
              <strong className="font-semibold text-on-surface">{subfolderStandard}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* CARD 3: Finalize & Confirm Submission Action */}
      <section className="bg-surface-container-lowest p-space-lg rounded-DEFAULT border border-surface-dim">
        <div className="flex items-center gap-space-xs mb-space-xs">
          <span className="material-symbols-outlined text-[20px] text-primary">
            task_alt
          </span>
          <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">
            Confirm Submission
          </h2>
        </div>

        {!isSubmitted ? (
          <>
            <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">
              Once you have uploaded your files to the Google Drive folder, click the button below to mark this assignment as submitted.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-md">
              <Button
                type="button"
                variant="default"
                onClick={() => setIsModalOpen(true)}
                disabled={isOverdue}
                className="flex-1 bg-black hover:bg-slate-800 text-white py-3 px-space-lg rounded-DEFAULT font-label-code text-label-code uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm font-semibold active:scale-[0.99] cursor-pointer border-0 disabled:opacity-50 h-auto"
              >
                <span className="material-symbols-outlined text-[18px] text-white">check_circle</span>
                <span className="text-white">✓ Yes, I Have Submitted</span>
              </Button>
              <Link
                to="/student/dashboard"
                className="py-3 px-space-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-code text-label-code font-semibold uppercase rounded-DEFAULT text-center transition-colors cursor-pointer"
              >
                Cancel &amp; Return
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">
              Your submission has been recorded on {submissionTimestamp}. You can review your files directly in the Drive folder.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-md">
              <div className="flex-1 bg-surface-container-low p-space-md rounded-DEFAULT flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[20px] text-on-tertiary-container">
                    verified
                  </span>
                  <span className="font-label-code text-label-code text-on-surface font-semibold uppercase">
                    Submitted on {submissionTimestamp}
                  </span>
                </div>
                <a
                  href={assignment.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-space-md py-2 bg-surface-container-highest hover:bg-surface-container text-on-surface font-label-code text-label-code uppercase font-semibold rounded-DEFAULT flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-decoration-none"
                >
                  <span>View Drive Folder</span>
                  <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                </a>
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/student/dashboard')}
                className="py-3 px-space-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-code text-label-code font-semibold uppercase rounded-DEFAULT text-center transition-colors cursor-pointer border-0 h-auto shadow-none"
              >
                Return to Dashboard
              </Button>
            </div>
          </>
        )}
      </section>

      {/* Two-step Submission Confirmation Modal */}
      <SubmissionConfirmModal
        isOpen={isModalOpen}
        assignmentTitle={assignment.title}
        assignmentCode={assignment.code}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSubmit}
      />
    </div>
  );
};

export default AssignmentDetailsPage;
