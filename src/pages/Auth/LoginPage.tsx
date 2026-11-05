import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  type UserRole,
  SEEDED_STUDENT_ACCOUNTS,
  SEEDED_ADMIN_ACCOUNTS,
  type UserAccount,
} from './authAccounts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface LoginPageProps {
  currentUser?: UserAccount | null;
  onSelectAccount?: (account: UserAccount) => void;
  defaultRole?: UserRole;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSelectAccount,
  defaultRole = 'student',
}) => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    defaultRole === 'student' ? SEEDED_STUDENT_ACCOUNTS[0].id : SEEDED_ADMIN_ACCOUNTS[0].id
  );
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const activeAccounts = role === 'student' ? SEEDED_STUDENT_ACCOUNTS : SEEDED_ADMIN_ACCOUNTS;
  const selectedAccount =
    activeAccounts.find((acc) => acc.id === selectedAccountId) || activeAccounts[0];

  const handleRoleChange = (newRole: UserRole) => {
    if (newRole === role) return;
    setRole(newRole);
    const newAccounts = newRole === 'student' ? SEEDED_STUDENT_ACCOUNTS : SEEDED_ADMIN_ACCOUNTS;
    setSelectedAccountId(newAccounts[0].id);
  };

  const handleContinue = () => {
    if (!selectedAccount || isAuthenticating) return;

    setIsAuthenticating(true);
    setShowNotification(true);

    if (onSelectAccount) {
      onSelectAccount(selectedAccount);
    }

    // Save active auth session to localStorage for persistence
    try {
      localStorage.setItem('joineazy_auth_user', JSON.stringify(selectedAccount));
    } catch {
      // ignore storage errors
    }

    // Smooth authentication transition
    setTimeout(() => {
      if (selectedAccount.role === 'admin') {
        navigate('/assignments');
      } else {
        navigate('/student/dashboard');
      }
    }, 900);
  };

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col selection:bg-primary selection:text-white">
      {/* Fixed Top Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-surface-container-lowest border-b border-outline-variant">
        <div className="h-16 max-w-[1280px] mx-auto px-gutter flex items-center justify-between">
          <div className="flex items-center gap-space-md">
            <span className="font-headline-md text-headline-md tracking-tight text-on-surface uppercase font-bold">
              JOINEAZY
            </span>
            <div className="h-4 w-px bg-outline-variant hidden sm:block" />
            <span className="font-body-sm text-body-sm text-on-surface-variant font-medium hidden sm:inline">
              Assignment &amp; Peer Review System
            </span>
          </div>
          <div className="flex items-center gap-space-sm">
            
          </div>
        </div>
      </header>

      {/* Main Role Selection Area */}
      <main className="w-full pt-24 pb-12 bg-background flex-1 flex items-center justify-center">
        <div className="w-full max-w-[640px] px-4 py-8 flex flex-col gap-6">
          {/* Welcome Title Block */}
          <div className="text-center flex flex-col items-center gap-2">
            <div className="w-11 h-11 rounded-lg bg-primary text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[22px]">school</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight uppercase font-bold">
              Welcome to Joineazy
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Sign in to access your assignment dashboard.
            </p>
          </div>

          {/* Role & Account Selection Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
            {/* Role Toggle Selector */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant font-semibold tracking-wider">
                  Select Role
                </span>
                <Badge variant="outline" className="font-label-mono-xs text-label-mono-xs uppercase px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant font-medium border-0 h-auto">
                  {role === 'student' ? 'Role: Student' : 'Role: Admin (Professor)'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 p-1 bg-surface-container-low rounded-lg border border-outline-variant">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleRoleChange('student')}
                  className={`py-2.5 px-3 rounded font-label-code text-label-code uppercase transition-all flex items-center justify-center gap-2 cursor-pointer border-0 h-auto shadow-none ${
                    role === 'student'
                      ? 'bg-primary text-white font-semibold shadow-sm hover:bg-primary hover:text-white'
                      : 'text-on-surface-variant hover:text-on-surface bg-transparent font-semibold'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">person</span>
                  <span>Student</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleRoleChange('admin')}
                  className={`py-2.5 px-3 rounded font-label-code text-label-code uppercase transition-all flex items-center justify-center gap-2 cursor-pointer border-0 h-auto shadow-none ${
                    role === 'admin'
                      ? 'bg-primary text-white font-semibold shadow-sm hover:bg-primary hover:text-white'
                      : 'text-on-surface-variant hover:text-on-surface bg-transparent font-semibold'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">shield_person</span>
                  <span>Admin (Professor)</span>
                </Button>
              </div>
            </div>

            {/* Account Profile List */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant font-semibold tracking-wider">
                  Select Account
                </span>
                <span className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant font-medium">
                  {activeAccounts.length} PROFILES AVAILABLE
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {activeAccounts.map((account) => {
                  const isSelected = selectedAccount.id === account.id;
                  return (
                    <div
                      key={account.id}
                      onClick={() => setSelectedAccountId(account.id)}
                      className={`cursor-pointer border rounded-lg p-3 sm:p-3.5 flex items-center justify-between transition-all duration-150 ${
                        isSelected
                          ? 'border-primary bg-surface-container-low shadow-sm ring-1 ring-primary/20'
                          : 'border-outline-variant hover:border-slate-400 bg-white hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-headline-md text-[13px] font-bold tracking-tight transition-colors ${
                            isSelected ? 'bg-primary text-white' : 'bg-surface-container text-on-surface'
                          }`}
                        >
                          {account.initials}
                        </div>

                        <div className="flex flex-col min-w-0 text-left">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-headline-md text-on-surface text-[14px] font-semibold truncate">
                              {account.name}
                            </span>
                            <Badge
                              className={`font-label-mono-xs text-label-mono-xs uppercase px-1.5 py-0.5 rounded font-medium h-auto ${
                                account.role === 'admin'
                                  ? 'bg-secondary/10 text-secondary border border-secondary/20'
                                  : 'bg-surface-container-low text-on-surface-variant border border-outline-variant'
                              }`}
                            >
                              {account.id}
                            </Badge>
                          </div>
                          <span className="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">
                            {account.subtitle}
                          </span>
                        </div>
                      </div>

                      {/* Radio Selection Indicator */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ml-2 ${
                          isSelected ? 'border-primary bg-primary' : 'border-outline-variant bg-transparent'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full bg-white transition-transform ${
                            isSelected ? 'scale-100' : 'scale-0'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Continue Action */}
            <div className="flex flex-col gap-3 pt-1">
              <Button
                type="button"
                variant="default"
                onClick={handleContinue}
                disabled={isAuthenticating}
                className="w-full bg-black hover:bg-slate-800 text-white py-3.5 px-5 rounded-lg font-label-code text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm font-semibold active:scale-[0.99] cursor-pointer border-0 disabled:opacity-75 h-auto"
              >
                <span className="text-white">
                  {isAuthenticating
                    ? 'Authenticating Session...'
                    : `Continue as ${selectedAccount.name} →`}
                </span>
                <span
                  className={`material-symbols-outlined text-[18px] text-white ${
                    isAuthenticating ? 'animate-spin' : ''
                  }`}
                >
                  {isAuthenticating ? 'progress_activity' : 'arrow_forward'}
                </span>
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-center text-on-surface-variant font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-[15px] text-secondary">info</span>
                <span>Sandbox Mode: Instant authentication into the selected user session.</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Authentication Floating Toast Notification */}
      <div
        className={`fixed bottom-6 right-6 max-w-md bg-white border border-outline-variant shadow-xl rounded-xl p-4 transition-all duration-300 z-50 flex items-start gap-3 ${
          showNotification
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : 'translate-y-24 opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`w-9 h-9 rounded-full text-white shrink-0 flex items-center justify-center font-bold text-xs mt-0.5 ${
            selectedAccount.role === 'admin' ? 'bg-secondary' : 'bg-primary'
          }`}
        >
          {selectedAccount.initials}
        </div>
        <div className="flex-1">
          <h4 className="font-headline-md text-[14px] leading-tight font-bold text-on-surface">
            {selectedAccount.role === 'admin'
              ? 'Launching Admin Dashboard'
              : 'Launching Student Dashboard'}
          </h4>
          <p className="font-body-sm text-on-surface-variant mt-0.5 text-xs">
            Redirecting {selectedAccount.name} ({selectedAccount.id}) to active session...
          </p>
          <div className="w-full bg-surface-container rounded-full h-1 mt-2.5 overflow-hidden">
            <div className="bg-secondary h-full w-full animate-pulse" />
          </div>
        </div>
        <span className="material-symbols-outlined text-outline text-[18px]">open_in_new</span>
      </div>

      {/* Institutional Footer */}
      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant">
        <div className="h-16 max-w-[1280px] mx-auto px-gutter flex items-center justify-between flex-wrap gap-space-sm">
          <span className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant">
            © 2024 JOINEAZY ACADEMIC SYSTEMS • CS DEPARTMENT CORE INFRASTRUCTURE
          </span>
          <span className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant">
            AUTHENTICATION SANDBOX ENVIRONMENT
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
