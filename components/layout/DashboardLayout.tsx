
// src/components/layouts/DashboardLayout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getUserRole, logout } from '../../lib/api';
import { AdminSidebar } from './AdminSidebar';
import { EducatorSidebar } from './EducatorSidebar';
import { StudentSidebar } from './StudentSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/');
      return;
    }

    // Get and set user role
    const role = getUserRole();
    setUserRole(role);

    // Validate role
    if (!role) {
      logout();
      router.push('/');
    }
  }, [router]);

  // Render appropriate sidebar based on user role
  const renderSidebar = () => {
    switch (userRole) {
      case 'admin':
        return <AdminSidebar />;
      case 'educator':
        return <EducatorSidebar />;
      case 'student':
        return <StudentSidebar />;
      default:
        return null;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      {renderSidebar()}

      {/* Main Content Area */}
      <main className="flex ml-4 p-6 bg-gray-100 min-h-screen">
        {children}
      </main>
    </div>
  );
}
