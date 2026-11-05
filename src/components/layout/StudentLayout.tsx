import { Outlet } from 'react-router-dom';
import StudentNavbar from '../student/common/StudentNavbar';
import StudentFooter from '../student/common/StudentFooter';
import type { RosterStudent } from '../../types';

interface StudentLayoutProps {
  currentStudent: RosterStudent;
  onLogout: () => void;
}

export const StudentLayout = ({
  currentStudent,
  onLogout,
}: StudentLayoutProps) => {
  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <StudentNavbar
        studentName={currentStudent.name}
        studentId={currentStudent.studentId}
        standing={currentStudent.standing}
        onLogout={onLogout}
      />
      <main className="w-full pt-20 sm:pt-24 min-h-[calc(100vh-4rem)] max-w-[1280px] mx-auto px-4 sm:px-gutter bg-surface flex-1">
        <Outlet />
      </main>
      <StudentFooter studentId={currentStudent.studentId} />
    </div>
  );
};

export default StudentLayout;
