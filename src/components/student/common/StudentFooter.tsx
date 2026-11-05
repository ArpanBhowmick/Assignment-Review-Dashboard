export interface StudentFooterProps {
  studentId: string;
  className?: string;
}

export const StudentFooter = ({
  studentId,
  className = '',
}: StudentFooterProps) => {
  const indexReference = studentId.replace(/^#?STU-/, '');

  return (
    <footer className={`w-full border-t border-surface-dim bg-surface-container-lowest mt-space-xl ${className}`}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-gutter py-space-md flex flex-col md:flex-row items-center justify-between gap-space-sm font-label-mono-xs text-label-mono-xs text-on-surface-variant text-center md:text-left">
        <div>
          JOINEAZY ACADEMIC SYSTEMS • CS DEPARTMENT CORE INFRASTRUCTURE | STUDENT ASSIGNMENT PORTAL
        </div>
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 sm:gap-space-md">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-container inline-block shrink-0" />
            <span>SYSTEM VERIFIED • REF: SEC-994-S</span>
          </span>
          <span className="text-outline hidden sm:inline">|</span>
          <span className="break-all sm:break-normal">INDEX REF: ARCH-2026-CS101-STUDENT-{indexReference}</span>
        </div>
      </div>
    </footer>
  );
};

export default StudentFooter;
