import { useState, useMemo } from 'react';
import type { Assignment, RosterStudent } from '../../types';
import { StudentAssignmentCard } from '../../components/student/StudentAssignmentCard';
import {
  isAssignmentAssignedToStudent,
  getStudentAssignmentStatus,
} from '../../components/student/studentUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

export interface StudentDashboardPageProps {
  assignments: Assignment[];
  currentStudent: RosterStudent;
}

type FilterTab = 'all' | 'pending' | 'submitted' | 'archived';

export const StudentDashboardPage = ({
  assignments,
  currentStudent,
}: StudentDashboardPageProps) => {
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Assignments assigned to this specific student account
  const studentAssignments = useMemo(() => {
    return assignments.filter((assignment) =>
      isAssignmentAssignedToStudent(assignment, currentStudent)
    );
  }, [assignments, currentStudent]);

  // Overall student telemetry and completion stats
  const metrics = useMemo(() => {
    let pending = 0;
    let submitted = 0;
    let overdue = 0;

    studentAssignments.forEach((assignment) => {
      const status = getStudentAssignmentStatus(assignment, currentStudent);
      if (status === 'submitted') {
        submitted++;
      } else if (status === 'overdue') {
        overdue++;
      } else {
        pending++;
      }
    });

    const total = studentAssignments.length;
    const percentage = total > 0 ? Math.round((submitted / total) * 100) : 0;

    return { total, pending, submitted, overdue, percentage };
  }, [studentAssignments, currentStudent]);

  // Search and category tab filtering
  const visibleAssignments = useMemo(() => {
    return studentAssignments.filter((assignment) => {
      const status = getStudentAssignmentStatus(assignment, currentStudent);

      if (filterTab === 'pending' && status !== 'pending') return false;
      if (filterTab === 'submitted' && status !== 'submitted') return false;
      if (filterTab === 'archived' && status === 'pending') return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesCode = assignment.code.toLowerCase().includes(query);
        const matchesTitle = assignment.title.toLowerCase().includes(query);
        const matchesDesc = assignment.description.toLowerCase().includes(query);
        if (!matchesCode && !matchesTitle && !matchesDesc) return false;
      }

      return true;
    });
  }, [studentAssignments, currentStudent, filterTab, searchQuery]);

  return (
    <div className="flex flex-col w-full py-space-lg">
      {/* Top Academic Context Header & Telemetry */}
      <section className="bg-surface-container-lowest p-space-lg md:p-space-xl shadow-sm mb-space-lg">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-space-lg">
          {/* Title & Academic Ledger Info */}
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-space-xs mb-space-xs font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase tracking-wider">
              <Badge className="px-space-xs py-0.5 bg-surface-container-high font-semibold text-secondary rounded-none border-0 h-auto font-label-mono-xs text-label-mono-xs">
                COHORT ENROLLMENT
              </Badge>
              <span>•</span>
              <span className="text-on-surface font-semibold">CS101 FALL 2026</span>
              <span>•</span>
              <span>STUDENT: {currentStudent.name}</span>
              <span className="text-outline font-label-code text-label-code">
                {currentStudent.studentId}
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight mb-space-xs">
              My Enrolled Assignments
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Track your assigned deliverables, submit project repositories via external Google Drive folders, and monitor your personal completion cadence across the active semester term.
            </p>
          </div>

          {/* Cadence Telemetry Block */}
          <div className="w-full lg:w-96 bg-surface-container-low p-space-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-label-mono-xs text-label-mono-xs mb-1.5">
                <span className="uppercase tracking-wider font-semibold text-on-surface">
                  OVERALL COMPLETION
                </span>
                <span className="font-label-code text-label-code text-primary font-bold">
                  {metrics.submitted} OF {metrics.total} COMPLETED ({metrics.percentage}%)
                </span>
              </div>
              <Progress
                value={metrics.percentage}
                trackClassName="h-2 bg-surface-container-highest rounded-none"
                indicatorClassName="h-full bg-primary transition-all duration-500 ease-out"
                className="w-full h-2 mb-space-md"
              />
            </div>

            {/* Metric Distribution Cards */}
            <div className="grid grid-cols-3 gap-space-xs font-label-mono-xs text-label-mono-xs text-center">
              <div className="bg-surface-container-lowest py-1.5 px-space-xs">
                <span className="block text-secondary font-bold text-body-sm">
                  {metrics.pending}
                </span>
                <span className="text-on-surface-variant uppercase">Pending</span>
              </div>
              <div className="bg-surface-container-lowest py-1.5 px-space-xs">
                <span className="block text-on-tertiary-container font-bold text-body-sm">
                  {metrics.submitted}
                </span>
                <span className="text-on-surface-variant uppercase">Submitted</span>
              </div>
              <div className="bg-surface-container-lowest py-1.5 px-space-xs">
                <span className="block text-error font-bold text-body-sm">
                  {metrics.overdue}
                </span>
                <span className="text-on-surface-variant uppercase">Overdue</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="mt-space-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-space-sm border-t border-surface-dim pt-space-md">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by assignment code, title, or keywords..."
              className="w-full pl-9 pr-8 py-2 bg-surface-container-low border border-surface-dim rounded-DEFAULT font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors h-auto"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer border-0 bg-transparent p-1 h-auto w-auto shadow-none"
                aria-label="Clear search"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </Button>
            )}
          </div>
        </div>

        {/* View Filter Buttons */}
        <div className="mt-space-md flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-low px-space-md py-space-sm">
          <div className="flex flex-wrap items-center gap-space-xs">
            <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase font-semibold">
              VIEW FILTER:
            </span>
            <Button
              type="button"
              variant="outline"
              onClick={() => setFilterTab('all')}
              className={`px-space-sm py-1 font-label-mono-xs text-label-mono-xs uppercase tracking-wider font-semibold cursor-pointer border-0 transition-colors rounded-none h-auto shadow-none font-normal ${
                filterTab === 'all'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
              }`}
            >
              ALL COHORT TASKS ({metrics.total})
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setFilterTab('pending')}
              className={`px-space-sm py-1 font-label-mono-xs text-label-mono-xs uppercase tracking-wider font-semibold cursor-pointer border-0 transition-colors rounded-none h-auto shadow-none font-normal ${
                filterTab === 'pending'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
              }`}
            >
              PENDING ({metrics.pending})
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setFilterTab('submitted')}
              className={`px-space-sm py-1 font-label-mono-xs text-label-mono-xs uppercase tracking-wider font-semibold cursor-pointer border-0 transition-colors rounded-none h-auto shadow-none font-normal ${
                filterTab === 'submitted'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
              }`}
            >
              SUBMITTED ({metrics.submitted})
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setFilterTab('archived')}
              className={`px-space-sm py-1 font-label-mono-xs text-label-mono-xs uppercase tracking-wider font-semibold cursor-pointer border-0 transition-colors rounded-none h-auto shadow-none font-normal ${
                filterTab === 'archived'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
              }`}
            >
              ARCHIVED ({metrics.total - metrics.pending})
            </Button>
          </div>

          <div className="flex items-center gap-space-sm font-label-mono-xs text-label-mono-xs text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 bg-secondary-container rounded-full" />
              AUDIT LOG: SYNCED
            </span>
            <span className="text-outline">|</span>
            <span>INDEXING: DIRECTORY_V2</span>
          </div>
        </div>
      </section>

      {/* Deliverables Stream */}
      <section className="flex flex-col gap-space-md mb-space-xl">
        {visibleAssignments.length > 0 ? (
          visibleAssignments.map((assignment) => (
            <StudentAssignmentCard
              key={assignment.id}
              assignment={assignment}
              currentStudentId={currentStudent.id}
            />
          ))
        ) : (
          <div className="bg-surface-container-lowest p-space-xl text-center border border-surface-dim">
            <span className="material-symbols-outlined text-[36px] text-outline mb-2">
              task_alt
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
              No Assignments Found
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto mt-1">
              {searchQuery
                ? `No assignments match your search query "${searchQuery}".`
                : 'There are no deliverables in this category.'}
            </p>
            {searchQuery && (
              <Button
                type="button"
                variant="default"
                onClick={() => setSearchQuery('')}
                className="mt-space-md inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-slate-800 text-white font-label-mono-sm text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm cursor-pointer rounded-none h-auto font-normal"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
                <span>Clear Search Filter</span>
              </Button>
            )}
          </div>
        )}
      </section>

      {/* External Drive Verification & Institutional Protocol Callout */}
      <section className="bg-surface-container-low p-space-lg mb-space-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
          <div className="flex items-start gap-space-md">
            <div className="w-10 h-10 bg-primary text-on-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">cloud_sync</span>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-primary tracking-tight font-semibold">
                Submission Repository Verification Standard
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl mt-0.5">
                Joineazy academic deliverables require linked Google Drive folders with global viewer access enabled for instructional audit. Check your repository share permissions before active deadlines.
              </p>
            </div>
          </div>
          <div className="font-label-mono-xs text-label-mono-xs text-on-surface-variant shrink-0 bg-surface-container-lowest px-space-md py-space-sm border border-surface-dim">
            <span>SECURITY DIRECTIVE: </span>
            <span className="text-primary font-bold">SEC-REG-4819-A</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentDashboardPage;
