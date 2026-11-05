import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface DeleteModalProps {
  isOpen: boolean;
  assignmentTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  assignmentTitle,
  onClose,
  onConfirm,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <AlertDialogContent
        overlayClassName="bg-primary/40 backdrop-blur-sm"
        className="!max-w-lg w-full !rounded-none bg-surface-container-lowest p-space-lg border border-outline-variant space-y-space-md shadow-2xl !ring-0 !gap-0"
      >
        <div className="flex items-center gap-space-xs text-error">
          <span className="material-symbols-outlined text-[24px]">warning</span>
          <AlertDialogTitle className="font-headline-md text-headline-md uppercase tracking-tight font-semibold text-error">
            Confirm Irreversible Deletion
          </AlertDialogTitle>
        </div>

        <AlertDialogDescription className="font-body-md text-body-md text-on-surface leading-relaxed">
          You are about to permanently remove{' '}
          <strong className="text-primary font-semibold">{assignmentTitle}</strong>.
          This action will detach all student Drive links and remove the record from the faculty ledger.
        </AlertDialogDescription>

        <div className="p-space-sm bg-error-container text-on-error-container font-label-mono-xs text-label-mono-xs font-medium">
          SECURITY PROTOCOL: RECORD DELETION REQUIRES SUPERVISORY NOTIFICATION UNDER SEC-882-B.
        </div>

        <div className="flex items-center justify-end gap-space-sm pt-space-xs">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="px-space-md py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-code text-label-code uppercase transition-colors cursor-pointer rounded-none border-0 h-auto font-normal shadow-none"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            className="px-space-md py-2 bg-error hover:bg-error/90 text-on-error font-label-code text-label-code uppercase flex items-center gap-1 transition-colors cursor-pointer rounded-none border-0 h-auto font-normal shadow-none"
          >
            <span className="material-symbols-outlined text-[16px]">delete_forever</span>
            <span>Confirm Delete</span>
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
