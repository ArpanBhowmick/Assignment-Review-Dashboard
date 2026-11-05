import { Button } from '@/components/ui/button';

export interface StudentIdentityUnavailableProps {
  onLogout: () => void;
}

export const StudentIdentityUnavailable = ({
  onLogout,
}: StudentIdentityUnavailableProps) => {
  return (
    <div className="min-h-screen bg-surface px-4 sm:px-gutter flex items-center justify-center">
      <div className="max-w-3xl w-full bg-surface-container-lowest border border-surface-dim p-6 sm:p-space-xl text-center">
        <span className="material-symbols-outlined text-[48px] text-error mb-2">
          error_outline
        </span>
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">
          Student Profile Unavailable
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">
          Your account is not linked to a student roster record. Contact the
          course administrator before continuing.
        </p>
        <Button
          type="button"
          variant="default"
          onClick={onLogout}
          className="px-space-md py-2 bg-primary text-on-primary font-label-code text-label-code uppercase tracking-wider cursor-pointer border-0 rounded-none h-auto shadow-none font-normal"
        >
          Return to Login
        </Button>
      </div>
    </div>
  );
};

export default StudentIdentityUnavailable;
