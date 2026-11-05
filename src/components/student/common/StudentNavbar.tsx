import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export interface StudentNavbarProps {
  studentName?: string;
  studentId?: string;
  standing?: string;
  courseTitle?: string;
  onLogout?: () => void;
}

export const StudentNavbar: React.FC<StudentNavbarProps> = ({
  studentName = 'Alex Doe',
  studentId = '#STU-4819',
  standing = 'CS Undergrad',
  onLogout,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest border-b border-surface-dim">
      <div className="h-16 max-w-[1280px] mx-auto px-gutter flex items-center justify-between">
        <div className="flex items-center gap-space-lg">
          <NavLink
            to="/student/dashboard"
            className="flex items-center gap-space-sm text-left cursor-pointer bg-transparent border-0 p-0"
          >
            <span className="font-headline-md text-headline-md tracking-tight text-primary uppercase">
              JOINEAZY
            </span>
            
          </NavLink>

          <div className="h-4 w-px bg-outline-variant hidden sm:block" />

          <nav className="flex items-center gap-space-xs">
            <NavLink
              to="/student/dashboard"
              className={({ isActive }) =>
                `px-space-md py-1.5 rounded-DEFAULT transition-colors font-body-md text-body-md ${
                  isActive
                    ? 'bg-primary text-on-primary font-medium'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`
              }
            >
              My Assignments
            </NavLink>
            
            {onLogout && (
              <Button
                type="button"
                variant="ghost"
                onClick={onLogout}
                className="px-space-md py-1.5 rounded-DEFAULT font-body-md text-body-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer bg-transparent border-0 h-auto shadow-none font-normal"
              >
                Logout
              </Button>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-space-md">
          <div className="hidden md:flex flex-col items-end">
            <span className="font-body-md text-body-md font-semibold text-on-surface">
              {studentName}
            </span>
            <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant">
              {standing} • {studentId}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[18px]">
              person
            </span>
          </div>
        </div>
      </div>

  
    </header>
  );
};

export default StudentNavbar;
