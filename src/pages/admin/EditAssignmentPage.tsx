import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Assignment, RosterStudent } from '../../types';
import { RosterSelectionTable } from '../../components/admin/RosterSelectionTable';
import { DeleteModal } from '../../components/admin/DeleteModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface EditAssignmentPageProps {
  assignments: Assignment[];
  roster: RosterStudent[];
  onUpdateAssignment: (assignment: Assignment) => void;
  onDeleteAssignment: (id: string) => void;
}

export const EditAssignmentPage: React.FC<EditAssignmentPageProps> = ({
  assignments,
  roster,
  onUpdateAssignment,
  onDeleteAssignment,
}) => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  // Find current assignment or default to first
  const currentAssignment =
    assignments.find((a) => a.id === assignmentId) || assignments[0];

  const [title, setTitle] = useState(
    currentAssignment?.title || ''
  );
  const [description, setDescription] = useState(
    currentAssignment?.description ||
      ''
  );
  const [dueDate, setDueDate] = useState(currentAssignment?.dueDate || '2026-11-16');
  const [dueTime, setDueTime] = useState(currentAssignment?.dueTime || '23:59');
  const [driveUrl, setDriveUrl] = useState(
    currentAssignment?.driveUrl ||
      'https://drive.google.com/drive/folders/cs101-consensus-2026-arch'
  );
  const [scope, setScope] = useState<'all' | 'selected'>(
    currentAssignment?.cohortType || 'selected'
  );
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(
    currentAssignment?.assignedStudentIds && currentAssignment.assignedStudentIds.length > 0
      ? currentAssignment.assignedStudentIds
      : ['1', '2', '3', '4', '5']
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleTestDrive = () => {
    if (driveUrl) {
      window.open(driveUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert('Please specify a valid repository path.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please provide an assignment title.');
      return;
    }

    const updated: Assignment = {
      ...currentAssignment,
      title,
      description,
      dueDate,
      dueTime,
      deadlineDisplay: `${dueDate} at ${dueTime} EST`,
      driveUrl,
      cohortType: scope,
      cohortBadgeText:
        scope === 'selected'
          ? `Restricted Cohort (${selectedStudentIds.length} Students)`
          : undefined,
      totalStudents: scope === 'all' ? 28 : selectedStudentIds.length,
      assignedStudentIds: scope === 'all' ? roster.map((r) => r.id) : selectedStudentIds,
    };

    onUpdateAssignment(updated);
    showToast('Changes committed and updated in faculty console register.');
    setTimeout(() => {
      navigate('/assignments');
    }, 1000);
  };

  const handleDelete = () => {
    onDeleteAssignment(currentAssignment.id);
    setIsDeleteModalOpen(false);
    navigate('/assignments');
  };

  return (
    <div className="max-w-[1280px] mx-auto px-gutter py-space-lg">
        <div className="flex flex-col w-full">
        {/* Top Academic Context & Breadcrumbs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm pb-space-sm border-b border-outline-variant">
          <div className="flex items-center gap-space-xs">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/assignments')}
              className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant hover:text-on-surface flex items-center gap-1 transition-colors cursor-pointer bg-transparent border-0 p-0 h-auto rounded-none shadow-none font-normal"
            >
              <span className="material-symbols-outlined text-[15px]">arrow_back</span>
              <span>Back to Dashboard</span>
            </Button>
            <span className="text-outline-variant font-label-mono-xs">/</span>
            <span className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant tracking-wider font-medium">
              CS101 • EDIT ASSIGNMENT RECORD
            </span>
          </div>
          <div className="flex items-center gap-space-md">
            <Badge variant="outline" className="font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase flex items-center gap-1 font-semibold rounded-none border-0 h-auto p-0 bg-transparent">
              <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container" />
              RECORD: {currentAssignment?.code || 'ASN-003'} • ACTIVE
            </Badge>
          </div>
        </div>

        {/* Header Block with Title & Isolated Delete Trigger */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md py-space-lg border-b border-outline-variant">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-secondary inline-block" />
              <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                CURRICULAR PROTOCOL CONFIGURATION
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight font-bold">
              Edit Assignment
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Modify assignment parameters, deadline, submission repository link, and assigned student cohort.
            </p>
          </div>

          <div className="shrink-0 flex items-center">
            <Button
              type="button"
              id="btn-header-delete"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-space-md py-2 bg-error-container hover:bg-error/20 text-on-error-container border border-error/30 font-label-code text-label-code uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer rounded-none h-auto shadow-none font-normal"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              <span>Delete Assignment</span>
            </Button>
          </div>
        </div>

        {/* Form Architecture Flow */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-space-xl mt-space-lg">
          {/* SECTION 1: ASSIGNMENT INFORMATION */}
          <section className="bg-surface-container-lowest border border-outline-variant p-space-lg flex flex-col gap-space-lg">
            <div className="flex items-center justify-between border-b border-outline-variant pb-space-sm">
              <div className="flex items-center gap-space-sm">
                <Badge className="font-label-mono-xs text-label-mono-xs bg-primary text-on-primary px-space-xs py-0.5 font-bold rounded-none border-0 h-auto">
                  SEC 01
                </Badge>
                <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-tight font-semibold">
                  ASSIGNMENT INFORMATION
                </h2>
              </div>
              <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase tracking-wider font-medium">
                CORE PARAMETERS
              </span>
            </div>

            {/* Title Input */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="assignment-title"
                  className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface font-semibold tracking-wider"
                >
                  Assignment Title <span className="text-error">*</span>
                </Label>
                <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant">
                  {title.length} / 120 CHARACTERS
                </span>
              </div>
              <Input
                id="assignment-title"
                type="text"
                required
                maxLength={120}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-surface border border-outline-variant px-space-md py-space-sm font-headline-md text-headline-md text-on-surface focus:outline-none focus:border-primary transition-colors rounded-none h-auto"
              />
              <p className="font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase">
                Standard taxonomy: [Course ID]: [Module Description] - [Core Subject Area]
              </p>
            </div>

            {/* Description Textarea */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="assignment-desc"
                  className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface font-semibold tracking-wider"
                >
                  Assignment Description &amp; Detailed Directives <span className="text-error">*</span>
                </Label>
                <div className="flex items-center gap-space-sm font-label-mono-xs text-label-mono-xs">
                  <Badge variant="outline" className="px-space-xs py-0.5 bg-surface-container border border-outline-variant uppercase text-on-surface-variant font-medium rounded-none h-auto font-label-mono-xs text-label-mono-xs">
                    Markdown Supported
                  </Badge>
                  <span className="text-on-surface-variant uppercase font-label-mono-xs text-label-mono-xs">
                    {description.length} / 2000 chars
                  </span>
                </div>
              </div>
              <Textarea
                id="assignment-desc"
                rows={4}
                required
                maxLength={2000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-surface border border-outline-variant p-space-md font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors resize-y leading-relaxed rounded-none"
              />
              <p className="font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase">
                Provide comprehensive instructions, evaluation expectations, and deliverable format requirements.
              </p>
            </div>
          </section>

          {/* SECTION 2: SUBMISSION DETAILS & TIMELINE */}
          <section className="bg-surface-container-lowest border border-outline-variant p-space-lg flex flex-col gap-space-lg">
            <div className="flex items-center justify-between border-b border-outline-variant pb-space-sm">
              <div className="flex items-center gap-space-sm">
                <Badge className="font-label-mono-xs text-label-mono-xs bg-primary text-on-primary px-space-xs py-0.5 font-bold rounded-none border-0 h-auto">
                  SEC 02
                </Badge>
                <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-tight font-semibold">
                  SUBMISSION DETAILS &amp; TIMELINE
                </h2>
              </div>
              <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase tracking-wider font-medium">
                SCHEDULE &amp; REPOSITORY
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-space-lg">
              {/* Due Date & Cutoff Time (5 cols) */}
              <div className="md:col-span-5 flex flex-col gap-space-xs bg-surface-container-low p-space-md border border-outline-variant">
                <span className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface font-semibold tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-secondary">schedule</span>
                  Submission Cutoff Deadline (EST / UTC-05) <span className="text-error">*</span>
                </span>
                <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
                  <div>
                    <Label
                      htmlFor="due-date"
                      className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant block mb-1 font-normal"
                    >
                      Due Date
                    </Label>
                    <Input
                      id="due-date"
                      type="date"
                      required
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant px-space-sm py-2 font-label-code text-label-code text-on-surface focus:outline-none focus:border-primary rounded-none h-auto"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="due-time"
                      className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant block mb-1 font-normal"
                    >
                      Cutoff Time
                    </Label>
                    <Input
                      id="due-time"
                      type="time"
                      required
                      value={dueTime}
                      onChange={(e) => setDueTime(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant px-space-sm py-2 font-label-code text-label-code text-on-surface focus:outline-none focus:border-primary rounded-none h-auto"
                    />
                  </div>
                </div>
                <div className="pt-space-xs flex items-center justify-between border-t border-outline-variant mt-space-xs">
                  <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase">
                    DEADLINE ENFORCEMENT
                  </span>
                  <Badge className="font-label-mono-xs text-label-mono-xs bg-surface-container-high px-1 text-on-surface font-semibold uppercase rounded-none border-0 h-auto">
                    LATE SUBMISSIONS: LOCKED
                  </Badge>
                </div>
              </div>

              {/* Google Drive Submission Repository Link (7 cols) */}
              <div className="md:col-span-7 flex flex-col gap-space-xs bg-surface-container-low p-space-md border border-outline-variant">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="drive-link"
                    className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface font-semibold tracking-wider flex items-center gap-1 font-normal"
                  >
                    <span className="material-symbols-outlined text-[15px] text-primary">folder_shared</span>
                    Google Drive Submission Repository <span className="text-error">*</span>
                  </Label>
                  <Badge className="inline-flex items-center gap-1 font-label-mono-xs text-label-mono-xs bg-on-tertiary-container/15 text-on-tertiary-container px-space-xs py-0.5 border border-on-tertiary-container/30 uppercase font-semibold rounded-none h-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container" />
                    Verified
                  </Badge>
                </div>
                <div className="flex items-center gap-space-xs pt-space-xs">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">link</span>
                    </div>
                    <Input
                      id="drive-link"
                      type="url"
                      required
                      value={driveUrl}
                      onChange={(e) => setDriveUrl(e.target.value)}
                      placeholder="https://drive.google.com/drive/folders/..."
                      className="w-full bg-surface-container-lowest border border-outline-variant pl-8 pr-2 py-2 font-label-code text-label-code text-on-surface focus:outline-none focus:border-primary rounded-none h-auto"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleTestDrive}
                    className="shrink-0 bg-surface-container-lowest hover:bg-surface-container-high border border-outline-variant px-space-md py-2 font-label-mono-xs text-label-mono-xs uppercase tracking-wider text-on-surface font-semibold transition-colors flex items-center gap-1 cursor-pointer rounded-none h-auto shadow-none font-normal"
                  >
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    <span>Test Drive Link ↗</span>
                  </Button>
                </div>
                <p className="font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase mt-1 leading-relaxed">
                  Students will submit their compiled deliverables directly to this Google Drive directory. Automated permissions inherit instructor privileges.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 3: STUDENT ASSIGNMENT ALLOCATION */}
          <RosterSelectionTable
            roster={roster}
            scope={scope}
            onScopeChange={setScope}
            selectedStudentIds={selectedStudentIds}
            onSelectedChange={setSelectedStudentIds}
            isEditMode={true}
          />

          {/* Grounded Form Actions Bar */}
          <div className="sticky bottom-0 z-40 bg-surface-container-lowest border-t-2 border-primary py-space-md px-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md shadow-sm">
            <div className="flex items-center gap-space-md">
              <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse" />
              <span className="font-label-mono-xs text-label-mono-xs text-on-surface font-semibold uppercase">
                Changes will apply to assigned student portals
              </span>
            </div>

            <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/assignments')}
                className="px-space-lg py-2 font-label-mono-xs text-label-mono-xs font-semibold uppercase tracking-wider text-on-surface-variant hover:text-on-surface hover:bg-surface-container border border-outline-variant transition-colors text-center cursor-pointer rounded-none h-auto shadow-none font-normal"
              >
                Cancel &amp; Discard
              </Button>
              <Button
                type="submit"
                id="btn-save-assignment"
                variant="default"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary hover:bg-surface-variant hover:text-black font-label-mono-sm text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm cursor-pointer rounded-none h-auto font-normal"
              >
                <span className="material-symbols-outlined text-[16px]">save</span>
                <span>Save Changes</span>
              </Button>
            </div>
          </div>
        </form>

        {/* Delete Confirmation Modal */}
        <DeleteModal
          isOpen={isDeleteModalOpen}
          assignmentTitle={currentAssignment?.title || title}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />

        {/* Status Toast Simulation */}
        {toastMessage && (
          <div className="fixed bottom-20 right-6 z-50 bg-primary text-on-primary p-space-md border border-outline-variant shadow-xl max-w-sm flex items-start gap-space-sm animate-in fade-in slide-in-from-bottom-4">
            <span className="material-symbols-outlined text-tertiary-fixed text-[20px]">
              check_circle
            </span>
            <div className="flex flex-col">
              <span className="font-label-mono-xs text-label-mono-xs font-bold uppercase tracking-wider">
                Changes Stored
              </span>
              <span className="font-body-sm text-body-sm text-surface-variant">
                {toastMessage}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
