"use client"
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  User as UserIcon, 
  Settings, 
  CreditCard, 
  Bell, 
  LogOut 
} from 'lucide-react';

import { User } from '../../types';
import { getLoggedInUser } from '../../lib/api';

import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { StudentSidebar } from '../../components/layout/StudentSidebar';
import { EducatorSidebar } from '../../components/layout/EducatorSidebar';

const UserProfilePage: React.FC = () => {
  const user = getLoggedInUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => {
    getLoggedInUser();
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading user data...
      </div>
    );
  }

  // Determine sidebar and color scheme based on role
  const renderSidebar = () => {
    switch(user.role) {
      case 'admin':
        return <AdminSidebar/>;
      case 'educator':
        return <EducatorSidebar/>;
      case 'student':
        return <StudentSidebar/>;
      default:
        return null;
    }
  };

  const getProfileColorScheme = () => {
    switch(user.role) {
      case 'admin':
        return {
          headerBg: 'bg-indigo-100',
          headerText: 'text-indigo-800',
          buttonBg: 'bg-indigo-500',
          buttonHoverBg: 'hover:bg-indigo-600'
        };
      case 'educator':
        return {
          headerBg: 'bg-emerald-100',
          headerText: 'text-emerald-800',
          buttonBg: 'bg-emerald-500',
          buttonHoverBg: 'hover:bg-emerald-600'
        };
      case 'student':
        return {
          headerBg: 'bg-sky-100',
          headerText: 'text-sky-800',
          buttonBg: 'bg-sky-500',
          buttonHoverBg: 'hover:bg-sky-600'
        };
      default:
        return {
          headerBg: 'bg-gray-100',
          headerText: 'text-gray-800',
          buttonBg: 'bg-blue-500',
          buttonHoverBg: 'hover:bg-blue-600'
        };
    }
  };

  const colorScheme = getProfileColorScheme();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = async () => {
    if (editedUser) {
      await updateUser(editedUser);
      setIsEditing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100 ml-64">
      {/* Dynamic Sidebar */}
      {renderSidebar()}

      {/* Main Content */}
      <div className="flex-grow p-6">
        <div className={`bg-white shadow-lg rounded-lg ${colorScheme.headerBg}`}>
          <div className="flex">
            {/* Profile Section (Left Side) */}
            <div className="w-1/2 p-8 border-r border-gray-200">
              <h1 className={`text-2xl font-bold mb-6 ${colorScheme.headerText}`}>
                User Profile
              </h1>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="text-lg font-semibold">{user.firstName} {user.lastName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-lg">{user.email}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Age Group</p>
                  <p className="text-lg">{user.ageGroup}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="text-lg">{user.role}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Account Created</p>
                  <p className="text-lg">{formatDate(user.createdAt)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="text-lg">{formatDate(user.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* Edit Section (Right Side) */}
            <div className="w-1/2 p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${colorScheme.headerText}`}>
                  Edit Profile
                </h2>
                {!isEditing ? (
                  <button 
                    onClick={() => {
                      setEditedUser(user);
                      setIsEditing(true);
                    }}
                    className={`px-4 py-2 ${colorScheme.buttonBg} text-white rounded ${colorScheme.buttonHoverBg} transition`}
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="space-x-2">
                    <button 
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => {
                        setEditedUser(null);
                        setIsEditing(false);
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={editedUser?.firstName || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={editedUser?.lastName || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Age Group</label>
                    <select
                      name="ageGroup"
                      value={editedUser?.ageGroup || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    >
                      <option value="18-24">18-24</option>
                      <option value="25-34">25-34</option>
                      <option value="35-44">35-44</option>
                      <option value="45-54">45-54</option>
                      <option value="55+">55+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editedUser?.email || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                  </div>
                </form>
              ) : (
                <div className="text-center text-gray-500 mt-10">
                  Click "Edit Profile" to make changes
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;

async function updateUser(editedUser: User): Promise<void> {
  try {
    const response = await fetch('/api/user/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedUser),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}