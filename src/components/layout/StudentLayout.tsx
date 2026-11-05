import { Outlet } from 'react-router-dom';
import StudentNavbar from '../student/common/StudentNavbar';
import StudentFooter from '../student/common/StudentFooter';
import type { UserAccount } from '../../pages/Auth/authAccounts';

interface StudentLayoutProps {
  currentUser: UserAccount;
  onLogout: () => void;
}

export const StudentLayout = ({ currentUser, onLogout }: StudentLayoutProps) => {
  const standing = currentUser.subtitle.split('·')[0].trim();

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <StudentNavbar
        studentName={currentUser.name}
        studentId={currentUser.id}
        standing={standing}
        onLogout={onLogout}
      />
      <main className="w-full pt-24 min-h-[calc(100vh-4rem)] max-w-[1280px] mx-auto px-gutter bg-surface flex-1">
        <Outlet />
      </main>
      <StudentFooter />
    </div>
  );
};

export default StudentLayout;
