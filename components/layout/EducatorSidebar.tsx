// src/components/sidebars/EducatorSidebar.tsx
'use client';

import Link from 'next/link';
import { logout } from '../../lib/api';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  ClipboardList, 
  LogOut, 
  UserRoundIcon
} from 'lucide-react';

export const EducatorSidebar = () => {
  return (
    <div className="w-64 bg-green-800 text-white h-screen fixed left-0 top-0 p-4">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-center">Educator Dashboard</h2>
      </div>
      <nav className="space-y-2">
        <Link 
          href="/dashboard/educator" 
          className="flex items-center p-2 hover:bg-green-700 rounded"
        >
          <LayoutDashboard className="mr-3" />
          Dashboard
        </Link>
       <Link href="/profile" className="flex items-center p-2 hover:bg-green-700 rounded">
       <UserRoundIcon className="mr-3" />
       Profile
       </Link>
        <button 
          onClick={logout} 
          className="flex items-center p-2 hover:bg-green-700 rounded w-full text-left"
        >
          <LogOut className="mr-3" />
          Logout
        </button>
      </nav>
    </div>
  );
};
