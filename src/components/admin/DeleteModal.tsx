import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DeleteModalProps {
  isOpen: boolean;
  assignmentTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteModal = ({
  isOpen,
  assignmentTitle,
  onClose,
  onConfirm,
}: DeleteModalProps) => {
  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <AlertDialogContent
        overlayClassName="bg-primary/40 backdrop-blur-sm"
        className="!max-w-lg w-[calc(100%-2rem)] sm:w-full !rounded-none bg-surface-container-lowest p-4 sm:p-space-lg border border-outline-variant space-y-space-md shadow-2xl !ring-0 !gap-0"
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

        <Alert
          variant="destructive"
          className="p-space-sm bg-error-container text-on-error-container font-label-mono-xs text-label-mono-xs font-medium rounded-none border-0 shadow-none"
        >
          <AlertDescription className="font-label-mono-xs text-label-mono-xs font-medium text-inherit">
            SECURITY PROTOCOL: RECORD DELETION REQUIRES SUPERVISORY NOTIFICATION UNDER SEC-882-B.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-space-sm pt-space-xs">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto px-space-md py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-code text-label-code uppercase transition-colors cursor-pointer rounded-none border-0 h-auto font-normal shadow-none"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            className="w-full sm:w-auto px-space-md py-2 bg-error hover:bg-error/90 text-on-error font-label-code text-label-code uppercase flex items-center justify-center gap-1 transition-colors cursor-pointer rounded-none border-0 h-auto font-normal shadow-none"
          >
            <span className="material-symbols-outlined text-[16px]">delete_forever</span>
            <span>Confirm Delete</span>
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
