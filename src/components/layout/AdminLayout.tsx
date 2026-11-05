import { Outlet } from 'react-router-dom';
import AdminNavbar from '../admin/common/AdminNavbar';
import type { UserAccount } from '../../pages/Auth/authAccounts';

interface AdminLayoutProps {
  currentUser: UserAccount;
  onLogout: () => void;
}

function AdminLayout({ currentUser, onLogout }: AdminLayoutProps) {
  return (
    <>
      <AdminNavbar currentUser={currentUser} onLogout={onLogout} />
      <main className="pt-[57px]">
        <Outlet />
      </main>
    </>
  );
}

export default AdminLayout;