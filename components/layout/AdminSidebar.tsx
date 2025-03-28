'use client';
import { logout } from '../../lib/api';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  UserIcon
} from 'lucide-react';

export const AdminSidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen fixed left-0 top-0 p-4">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-center">Admin Panel</h2>
      </div>
      <nav className="space-y-2">
        <Link 
          href="/dashboard/admin" 
          className="flex items-center p-2 hover:bg-gray-700 rounded"
        >
          <LayoutDashboard className="mr-3" />
          Dashboard
        </Link>
        <Link 
          href="/users" 
          className="flex items-center p-2 hover:bg-gray-700 rounded"
        >
          <Users className="mr-3" />
          User Management
        </Link>

        <Link 
          href="/courses" 
          className="flex items-center p-2 hover:bg-gray-700 rounded"
        >
          <Users className="mr-3" />
          Courses
        </Link>

        <Link 
          href="/profile" 
          className="flex items-center p-2 hover:bg-gray-700 rounded"
        >
          <UserIcon className="mr-3" />
          Profile
        </Link>
      
        <button 
          onClick={logout} 
          className="flex items-center p-2 hover:bg-gray-700 rounded w-full text-left"
        >
          <LogOut className="mr-3" />
          Logout
        </button>
      </nav>
    </div>
  );
};

