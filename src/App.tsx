import { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { initialAssignments, mockRoster, currentStudent } from './data/mockData';
import type { Assignment } from './types';
import AdminLayout from './components/layout/AdminLayout';
import StudentLayout from './components/layout/StudentLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { CreateAssignmentPage } from './pages/admin/CreateAssignmentPage';
import { EditAssignmentPage } from './pages/admin/EditAssignmentPage';
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { AssignmentDetailsPage } from './pages/student/AssignmentDetailsPage';
import LoginPage from './pages/Auth/LoginPage';
import {
  SEEDED_ADMIN_ACCOUNTS,
  SEEDED_STUDENT_ACCOUNTS,
  type UserAccount,
  type UserRole,
} from './pages/Auth/authAccounts';

const AUTH_STORAGE_KEY = 'joineazy_auth_user';
const SEEDED_ACCOUNTS = [...SEEDED_STUDENT_ACCOUNTS, ...SEEDED_ADMIN_ACCOUNTS];

const dashboardPathForRole = (role: UserRole) =>
  role === 'admin' ? '/assignments' : '/student/dashboard';

const readStoredAccount = (): UserAccount | null => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;

    const saved = JSON.parse(raw) as Partial<UserAccount> | null;
    if (
      !saved ||
      typeof saved.id !== 'string' ||
      (saved.role !== 'student' && saved.role !== 'admin')
    ) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    const account = SEEDED_ACCOUNTS.find(
      (candidate) => candidate.id === saved.id && candidate.role === saved.role
    );

    if (!account) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    return account;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(readStoredAccount);
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    try {
      const saved = localStorage.getItem('joineazy_assignments');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load assignments from localStorage:', e);
    }
    return initialAssignments;
  });

  useEffect(() => {
    try {
      localStorage.setItem('joineazy_assignments', JSON.stringify(assignments));
    } catch (e) {
      console.error('Failed to save assignments to localStorage:', e);
    }
  }, [assignments]);

  const handleLogin = (account: UserAccount) => {
    setCurrentUser(account);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(account));
    } catch (e) {
      console.error('Failed to save current user to localStorage:', e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear current user from localStorage:', e);
    }
    navigate('/login', { replace: true });
  };

  const handleCreateAssignment = (newAssignment: Assignment) => {
    setAssignments((prev) => [newAssignment, ...prev]);
  };

  const handleUpdateAssignment = (updatedAssignment: Assignment) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === updatedAssignment.id ? updatedAssignment : a))
    );
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmitAssignment = (assignmentId: string, timestamp: string) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id !== assignmentId) return a;

        const existingSubmission = a.submissions.find(
          (s) =>
            s.studentId === currentStudent.studentId ||
            s.name === currentStudent.name ||
            s.id === `sub-${currentStudent.id}`
        );

        let updatedSubmissions: typeof a.submissions;
        let isNewlySubmitted = false;

        if (existingSubmission) {
          if (existingSubmission.status !== 'Submitted') {
            isNewlySubmitted = true;
          }
          updatedSubmissions = a.submissions.map((s) => {
            if (
              s.studentId === currentStudent.studentId ||
              s.name === currentStudent.name ||
              s.id === `sub-${currentStudent.id}`
            ) {
              return {
                ...s,
                status: 'Submitted' as const,
                timestamp,
              };
            }
            return s;
          });
        } else {
          isNewlySubmitted = true;
          updatedSubmissions = [
            ...a.submissions,
            {
              id: `sub-${currentStudent.id}`,
              name: currentStudent.name,
              studentId: currentStudent.studentId,
              status: 'Submitted' as const,
              timestamp,
            },
          ];
        }

        return {
          ...a,
          submittedCount: isNewlySubmitted ? a.submittedCount + 1 : a.submittedCount,
          submissions: updatedSubmissions,
        };
      })
    );
  };

  const roleHome = currentUser ? dashboardPathForRole(currentUser.role) : '/login';

  return (
    <Routes>
      <Route path="/" element={<Navigate to={roleHome} replace />} />
      <Route
        path="/login"
        element={
          <LoginPage currentUser={currentUser} onSelectAccount={handleLogin} />
        }
      />

      {/* Admin Protected / Role-based Routes */}
      <Route
        element={
          currentUser?.role === 'admin' ? (
            <AdminLayout currentUser={currentUser} onLogout={handleLogout} />
          ) : (
            <Navigate to={roleHome} replace />
          )
        }
      >
        <Route
          path="/assignments"
          element={
            <AdminDashboardPage
              assignments={assignments}
              onDeleteAssignment={handleDeleteAssignment}
            />
          }
        />
        <Route
          path="/new-assignment"
          element={
            <CreateAssignmentPage
              roster={mockRoster}
              onCreateAssignment={handleCreateAssignment}
            />
          }
        />
        <Route
          path="/edit/:assignmentId"
          element={
            <EditAssignmentPage
              assignments={assignments}
              roster={mockRoster}
              onUpdateAssignment={handleUpdateAssignment}
              onDeleteAssignment={handleDeleteAssignment}
            />
          }
        />
      </Route>

      {/* Student Portal Routes */}
      <Route
        element={
          currentUser?.role === 'student' ? (
            <StudentLayout currentUser={currentUser} onLogout={handleLogout} />
          ) : (
            <Navigate to={roleHome} replace />
          )
        }
      >
        <Route
          path="/student/dashboard"
          element={
            <StudentDashboardPage
              assignments={assignments}
              currentStudent={currentStudent}
            />
          }
        />
        <Route
          path="/student/assignments/:id"
          element={
            <AssignmentDetailsPage
              assignments={assignments}
              currentStudent={currentStudent}
              onSubmitAssignment={handleSubmitAssignment}
            />
          }
        />
      </Route>

      <Route path="*" element={<Navigate to={roleHome} replace />} />
    </Routes>
  );
}

export default App;
