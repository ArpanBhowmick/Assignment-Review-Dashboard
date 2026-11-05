import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Assignment } from '../../types';
import { getStudentSubmission, getStudentAssignmentStatus } from './studentUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface StudentAssignmentCardProps {
  assignment: Assignment;
  currentStudentId: string;
}

export const StudentAssignmentCard: React.FC<StudentAssignmentCardProps> = ({
  assignment,
  currentStudentId,
}) => {
  const navigate = useNavigate();

  const studentSubmission = getStudentSubmission(assignment, {
    id: currentStudentId,
    studentId: '#STU-4819',
    name: 'Alex Doe',
  });

  const status = getStudentAssignmentStatus(assignment, {
    id: currentStudentId,
    studentId: '#STU-4819',
    name: 'Alex Doe',
  });

  const isSubmitted = status === 'submitted';
  const isOverdue = status === 'overdue';
  const isGraded = Boolean(assignment.isGraded);

  const handleOpenDetails = () => {
    navigate(`/student/assignments/${assignment.id}`);
  };

  return (
    <article className="bg-surface-container-lowest p-space-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-space-md">
        <div className="flex-1">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-space-xs mb-space-xs">
            <Badge
              className={`font-label-code text-label-code px-space-xs py-0.5 uppercase tracking-wider font-semibold rounded-none border-0 h-auto ${
                !isSubmitted && !isOverdue
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-high text-on-surface'
              }`}
            >
              {assignment.code}
            </Badge>

            {isOverdue && (
              <Badge className="font-label-mono-xs text-label-mono-xs bg-error-container text-on-error-container px-space-xs py-0.5 uppercase tracking-wider font-bold rounded-none border-0 h-auto">
                PAST DEADLINE
              </Badge>
            )}

            {!isSubmitted && !isOverdue && assignment.dueUrgencyText && (
              <Badge className="font-label-mono-xs text-label-mono-xs bg-secondary-fixed text-on-secondary-fixed-variant px-space-xs py-0.5 uppercase tracking-wider font-bold rounded-none border-0 h-auto">
                {assignment.dueUrgencyText}
              </Badge>
            )}

            {isSubmitted && assignment.cohortBadgeText && (
              <Badge className="font-label-mono-xs text-label-mono-xs bg-secondary-fixed text-on-secondary-fixed-variant px-space-xs py-0.5 uppercase tracking-wider font-semibold rounded-none border-0 h-auto">
                {assignment.cohortBadgeText}
              </Badge>
            )}

            {assignment.tag && (
              <Badge className="font-label-mono-xs text-label-mono-xs bg-surface-container-high text-on-surface-variant px-space-xs py-0.5 uppercase rounded-none border-0 h-auto">
                {assignment.tag}
              </Badge>
            )}
          </div>

          {/* Title & Description */}
          <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight mb-space-xs">
            {assignment.title}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-4xl mb-space-md">
            {assignment.description}
          </p>

          {/* Specifications Grid */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-3 gap-space-sm font-label-mono-xs text-label-mono-xs p-space-sm ${
              isOverdue
                ? 'bg-error-container/20 border border-error/20'
                : 'bg-surface-container-low'
            }`}
          >
            {isOverdue ? (
              <>
                <div>
                  <span className="text-error block uppercase font-semibold">OFFICIAL CUT-OFF</span>
                  <span className="text-error font-bold font-label-code text-label-code">
                    {assignment.deadlineDisplay}
                  </span>
                </div>
                <div>
                  <span className="text-error block uppercase font-semibold">STATUS NOTE</span>
                  <span className="text-on-surface">Overdue by 5 days • Submission locked</span>
                </div>
                <div>
                  <span className="text-error block uppercase font-semibold">RECOVERY POLICY</span>
                  <span className="text-on-surface">Contact TA office hours for late review</span>
                </div>
              </>
            ) : isGraded ? (
              <>
                <div>
                  <span className="text-on-surface-variant block uppercase">TERM TIMELINE</span>
                  <span className="text-on-surface">Closed: {assignment.dueDate}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block uppercase">EVALUATION METRIC</span>
                  <span className="text-on-surface font-semibold">
                    {assignment.score || assignment.classMean || 'Verified & Graded'}
                  </span>
                </div>
                <div>
                  <span className="text-on-surface-variant block uppercase">AUDIT ARCHIVE</span>
                  <span className="text-on-surface">
                    {assignment.auditArchive || 'Official Department Registrar #8812'}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className="text-on-surface-variant block uppercase">SUBMISSION DEADLINE</span>
                  <span
                    className={`font-label-code text-label-code font-bold ${
                      !isSubmitted ? 'text-secondary' : 'text-on-surface'
                    }`}
                  >
                    {assignment.deadlineDisplay}
                  </span>
                </div>
                <div>
                  <span className="text-on-surface-variant block uppercase">
                    {assignment.instructor ? 'FACULTY INSTRUCTOR' : 'DRIVE REPOSITORY'}
                  </span>
                  <span className="text-on-surface font-semibold truncate block">
                    {assignment.instructor || assignment.driveUrl.replace('https://', '')}
                  </span>
                </div>
                <div>
                  <span className="text-on-surface-variant block uppercase">
                    {assignment.verificationHash ? 'VERIFICATION HASH' : 'DELIVERABLE ARTIFACTS'}
                  </span>
                  <span
                    className={`text-on-surface ${
                      assignment.verificationHash ? 'font-label-code text-outline' : ''
                    }`}
                  >
                    {assignment.verificationHash || 'PDF Paper + Google Drive Sync'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action & Status Column */}
        <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-space-md shrink-0 lg:min-w-[240px]">
          {/* Status Badge */}
          {isOverdue ? (
            <Badge className="inline-flex items-center gap-1.5 px-space-sm py-1 bg-error-container text-on-error-container font-label-mono-xs text-label-mono-xs uppercase tracking-wider font-bold rounded-none border-0 h-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-error" />
              OVERDUE / UNRESOLVED
            </Badge>
          ) : isSubmitted ? (
            <div className="flex flex-col items-end">
              <Badge className="inline-flex items-center gap-1.5 px-space-sm py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-mono-xs text-label-mono-xs uppercase tracking-wider font-bold rounded-none border-0 h-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container" />
                {isGraded ? 'SUBMITTED & SEALED' : 'SUBMITTED'}
              </Badge>
              {studentSubmission?.timestamp && (
                <span className="mt-1 text-right font-label-mono-xs text-label-mono-xs text-on-surface-variant">
                  {studentSubmission.timestamp.startsWith('Submitted')
                    ? studentSubmission.timestamp
                    : `Submitted on ${studentSubmission.timestamp}`}
                </span>
              )}
            </div>
          ) : (
            <Badge className="inline-flex items-center gap-1.5 px-space-sm py-1 bg-secondary-fixed text-on-secondary-fixed-variant font-label-mono-xs text-label-mono-xs uppercase tracking-wider font-bold rounded-none border-0 h-auto">
              <span className="w-2 h-2 rounded-full bg-secondary-container" />
              PENDING SUBMISSION
            </Badge>
          )}

          {/* Action Button */}
          <div className="w-full text-right">
            <Button
              type="button"
              variant={!isSubmitted && !isOverdue ? 'default' : 'outline'}
              onClick={handleOpenDetails}
              className={`inline-flex items-center justify-center gap-space-xs w-full font-label-code text-label-code uppercase tracking-wider transition-colors cursor-pointer border-0 rounded-none h-auto font-normal shadow-none ${
                !isSubmitted && !isOverdue
                  ? 'px-space-md py-2.5 bg-primary text-on-primary hover:bg-primary-container shadow-sm'
                  : 'px-space-md py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface'
              }`}
            >
              <span>
                {!isSubmitted && !isOverdue
                  ? 'Open Assignment & Submit'
                  : isSubmitted
                  ? isGraded
                    ? 'View Record'
                    : 'View Submission Details'
                  : 'View Assignment Spec'}
              </span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Button>

            {!isSubmitted && !isOverdue && (
              <span className="block mt-1 text-right font-label-mono-xs text-label-mono-xs text-on-surface-variant">
                External Google Drive sync required
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default StudentAssignmentCard;
