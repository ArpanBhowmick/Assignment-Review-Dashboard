import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export interface SubmissionConfirmModalProps {
  isOpen: boolean;
  assignmentTitle: string;
  assignmentCode?: string;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

export const SubmissionConfirmModal: React.FC<SubmissionConfirmModalProps> = ({
  isOpen,
  assignmentTitle,
  assignmentCode = 'CS101',
  onClose,
  onConfirm,
  isSubmitting = false,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <AlertDialogContent
        overlayClassName="bg-inverse-surface/60 backdrop-blur-sm"
        className="!max-w-lg w-full !rounded-DEFAULT bg-surface-container-lowest p-space-lg border border-surface-dim flex flex-col gap-space-md shadow-lg !ring-0 !gap-0"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-space-xs border-b border-surface-dim">
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-DEFAULT bg-primary text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
            <div>
              <AlertDialogTitle className="font-headline-md text-headline-md font-bold text-on-surface">
                Confirm Assignment Submission
              </AlertDialogTitle>
              <span className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant">
                {assignmentCode} • {assignmentTitle}
              </span>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close modal"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-DEFAULT transition-colors cursor-pointer bg-transparent border-0 h-auto w-auto shadow-none"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </Button>
        </div>

        {/* Modal Body */}
        <AlertDialogDescription className="text-left font-normal" render={<div />}>
          <p className="font-body-md text-body-md text-on-surface font-medium mb-space-sm">
            Are you sure you want to mark this assignment as submitted?
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
            Please ensure you have uploaded your final deliverables to the designated Google Drive folder before proceeding.
          </p>
          <div className="bg-surface-container-low p-space-md rounded-DEFAULT space-y-space-xs font-label-mono-xs text-label-mono-xs text-on-surface">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[15px] text-on-tertiary-container font-bold">
                check
              </span>
              <span>Deliverables placed in Google Drive student folder</span>
            </div>
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[15px] text-on-tertiary-container font-bold">
                check
              </span>
              <span>Submission timestamp will be marked as official</span>
            </div>
          </div>
        </AlertDialogDescription>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-space-sm pt-space-xs mt-space-md">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-space-md py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-code text-label-code uppercase font-semibold rounded-DEFAULT transition-colors order-2 sm:order-1 cursor-pointer border-0 h-auto shadow-none"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="px-space-lg py-2.5 bg-primary hover:bg-surface-tint text-on-primary font-label-code text-label-code uppercase font-bold rounded-DEFAULT flex items-center justify-center gap-1.5 transition-colors order-1 sm:order-2 cursor-pointer border-0 shadow-sm disabled:opacity-50 h-auto"
          >
            <span className="material-symbols-outlined text-[16px]">check</span>
            <span>{isSubmitting ? 'Submitting...' : 'Confirm Submission'}</span>
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SubmissionConfirmModal;
