import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Assignment, RosterStudent } from '../../types';
import { RosterSelectionTable } from '../../components/admin/RosterSelectionTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface CreateAssignmentPageProps {
  roster: RosterStudent[];
  onCreateAssignment: (assignment: Assignment) => void;
}

export const CreateAssignmentPage = ({
  roster,
  onCreateAssignment,
}: CreateAssignmentPageProps) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(
    ''
  );
  const [dueDate, setDueDate] = useState('2026-11-16');
  const [dueTime, setDueTime] = useState('23:59');
  const [driveUrl, setDriveUrl] = useState(
    ''
  );
  const [scope, setScope] = useState<'all' | 'selected'>('selected');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([
    '1',
    '2',
    '3',
    '4',
    '5',
  ]);
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

  const handleInsertBoilerplate = () => {
    setDescription(
      (prev) =>
        prev +
        '\n\nRubric Criteria:\n- Clarity and Rigor (30%)\n- Architecture and Implementation (40%)\n- Test Suite Coverage (30%)\nStrict adhere to ACM formatting and citation standards.'
    );
  };

  const handleSaveDraft = () => {
    showToast('Draft revision stored in local ledger.');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      alert('Please provide an assignment title.');
      return;
    }

    const newAssignment: Assignment = {
      id: `CS101-ASN-${Math.floor(100 + Math.random() * 900)}`,
      code: `CS101-ASN-${Math.floor(100 + Math.random() * 900)}`,
      title,
      description,
      dueDate,
      dueTime,
      deadlineDisplay: `${dueDate} at ${dueTime} EST`,
      dueStatusBadge: 'Active Submission',
      dueStatusType: 'normal',
      driveUrl,
      cohortType: scope,
      cohortBadgeText:
        scope === 'selected'
          ? `Restricted Cohort (${selectedStudentIds.length} Students)`
          : undefined,
      totalStudents: scope === 'all' ? 28 : selectedStudentIds.length,
      submittedCount: 0,
      assignedStudentIds:
        scope === 'all' ? roster.map((student) => student.id) : selectedStudentIds,
      submissions: (scope === 'all'
        ? roster
        : roster.filter((student) => selectedStudentIds.includes(student.id))
      ).map((student) => ({
        id: `sub-${student.id}`,
        name: student.name,
        studentId: student.studentId,
        status: 'Not Submitted',
        timestamp: 'Awaiting Student Push',
      })),
    };

    onCreateAssignment(newAssignment);
    showToast('Assignment specification verified and registered on CS101 console ledger.');
    setTimeout(() => {
      navigate('/assignments');
    }, 1200);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-gutter py-space-lg">
        <div className="flex flex-col w-full">
        {/* Top Academic Context Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-space-lg mb-space-lg border-b border-outline-variant">
          <div className="flex flex-col gap-space-xs">
            <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight font-bold">
              Create Assignment
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
              Configure submission parameters, deadline, external Drive repository, and student cohort scope for CS101.
            </p>
          </div>
        </div>

        {/* Form Architecture Container */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-space-xl">
          {/* SECTION 01: Core Directives & Specifications */}
          <section className="bg-surface-container-lowest border border-outline-variant p-space-lg flex flex-col gap-space-lg">
            <div className="flex items-center justify-between border-b border-outline-variant pb-space-sm">
              <div className="flex items-center gap-space-sm">
                <Badge className="font-label-mono-xs text-label-mono-xs bg-primary text-on-primary px-space-xs py-0.5 font-bold rounded-none border-0 h-auto">
                  SEC 01
                </Badge>
                <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-tight font-semibold">
                  CORE DIRECTIVES &amp; SPECIFICATIONS
                </h2>
              </div>
              <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase tracking-wider">
                MANDATORY PROTOCOL FIELDSET
              </span>
            </div>

            {/* Field: Assignment Nomenclature & Title */}
            <div className="flex flex-col gap-space-xs">
              <Label
                htmlFor="assignment-title"
                className="flex items-center justify-between font-label-mono-xs text-label-mono-xs uppercase text-on-surface font-semibold tracking-wider"
              >
                <span>
                  Assignment Nomenclature &amp; Title <span className="text-error">*</span>
                </span>
                <span className="text-on-surface-variant font-normal">MAX 120 CHARACTERS</span>
              </Label>
              <div className="relative">
                <Input
                  id="assignment-title"
                  type="text"
                  required
                  maxLength={120}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. CS101: Midterm Research Proposal - Distributed Consensus"
                  className="w-full bg-surface border border-outline-variant px-space-md py-space-sm font-headline-md text-headline-md text-on-surface focus:outline-none focus:border-primary transition-colors rounded-none h-auto"
                />
              </div>
              <p className="font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase">
                Standard taxonomy: [Course ID]: [Module Description] - [Core Subject Area]
              </p>
            </div>

            {/* Field: Assignment Description & Instructions */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="assignment-desc"
                  className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface font-semibold tracking-wider"
                >
                  Assignment Description &amp; Detailed Rubric Directives <span className="text-error">*</span>
                </Label>
                <div className="flex items-center gap-space-sm font-label-mono-xs text-label-mono-xs">
                  <Badge variant="outline" className="px-space-xs py-0.5 bg-surface-container border border-outline-variant uppercase text-on-surface-variant font-label-mono-xs text-label-mono-xs rounded-none h-auto">
                    Markdown Supported
                  </Badge>
                  <span className="text-on-surface-variant uppercase">
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
                placeholder="Draft assignment specifications, expected deliverable schema, academic integrity expectations, and citation requirements..."
                className="w-full bg-surface border border-outline-variant p-space-md font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors resize-y leading-relaxed rounded-none"
              />
              <div className="flex items-center justify-between pt-0.5">
                <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase">
                  INSTRUCTION HELPER: INCLUDE CLEAR CRITERIA FOR PEER REVIEW AUDIT &amp; BENCHMARKS
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleInsertBoilerplate}
                  className="font-label-mono-xs text-label-mono-xs text-secondary hover:underline uppercase flex items-center gap-1 cursor-pointer p-0 h-auto font-normal rounded-none shadow-none"
                >
                  <span className="material-symbols-outlined text-[14px]">history_edu</span>
                  <span>Insert Standard Rubric Boilerplate</span>
                </Button>
              </div>
            </div>

            {/* Dual Split: Submission Cutoff & External Drive Repository */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-space-lg pt-space-xs">
              {/* Submission Cutoff Date & Time (5 cols) */}
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
                      className="w-full bg-surface-container-lowest border border-outline-variant px-space-sm py-1.5 font-label-code text-label-code text-on-surface focus:outline-none focus:border-primary rounded-none h-auto"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="due-time"
                      className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant block mb-1 font-normal"
                    >
                      Due Time
                    </Label>
                    <Input
                      id="due-time"
                      type="time"
                      required
                      value={dueTime}
                      onChange={(e) => setDueTime(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant px-space-sm py-1.5 font-label-code text-label-code text-on-surface focus:outline-none focus:border-primary rounded-none h-auto"
                    />
                  </div>
                </div>
                <div className="pt-space-xs flex items-center justify-between border-t border-outline-variant/60 mt-space-xs">
                  <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase">
                    HARD CUTOFF APPLIED
                  </span>
                  <Badge className="font-label-mono-xs text-label-mono-xs bg-surface-container-high px-1 text-on-surface font-semibold uppercase rounded-none border-0 h-auto">
                    LATE SUBMISSIONS: LOCKED
                  </Badge>
                </div>
              </div>

              {/* External Submission Repository Link (7 cols) */}
              <div className="md:col-span-7 flex flex-col gap-space-xs bg-surface-container-low p-space-md border border-outline-variant">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="drive-url"
                    className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface font-semibold tracking-wider flex items-center gap-1 font-normal"
                  >
                    <span className="material-symbols-outlined text-[15px] text-primary">folder_shared</span>
                    External Submission Repository <span className="text-error">*</span>
                  </Label>
                  <Badge className="inline-flex items-center gap-1 font-label-mono-xs text-label-mono-xs bg-on-tertiary-container/15 text-on-tertiary-container px-space-xs py-0.5 border border-on-tertiary-container/30 uppercase font-semibold rounded-none h-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container" />
                    Linked &amp; Verified
                  </Badge>
                </div>
                <div className="flex items-center gap-space-xs pt-space-xs">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">link</span>
                    </div>
                    <Input
                      id="drive-url"
                      type="url"
                      required
                      value={driveUrl}
                      onChange={(e) => setDriveUrl(e.target.value)}
                      placeholder="https://drive.google.com/drive/folders/..."
                      className="w-full bg-surface-container-lowest border border-outline-variant pl-8 pr-2 py-1.5 font-label-code text-label-code text-on-surface focus:outline-none focus:border-primary rounded-none h-auto"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleTestDrive}
                    className="shrink-0 bg-surface-container-lowest hover:bg-surface-container-high border border-outline-variant px-space-md py-1.5 font-label-mono-xs text-label-mono-xs uppercase tracking-wider text-on-surface font-semibold transition-colors flex items-center gap-1 cursor-pointer rounded-none h-auto shadow-none font-normal"
                  >
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    <span>Test Drive Folder ↗</span>
                  </Button>
                </div>
                <p className="font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase mt-1 leading-relaxed">
                  Students will submit their compiled deliverables directly to this Google Drive directory. Institutional permissions inherit automated TA access.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 02: Student Assignment Allocation (Roster Scope) */}
          <RosterSelectionTable
            roster={roster}
            scope={scope}
            onScopeChange={setScope}
            selectedStudentIds={selectedStudentIds}
            onSelectedChange={setSelectedStudentIds}
            isEditMode={false}
          />

          {/* Operational Sticky Bottom Action Bar */}
          <div className="sticky bottom-0 z-40 bg-surface-container-lowest border-t-2 border-primary py-space-md px-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md shadow-sm">
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
                type="button"
                variant="secondary"
                onClick={handleSaveDraft}
                className="px-space-md py-2 font-label-mono-xs text-label-mono-xs font-semibold uppercase tracking-wider text-on-surface bg-surface-container-high hover:bg-surface-variant border border-outline-variant transition-colors text-center hidden md:inline-flex cursor-pointer rounded-none h-auto shadow-none font-normal"
              >
                Save Draft Record
              </Button>
              <Button
               type="submit"
                variant="default"
                onClick={() => navigate('/new-assignment')}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-slate-800 text-white font-label-mono-sm text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm cursor-pointer rounded-none h-auto font-normal"
              >
                <span className="material-symbols-outlined text-[16px]">publish</span>
                <span>Publish Assignment</span>
              </Button>
            </div>
          </div>
        </form>

        {/* Status Toast Simulation */}
        {toastMessage && (
          <div className="fixed bottom-20 right-6 z-50 bg-primary text-on-primary p-space-md border border-outline-variant shadow-xl max-w-sm flex items-start gap-space-sm animate-in fade-in slide-in-from-bottom-4">
            <span className="material-symbols-outlined text-tertiary-fixed text-[20px]">
              check_circle
            </span>
            <div className="flex flex-col">
              <span className="font-label-mono-xs text-label-mono-xs font-bold uppercase tracking-wider">
                Protocol Committed
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
