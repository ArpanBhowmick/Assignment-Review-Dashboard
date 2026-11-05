import React from 'react';

export interface StudentFooterProps {
  className?: string;
}

export const StudentFooter: React.FC<StudentFooterProps> = ({ className = '' }) => {
  return (
    <footer className={`w-full border-t border-surface-dim bg-surface-container-lowest mt-space-xl ${className}`}>
      <div className="max-w-[1280px] mx-auto px-gutter py-space-md flex flex-col md:flex-row items-center justify-between gap-space-sm font-label-mono-xs text-label-mono-xs text-on-surface-variant">
        <div>
          JOINEAZY ACADEMIC SYSTEMS • CS DEPARTMENT CORE INFRASTRUCTURE | STUDENT ASSIGNMENT PORTAL
        </div>
        <div className="flex items-center gap-space-md">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-container inline-block" />
            SYSTEM VERIFIED • REF: SEC-994-S
          </span>
          <span className="text-outline">|</span>
          <span>INDEX REF: ARCH-2026-CS101-STUDENT-4819</span>
        </div>
      </div>
    </footer>
  );
};

export default StudentFooter;
