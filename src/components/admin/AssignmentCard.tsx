import { useState } from 'react';
import type { Assignment } from '../../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

interface AssignmentCardProps {
  assignment: Assignment;
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignment: Assignment) => void;
  onCopyDrive?: (url: string) => void;
}

const DEFAULT_PAGE_SIZE = 5;
const PAGE_SIZE_OPTIONS = [5, 10, 20] as const;

const getDueStatusBadgeClassName = (statusType: Assignment['dueStatusType']) => {
  switch (statusType) {
    case 'urgent':
      return 'inline-flex items-center gap-1 px-2.5 py-0.5 bg-secondary-fixed text-on-secondary-fixed font-label-mono-xs text-xs font-bold uppercase rounded-none border-0 h-auto';
    case 'normal':
      return 'inline-flex items-center gap-1 px-2.5 py-0.5 bg-surface-container text-on-surface font-label-mono-xs text-xs font-medium uppercase border border-outline-variant rounded-none h-auto';
    default:
      return 'px-2.5 py-0.5 bg-surface-container text-on-surface-variant font-label-mono-xs text-xs font-semibold uppercase border border-outline-variant rounded-none h-auto';
  }
};

export const AssignmentCard = ({
  assignment,
  onEdit,
  onDelete,
  onCopyDrive,
}: AssignmentCardProps) => {
  const [expandedRoster, setExpandedRoster] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState(1);

  const percentComplete = Math.round(
    (assignment.submittedCount / assignment.totalStudents) * 100
  );
  const pendingCount = assignment.totalStudents - assignment.submittedCount;

  const totalSubmissions = assignment.submissions.length;
  const totalPages = Math.max(1, Math.ceil(totalSubmissions / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const firstItemIndex = (activePage - 1) * pageSize;
  const lastItemIndex = Math.min(firstItemIndex + pageSize, totalSubmissions);
  const visibleSubmissions = assignment.submissions.slice(
    firstItemIndex,
    lastItemIndex
  );
  const showingRange =
    totalSubmissions === 0
      ? 'Showing 0 of 0 students'
      : `Showing ${firstItemIndex + 1}–${lastItemIndex} of ${totalSubmissions} students`;

  const assignedStudentCount = assignment.assignedStudentIds.length;
  const isAllStudentsAssigned = assignment.cohortType === 'all';
  const cohortHeading = isAllStudentsAssigned
    ? `Assigned Cohort Verification (All ${assignedStudentCount} Students)`
    : `Assigned Cohort Verification (${assignedStudentCount} Selected Students)`;
  const cohortScopeLabel = isAllStudentsAssigned
    ? 'SCOPE: ALL STUDENTS'
    : 'SCOPE: SELECTIVE COHORT';

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize);
    setCurrentPage(1);
  };

  const handleCopyDrive = () => {
    if (onCopyDrive) {
      onCopyDrive(assignment.driveUrl);
    } else {
      navigator.clipboard.writeText(assignment.driveUrl);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article
      className={`bg-surface-container-lowest border border-outline-variant shadow-sm flex flex-col ${
        assignment.isGraded ? 'opacity-90' : ''
      }`}
    >
      {/* Top Card Header */}
      <div className="p-6 border-b border-outline-variant flex flex-col lg:flex-row lg:items-start justify-between gap-4 bg-surface-container-lowest">
        <div className="flex flex-col gap-2.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            {assignment.code === 'CS101-ASN-003' ? (
              <Badge className="px-2 py-0.5 bg-primary text-on-primary font-label-mono-xs text-xs font-semibold uppercase rounded-none border-0 h-auto">
                {assignment.code}
              </Badge>
            ) : (
              <Badge className="px-2 py-0.5 bg-surface-container-high text-on-surface font-label-mono-xs text-xs font-semibold uppercase border border-outline-variant rounded-none h-auto">
                {assignment.code}
              </Badge>
            )}

            {assignment.dueStatusBadge && (
              <Badge className={getDueStatusBadgeClassName(assignment.dueStatusType)}>
                {assignment.dueStatusBadge}
              </Badge>
            )}

            {assignment.cohortBadgeText && (
              assignment.cohortType === 'selected' ? (
                <Badge className="px-2.5 py-0.5 bg-secondary-fixed text-on-secondary-fixed font-label-mono-xs text-xs font-bold uppercase rounded-none border-0 h-auto">
                  {assignment.cohortBadgeText}
                </Badge>
              ) : (
                <span className="font-label-mono-xs text-xs text-on-surface-variant uppercase font-medium">
                  • {assignment.cohortBadgeText}
                </span>
              )
            )}
          </div>

          <div className="flex items-center gap-2">
            {assignment.isGraded && (
              <span className="material-symbols-outlined text-[20px] text-on-tertiary-container">
                check_circle
              </span>
            )}
            <h2 className="font-headline-lg text-xl md:text-2xl font-bold text-on-background tracking-tight">
              {assignment.title}
            </h2>
          </div>

          <p className="text-sm text-on-surface leading-relaxed mt-0.5">
            {assignment.code === 'CS101-LAB-002' ? (
              <>
                Implement multi-threaded client-server echo application using standard TCP sockets. Measure throughput and handle non-blocking asynchronous multiplexing using{' '}
                <code className="px-1.5 py-0.5 bg-surface-container font-label-code text-xs">
                  select()
                </code>
                .
              </>
            ) : (
              assignment.description
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 pt-1">
          {assignment.isGraded ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => alert(`Downloading archive for ${assignment.code}`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-outline-variant text-on-surface hover:bg-surface-container font-label-mono-sm text-xs font-medium uppercase transition-colors cursor-pointer rounded-none h-auto shadow-none font-normal"
              >
                <span className="material-symbols-outlined text-[14px]">download</span>
                <span>Download Archive</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => alert(`Opening gradebook for ${assignment.code}`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-outline-variant text-on-surface hover:bg-surface-container font-label-mono-sm text-xs font-medium uppercase transition-colors cursor-pointer rounded-none h-auto shadow-none font-normal"
              >
                <span className="material-symbols-outlined text-[14px]">grading</span>
                <span>View Gradebook</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleCopyDrive}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-outline-variant text-on-surface hover:bg-surface-container font-label-mono-sm text-xs font-medium uppercase transition-colors cursor-pointer rounded-none h-auto shadow-none font-normal"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? 'Copied!' : 'Copy Drive'}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onEdit(assignment)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-outline-variant text-on-surface hover:bg-surface-container font-label-mono-sm text-xs font-medium uppercase transition-colors cursor-pointer rounded-none h-auto shadow-none font-normal"
              >
                <span className="material-symbols-outlined text-[14px]">edit</span>
                <span>Edit</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onDelete(assignment)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-error text-error hover:bg-error-container font-label-mono-sm text-xs font-medium uppercase transition-colors cursor-pointer rounded-none h-auto shadow-none font-normal"
              >
                <span className="material-symbols-outlined text-[14px]">delete</span>
                <span>Delete</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Metadata Strip & Submission Drive */}
      <div className="px-6 py-3.5 bg-surface-container-low border-b border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-on-surface font-label-mono-sm font-medium">
          <span
            className={`material-symbols-outlined text-[16px] ${
              assignment.isGraded ? 'text-on-surface-variant' : 'text-secondary'
            }`}
          >
            {assignment.isGraded ? 'event_available' : 'schedule'}
          </span>
          <span>{assignment.isGraded ? 'CLOSED:' : 'DEADLINE:'}</span>
          <span className="font-semibold text-on-background">
            {assignment.deadlineDisplay}
          </span>
        </div>

        {assignment.isGraded ? (
          <div className="flex items-center gap-3 font-label-mono-xs text-on-surface uppercase">
            <span>
              Class Mean: <strong className="text-primary font-bold">{assignment.classMean}</strong>
            </span>
            <span>•</span>
            <span>
              Median: <strong className="text-primary font-bold">{assignment.classMedian}</strong>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-on-surface-variant font-label-mono-xs uppercase">Drive Folder:</span>
            <a
              href={assignment.driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-label-mono-sm font-medium text-on-surface hover:text-secondary underline underline-offset-4"
            >
              <span>{assignment.driveUrl.replace('https://', '')}</span>
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </a>
          </div>
        )}
      </div>

      {/* Completion Telemetry Bar */}
      <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-lowest flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-label-mono-sm uppercase">
          {assignment.isGraded ? (
            <span className="font-bold text-on-surface text-sm">
              28 of 28 Submitted • All Submissions Graded
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-bold text-on-surface text-sm">
                {assignment.submittedCount} of {assignment.totalStudents} Submitted
              </span>
              <span className="text-outline-variant">•</span>
              <span className="text-secondary font-semibold">
                {pendingCount} Pending Submissions
              </span>
            </div>
          )}
          <span className="font-bold text-on-surface tracking-wider text-sm">
            {percentComplete}% Complete
          </span>
        </div>
        <Progress
          value={percentComplete}
          trackClassName="h-2.5 bg-surface-container-high rounded-none"
          indicatorClassName="h-full bg-primary transition-all duration-300"
          className="w-full h-2.5 overflow-hidden"
        />
      </div>

      {/* Student Audit Sub-Panel */}
      {!assignment.isGraded && assignment.submissions && assignment.submissions.length > 0 && (
        <div className="flex flex-col">
          <div className="px-6 py-3 bg-surface-container border-b border-outline-variant flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                {assignment.cohortType === 'selected' ? 'groups' : 'format_list_bulleted'}
              </span>
              <h3 className="font-label-mono-sm text-xs font-bold text-on-surface uppercase tracking-wide">
                {cohortHeading}
              </h3>
            </div>
            <span className="font-label-mono-xs text-xs text-on-surface-variant uppercase font-medium">
              {cohortScopeLabel}
            </span>
          </div>

          <Table className="w-full text-left border-collapse text-xs">
            <TableHeader>
              <TableRow className="bg-surface-container-high text-on-surface-variant font-label-mono-xs uppercase border-b border-outline-variant hover:bg-surface-container-high">
                <TableHead className="h-auto py-3 px-6 font-semibold text-on-surface-variant">
                  Student Name
                </TableHead>
                <TableHead className="h-auto py-3 px-6 font-semibold text-on-surface-variant">
                  Student ID
                </TableHead>
                <TableHead className="h-auto py-3 px-6 font-semibold text-on-surface-variant">
                  Submission Status
                </TableHead>
                <TableHead className="h-auto py-3 px-6 font-semibold text-on-surface-variant">
                  Timestamp / Verification
                </TableHead>
                <TableHead className="h-auto py-3 px-6 text-right font-semibold text-on-surface-variant">
                  Drive Record
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-outline-variant font-body-sm text-on-surface">
              {visibleSubmissions.map((submission, index) => (
                <TableRow
                  key={submission.id}
                  className={`border-b-0 hover:bg-surface-container-low transition-colors ${
                    (firstItemIndex + index) % 2 === 1
                      ? 'bg-surface-container-lowest'
                      : ''
                  }`}
                >
                  <TableCell className="py-3.5 px-6 font-semibold text-on-background">
                    {submission.name}
                  </TableCell>
                  <TableCell className="py-3.5 px-6 font-label-code text-on-surface-variant">
                    {submission.studentId}
                  </TableCell>
                  <TableCell className="py-3.5 px-6">
                    {submission.status === 'Submitted' ? (
                      <Badge className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-low text-on-tertiary-container font-label-mono-xs font-bold border border-outline-variant rounded-none h-auto">
                        <span className="material-symbols-outlined text-[13px]">
                          check_circle
                        </span>
                        Submitted
                      </Badge>
                    ) : (
                      <Badge className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-error-container text-on-error-container font-label-mono-xs font-bold border border-error/20 rounded-none h-auto">
                        <span className="material-symbols-outlined text-[13px]">
                          pending
                        </span>
                        Not Submitted
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-3.5 px-6 font-label-mono-xs text-on-surface-variant">
                    {submission.timestamp}
                  </TableCell>
                  <TableCell className="py-3.5 px-6 text-right font-label-mono-xs">
                    {submission.status === 'Submitted' ? (
                      <a
                        href={submission.driveRecordUrl || '#'}
                        className="inline-flex items-center gap-1 font-semibold text-on-surface hover:text-secondary hover:underline"
                      >
                        <span>View Submission</span>
                        <span className="material-symbols-outlined text-[12px]">
                          arrow_forward
                        </span>
                      </a>
                    ) : (
                      <span className="text-on-surface-variant">Awaiting Upload</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="px-6 py-3 bg-surface-container-low border-t border-outline-variant flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs font-label-mono-xs text-on-surface-variant">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 uppercase">
              <span>{showingRange}</span>
              <span className="text-outline-variant hidden sm:inline">•</span>
              <span>
                Page {activePage} of {totalPages}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <label className="flex items-center gap-1.5 uppercase">
                <span>Rows per page</span>
                <select
                  value={pageSize}
                  onChange={(event) =>
                    handlePageSizeChange(Number(event.target.value))
                  }
                  aria-label="Rows per page"
                  className="bg-surface-container-lowest border border-outline-variant px-1.5 py-0.5 font-label-mono-xs text-xs text-on-surface focus:outline-none focus:border-primary rounded-none cursor-pointer"
                >
                  {PAGE_SIZE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex flex-wrap items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, activePage - 1))}
                  disabled={activePage === 1}
                  className="px-2 py-1 bg-surface-container-lowest border border-outline-variant text-on-surface uppercase font-semibold hover:bg-surface-container transition-colors cursor-pointer rounded-none h-auto shadow-none font-label-mono-xs text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </Button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentPage(page)}
                      aria-label={`Go to page ${page}`}
                      aria-current={activePage === page ? 'page' : undefined}
                      className={`px-2 py-1 border font-semibold uppercase transition-colors cursor-pointer rounded-none h-auto shadow-none font-label-mono-xs text-xs ${
                        activePage === page
                          ? 'bg-primary text-on-primary border-primary'
                          : 'bg-surface-container-lowest border-outline-variant text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      {page}
                    </Button>
                  )
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, activePage + 1))}
                  disabled={activePage === totalPages}
                  className="px-2 py-1 bg-surface-container-lowest border border-outline-variant text-on-surface uppercase font-semibold hover:bg-surface-container transition-colors cursor-pointer rounded-none h-auto shadow-none font-label-mono-xs text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>

          {assignment.code === 'CS101-ASN-003' && (
            <div className="px-6 py-3 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-between text-xs font-label-mono-xs text-on-surface-variant uppercase">
              <span>Displaying 5 of 28 student records</span>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setExpandedRoster(!expandedRoster)}
                className="hover:text-primary transition-colors flex items-center gap-1 font-semibold text-on-surface cursor-pointer rounded-none h-auto p-0 font-label-mono-xs text-xs uppercase shadow-none"
              >
                <span>
                  {expandedRoster
                    ? 'Collapse Complete Roster'
                    : 'Expand Complete Roster (23 additional)'}
                </span>
                <span
                  className={`material-symbols-outlined text-[14px] transition-transform ${
                    expandedRoster ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </Button>
            </div>
          )}
        </div>
      )}
    </article>
  );
};
