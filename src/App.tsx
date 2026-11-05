import { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useNavigationLock } from './hooks/useNavigationLock';
import { initialAssignments, mockRoster } from './data/mockData';
import type { Assignment, StudentSubmission } from './types';
import AdminLayout from './components/layout/AdminLayout';
import StudentLayout from './components/layout/StudentLayout';
import { StudentIdentityUnavailable } from './components/student/StudentIdentityUnavailable';
import {
  getStudentSubmission,
  isAssignmentAssignedToStudent,
} from './components/student/studentUtils';
import { synchronizeAssignment } from './lib/assignmentScope';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { CreateAssignmentPage } from './pages/admin/CreateAssignmentPage';
import { EditAssignmentPage } from './pages/admin/EditAssignmentPage';
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { AssignmentDetailsPage } from './pages/student/AssignmentDetailsPage';
import LoginPage from './pages/Auth/LoginPage';
import {
  resolveStudentForAccount,
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
  useNavigationLock();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(readStoredAccount);
  const currentStudent = resolveStudentForAccount(currentUser, mockRoster);
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    let storedAssignments = initialAssignments;

    try {
      const savedAssignments = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
      if (savedAssignments) {
        storedAssignments = JSON.parse(savedAssignments) as Assignment[];
      }
    } catch (error) {
      console.error('Failed to load assignments from localStorage:', error);
    }

    return storedAssignments.map((assignment) =>
      synchronizeAssignment(assignment, mockRoster)
    );
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
    setAssignments((prev) => [
      synchronizeAssignment(newAssignment, mockRoster),
      ...prev,
    ]);
  };

  const handleUpdateAssignment = (updatedAssignment: Assignment) => {
    setAssignments((prev) =>
      prev.map((assignment) =>
        assignment.id === updatedAssignment.id
          ? synchronizeAssignment(updatedAssignment, mockRoster)
          : assignment
      )
    );
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((assignment) => assignment.id !== id));
  };

  const handleSubmitAssignment = (assignmentId: string, timestamp: string) => {
    const submittingStudent = currentStudent;

    setAssignments((prev) =>
      prev.map((assignment) => {
        if (
          !submittingStudent ||
          assignment.id !== assignmentId ||
          !isAssignmentAssignedToStudent(assignment, submittingStudent)
        ) {
          return assignment;
        }

        const existingSubmission = getStudentSubmission(
          assignment,
          submittingStudent
        );
        const updatedSubmissions: StudentSubmission[] = existingSubmission
          ? assignment.submissions.map((submission) =>
              submission === existingSubmission
                ? {
                    ...submission,
                    status: 'Submitted' as const,
                    timestamp,
                  }
                : submission
            )
          : [
              ...assignment.submissions,
              {
                id: `sub-${submittingStudent.id}`,
                name: submittingStudent.name,
                studentId: submittingStudent.studentId,
                status: 'Submitted' as const,
                timestamp,
              },
            ];

        return synchronizeAssignment(
          {
            ...assignment,
            submissions: updatedSubmissions,
          },
          mockRoster
        );
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
          currentUser ? (
            <Navigate to={dashboardPathForRole(currentUser.role)} replace />
          ) : (
            <LoginPage currentUser={currentUser} onSelectAccount={handleLogin} />
          )
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
              roster={mockRoster}
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
            currentStudent ? (
              <StudentLayout
                currentStudent={currentStudent}
                onLogout={handleLogout}
              />
            ) : (
              <StudentIdentityUnavailable onLogout={handleLogout} />
            )
          ) : (
            <Navigate to={roleHome} replace />
          )
        }
      >
        <Route
          path="/student/dashboard"
          element={
            currentStudent ? (
              <StudentDashboardPage
                assignments={assignments}
                currentStudent={currentStudent}
              />
            ) : (
              <StudentIdentityUnavailable onLogout={handleLogout} />
            )
          }
        />
        <Route
          path="/student/assignments/:id"
          element={
            currentStudent ? (
              <AssignmentDetailsPage
                assignments={assignments}
                currentStudent={currentStudent}
                onSubmitAssignment={handleSubmitAssignment}
              />
            ) : (
              <StudentIdentityUnavailable onLogout={handleLogout} />
            )
          }
        />
      </Route>

      <Route path="*" element={<Navigate to={roleHome} replace />} />
    </Routes>
  );
}

export default App;
