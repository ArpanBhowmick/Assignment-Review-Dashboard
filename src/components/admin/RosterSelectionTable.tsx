import { useState, useMemo } from 'react';
import type { RosterStudent } from '../../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

interface RosterSelectionTableProps {
  roster: RosterStudent[];
  scope: 'all' | 'selected';
  onScopeChange: (scope: 'all' | 'selected') => void;
  selectedStudentIds: string[];
  onSelectedChange: (ids: string[]) => void;
  isEditMode?: boolean;
}

export const RosterSelectionTable = ({
  roster,
  scope,
  onScopeChange,
  selectedStudentIds,
  onSelectedChange,
  isEditMode = false,
}: RosterSelectionTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRoster = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return roster;
    return roster.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.studentId.toLowerCase().includes(query)
    );
  }, [roster, searchQuery]);

  const handleToggle = (id: string) => {
    if (selectedStudentIds.includes(id)) {
      onSelectedChange(selectedStudentIds.filter((studentId) => studentId !== id));
    } else {
      onSelectedChange([...selectedStudentIds, id]);
    }
  };

  const handleSelectAll = (select: boolean) => {
    if (select) {
      onSelectedChange(roster.map((student) => student.id));
    } else {
      onSelectedChange([]);
    }
  };

  const selectedCount = scope === 'all' ? roster.length : selectedStudentIds.length;

  return (
    <section className="bg-surface-container-lowest border border-outline-variant p-space-lg flex flex-col gap-space-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-outline-variant pb-space-sm gap-2">
        <div className="flex items-center gap-space-sm">
          <Badge className="font-label-mono-xs text-label-mono-xs bg-primary text-on-primary px-space-xs py-0.5 font-bold rounded-none border-0 h-auto">
            {isEditMode ? 'SEC 03' : 'SEC 02'}
          </Badge>
          <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-tight font-semibold">
            STUDENT ASSIGNMENT ALLOCATION {isEditMode ? '' : '(ROSTER SCOPE)'}
          </h2>
        </div>
        <Badge
          className={`px-space-xs py-0.5 font-label-mono-xs text-label-mono-xs uppercase tracking-wider border self-start sm:self-auto font-semibold rounded-none h-auto ${
            scope === 'all'
              ? 'bg-primary text-on-primary border-primary'
              : 'bg-secondary-fixed text-on-secondary-fixed border-secondary'
          }`}
        >
          {scope === 'all'
            ? 'ALL 28 STUDENTS ASSIGNED'
            : `${selectedCount} OF 28 STUDENTS SELECTED`}
        </Badge>
      </div>

      {/* Cohort Mode Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        {/* Option A: Whole Class */}
        <label
          onClick={() => {
            onScopeChange('all');
            handleSelectAll(true);
          }}
          className={`cursor-pointer p-space-md flex items-start gap-space-md transition-colors ${
            scope === 'all'
              ? 'border-2 border-primary bg-surface-container-lowest'
              : 'border border-outline-variant bg-surface-container-low hover:bg-surface-container'
          }`}
        >
          <input
            type="radio"
            name="roster_scope"
            value="all"
            checked={scope === 'all'}
            onChange={() => {
              onScopeChange('all');
              handleSelectAll(true);
            }}
            className="mt-1 accent-primary cursor-pointer"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-body-md text-body-md font-bold uppercase text-on-surface">
                Option A: All Students
              </span>
              <Badge variant="outline" className="font-label-mono-xs text-label-mono-xs bg-surface-container-high px-1 py-0.5 border border-outline-variant uppercase text-on-surface-variant font-medium rounded-none h-auto">
                {isEditMode ? 'Whole Class - 28 Enrolled' : 'General Roster'}
              </Badge>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
              {isEditMode
                ? 'Mandatory curriculum assignment for all officially enrolled students in CS101 Section 01.'
                : 'Distribute to all 28 enrolled students in CS101 Lecture Section 01. Standard term submission schedule.'}
            </p>
          </div>
        </label>

        {/* Option B: Custom Cohort */}
        <label
          onClick={() => onScopeChange('selected')}
          className={`cursor-pointer p-space-md flex items-start gap-space-md transition-colors ${
            scope === 'selected'
              ? 'border-2 border-primary bg-surface-container-lowest'
              : 'border border-outline-variant bg-surface-container-low hover:bg-surface-container'
          }`}
        >
          <input
            type="radio"
            name="roster_scope"
            value="selected"
            checked={scope === 'selected'}
            onChange={() => onScopeChange('selected')}
            className="mt-1 accent-primary cursor-pointer"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-body-md text-body-md font-bold uppercase text-on-surface">
                Option B: Selected Students
              </span>
              <Badge className="font-label-mono-xs text-label-mono-xs bg-secondary-fixed text-on-secondary-fixed px-1 py-0.5 border border-secondary uppercase font-semibold rounded-none h-auto">
                {isEditMode
                  ? `Targeted Cohort - ${selectedStudentIds.length} of 28 Selected`
                  : 'Restricted Cohort'}
              </Badge>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
              {isEditMode
                ? 'Restricted group for remedial tracks, make-up sessions, or special honors research cohorts.'
                : 'Assign to a targeted cohort only (makeup exam, advanced thesis track, or differentiated laboratory cluster).'}
            </p>
          </div>
        </label>
      </div>

      {/* Cohort Selector Table Workstation */}
      <div className="flex flex-col border border-outline-variant bg-surface">
        {/* Table Action Toolbar */}
        <div className="p-space-sm bg-surface-container-low border-b border-outline-variant flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm flex-1 max-w-md">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-[16px] text-on-surface-variant">
                search
              </span>
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isEditMode
                    ? 'Search by student name or #STU ID...'
                    : 'Search roster by student name or #STU ID...'
                }
                className="w-full bg-surface-container-lowest border border-outline-variant pl-8 pr-2 py-1 font-label-mono-xs text-label-mono-xs text-on-surface focus:outline-none focus:border-primary rounded-none h-auto"
              />
            </div>
          </div>
          <div className="flex items-center gap-space-xs shrink-0 font-label-mono-xs text-label-mono-xs">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSelectAll(true)}
              className="px-space-sm py-1 bg-surface-container-lowest border border-outline-variant text-on-surface uppercase font-semibold hover:bg-surface-container transition-colors cursor-pointer rounded-none h-auto shadow-none font-label-mono-xs text-label-mono-xs font-normal"
            >
              Select All (28)
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSelectAll(false)}
              className="px-space-sm py-1 bg-surface-container-lowest border border-outline-variant text-on-surface-variant uppercase font-semibold hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer rounded-none h-auto shadow-none font-label-mono-xs text-label-mono-xs font-normal"
            >
              Clear Selection
            </Button>
            <span className="text-outline-variant px-1 hidden md:inline">|</span>
            <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase tracking-wider hidden md:inline">
              {isEditMode ? 'ENROLLMENT INDEX ACTIVE' : 'LIVE INDEX AUDIT: READY'}
            </span>
          </div>
        </div>

        {/* Student Selection Table */}
        <Table className="w-full text-left border-collapse">
          <TableHeader>
            <TableRow className="bg-surface-container-high border-b border-outline-variant font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase tracking-wider hover:bg-surface-container-high">
              <TableHead className="h-auto py-2.5 px-3 w-10 text-center [&:has([role=checkbox])]:pr-3 text-on-surface-variant">
                <span className="sr-only">Select</span>
              </TableHead>
              <TableHead className="h-auto py-2.5 px-3 text-on-surface-variant font-medium">
                Student Name
              </TableHead>
              <TableHead className="h-auto py-2.5 px-3 text-on-surface-variant font-medium">
                Identifier (#ID)
              </TableHead>
              <TableHead className="h-auto py-2.5 px-3 text-on-surface-variant font-medium">
                Enrolled Section
              </TableHead>
              <TableHead className="h-auto py-2.5 px-3 text-on-surface-variant font-medium">
                {isEditMode ? 'Academic Track' : 'Academic Standing'}
              </TableHead>
              <TableHead className="h-auto py-2.5 px-3 text-right text-on-surface-variant font-medium">
                {isEditMode ? 'Cohort Status' : 'Audit Status'}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-outline-variant font-body-sm text-body-sm text-on-surface bg-surface-container-lowest">
            {filteredRoster.map((student) => {
              const isChecked =
                scope === 'all' || selectedStudentIds.includes(student.id);

              return (
                <TableRow
                  key={student.id}
                  className="border-b-0 hover:bg-surface-container-low transition-colors"
                >
                  <TableCell className="py-2.5 px-3 text-center [&:has([role=checkbox])]:pr-3">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => {
                        if (scope === 'all') {
                          onScopeChange('selected');
                          onSelectedChange(
                            roster
                              .filter((rosterStudent) => rosterStudent.id !== student.id)
                              .map((rosterStudent) => rosterStudent.id)
                          );
                        } else {
                          handleToggle(student.id);
                        }
                      }}
                      className="student-checkbox cursor-pointer"
                      aria-label={`Select ${student.name}`}
                    />
                  </TableCell>
                  <TableCell className="py-2.5 px-3 font-semibold text-primary">
                    {student.name}
                  </TableCell>
                  <TableCell className="py-2.5 px-3 font-label-code text-label-code text-on-surface-variant">
                    {student.studentId}
                  </TableCell>
                  <TableCell className="py-2.5 px-3 font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant">
                    {student.section}
                  </TableCell>
                  <TableCell className="py-2.5 px-3">
                    {student.isHonors ? (
                      <Badge className="font-label-mono-xs text-label-mono-xs px-1.5 py-0.5 bg-secondary-fixed text-on-secondary-fixed border border-secondary uppercase font-semibold rounded-none h-auto">
                        Honors Track
                      </Badge>
                    ) : (
                      <Badge className="font-label-mono-xs text-label-mono-xs px-1.5 py-0.5 bg-surface-container text-on-surface uppercase rounded-none border-0 h-auto font-normal">
                        Regular Standing
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-2.5 px-3 text-right">
                    {isChecked ? (
                      <span className="font-label-mono-xs text-label-mono-xs text-on-tertiary-container uppercase font-semibold">
                        ● Allocated
                      </span>
                    ) : (
                      <span className="font-label-mono-xs text-label-mono-xs text-outline uppercase font-semibold">
                        Exempt / Unassigned
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Table Summary Footbar */}
        <div className="p-space-sm bg-surface-container-high border-t border-outline-variant flex items-center justify-between font-label-mono-xs text-label-mono-xs text-on-surface-variant">
          <span>Displaying 8 Roster Nodes in Preview Buffer (20 Additional in Register)</span>
          <span className="uppercase font-semibold">
            {isEditMode
              ? 'SCOPE STATUS: TARGETED COHORT ACTIVE'
              : 'FILTER STATE: TARGETED COHORT BUFFER ACTIVE'}
          </span>
        </div>
      </div>
    </section>
  );
};
