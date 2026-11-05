import { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { initialAssignments, mockRoster, currentStudent } from './data/mockData';
import type { Assignment, StudentSubmission } from './types';
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
const ASSIGNMENTS_STORAGE_KEY = 'joineazy_assignments';
const SEEDED_ACCOUNTS = [...SEEDED_STUDENT_ACCOUNTS, ...SEEDED_ADMIN_ACCOUNTS];

const dashboardPathForRole = (role: UserRole) =>
  role === 'admin' ? '/assignments' : '/student/dashboard';

const matchesCurrentStudent = (submission: StudentSubmission) =>
  submission.studentId === currentStudent.studentId ||
  submission.name === currentStudent.name ||
  submission.id === `sub-${currentStudent.id}`;

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
      const savedAssignments = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
      if (savedAssignments) {
        return JSON.parse(savedAssignments) as Assignment[];
      }
    } catch (error) {
      console.error('Failed to load assignments from localStorage:', error);
    }
    return initialAssignments;
  });

  useEffect(() => {
    try {
      localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(assignments));
    } catch (error) {
      console.error('Failed to save assignments to localStorage:', error);
    }
  }, [assignments]);

  const handleLogin = (account: UserAccount) => {
    setCurrentUser(account);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(account));
    } catch (error) {
      console.error('Failed to save current user to localStorage:', error);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear current user from localStorage:', error);
    }
    navigate('/login', { replace: true });
  };

  const handleCreateAssignment = (newAssignment: Assignment) => {
    setAssignments((prev) => [newAssignment, ...prev]);
  };

  const handleUpdateAssignment = (updatedAssignment: Assignment) => {
    setAssignments((prev) =>
      prev.map((assignment) =>
        assignment.id === updatedAssignment.id ? updatedAssignment : assignment
      )
    );
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((assignment) => assignment.id !== id));
  };

  const handleSubmitAssignment = (assignmentId: string, timestamp: string) => {
    setAssignments((prev) =>
      prev.map((assignment) => {
        if (assignment.id !== assignmentId) return assignment;

        const existingSubmission = assignment.submissions.find(matchesCurrentStudent);
        let updatedSubmissions: StudentSubmission[];
        let isNewlySubmitted = false;

        if (existingSubmission) {
          if (existingSubmission.status !== 'Submitted') {
            isNewlySubmitted = true;
          }
          updatedSubmissions = assignment.submissions.map((submission) =>
            matchesCurrentStudent(submission)
              ? {
                  ...submission,
                  status: 'Submitted' as const,
                  timestamp,
                }
              : submission
          );
        } else {
          isNewlySubmitted = true;
          updatedSubmissions = [
            ...assignment.submissions,
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
          ...assignment,
          submittedCount: isNewlySubmitted
            ? assignment.submittedCount + 1
            : assignment.submittedCount,
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
