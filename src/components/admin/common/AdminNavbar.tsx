import { NavLink } from 'react-router-dom';
import type { UserAccount } from '../../../pages/Auth/authAccounts';
import { Button } from '@/components/ui/button';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-1.5 sm:px-space-sm py-1 font-body-sm text-xs sm:text-body-sm transition-colors whitespace-nowrap ${
    isActive
      ? 'bg-primary text-on-primary font-medium'
      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
  }`;

interface AdminNavbarProps {
  currentUser: UserAccount;
  onLogout: () => void;
}

export const AdminNavbar = ({ currentUser, onLogout }: AdminNavbarProps) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-lowest border-b border-outline-variant">
      {/* Main Header Bar */}
      <div className="h-14 max-w-[1280px] mx-auto px-2 sm:px-gutter flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-space-lg min-w-0">
          <NavLink
            to="/assignments"
            className="flex items-center gap-space-xs text-left cursor-pointer bg-transparent border-0 p-0 shrink-0"
          >
            <span className="font-headline-md text-headline-md tracking-tight uppercase text-primary">
              JOINEAZY
            </span>
            
          </NavLink>

          <div className="h-4 w-px bg-outline-variant hidden sm:block shrink-0" />

          <nav className="flex items-center gap-1 sm:gap-space-xs">
            <NavLink to="/assignments" className={navLinkClass}>
              Assignments
            </NavLink>
            <NavLink to="/new-assignment" className={navLinkClass}>
              + New Assignment
            </NavLink>
            <Button
              type="button"
              variant="ghost"
              onClick={onLogout}
              className="px-1.5 sm:px-space-sm py-1 font-body-sm text-xs sm:text-body-sm transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface cursor-pointer bg-transparent border-0 rounded-none h-auto shadow-none font-normal"
            >
              Logout
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-space-md shrink-0">
          <div className="hidden sm:flex flex-col items-end leading-none">
            <span className="font-body-sm text-body-sm text-on-surface font-semibold">
              {currentUser.name}
            </span>
            <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase tracking-wider">
              {currentUser.id}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-primary text-[18px]">
              person
            </span>
          </div>
        </div>
      </div>
      
    </header>
  );
};

export default AdminNavbar;
