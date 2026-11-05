import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Assignment } from '../../types';
import { AssignmentCard } from '../../components/admin/AssignmentCard';
import { DeleteModal } from '../../components/admin/DeleteModal';
import { SecurityAuditFooter } from '../../components/admin/common/SecurityAuditFooter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AdminDashboardPageProps {
  assignments: Assignment[];
  onDeleteAssignment: (id: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  assignments,
  onDeleteAssignment,
}) => {
  const navigate = useNavigate();
  const [selectedForDelete, setSelectedForDelete] = useState<Assignment | null>(null);

  const handleDeleteConfirm = () => {
    if (selectedForDelete) {
      onDeleteAssignment(selectedForDelete.id);
      setSelectedForDelete(null);
    }
  };

  const activeCount = assignments.filter((a) => !a.isGraded).length;

  return (
    <div className="max-w-[1280px] mx-auto px-gutter py-space-lg">
        <div className="flex flex-col w-full">
          {/* HEADER & ACTIONS AREA */}
          <div className="pb-8 border-b border-outline-variant flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-1.5">
            
              <h1 className="font-headline-xl text-3xl font-bold text-on-background tracking-tight">
                My Course Assignments
              </h1>
              <p className="font-body-md text-sm text-on-surface-variant max-w-2xl leading-relaxed">
                Manage your active assignments, monitor real-time class submission progress, and review student deliverables for CS101 Distributed Systems.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Badge variant="outline" className="hidden sm:flex items-center text-xs font-label-mono-sm text-on-surface-variant border border-outline-variant bg-surface-container-low px-3 py-2 font-medium rounded-none h-auto">
                <span>{activeCount} ACTIVE ASSIGNMENTS</span>
              </Badge>
              <Button
                type="button"
                variant="default"
                onClick={() => navigate('/new-assignment')}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary hover:bg-surface-tint font-label-mono-sm text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm cursor-pointer rounded-none h-auto font-normal"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>+ New Assignment</span>
              </Button>
            </div>
          </div>

          {/* ASSIGNMENT CARDS LIST */}
          <div className="flex flex-col gap-10 mt-8">
            {assignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onEdit={(a) => navigate(`/edit/${a.id}`)}
                onDelete={(a) => setSelectedForDelete(a)}
              />
            ))}
          </div>

          {/* SECURITY & AUDIT FOOTER STRIP */}
          <SecurityAuditFooter />
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteModal
          isOpen={Boolean(selectedForDelete)}
          assignmentTitle={selectedForDelete?.title || ''}
          onClose={() => setSelectedForDelete(null)}
          onConfirm={handleDeleteConfirm}
        />
    </div>
  );
};
