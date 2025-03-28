'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getUserRole, logout } from '../../lib/api';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Check authentication and role
    if (!isAuthenticated()) {
      router.push('/');
      return;
    }

    const userRole = getUserRole();
    if (userRole !== 'user') {
      logout(); // Logout if not a user
    }
  }, [router]);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">User Dashboard</h1>
      <button 
        onClick={logout} 
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
