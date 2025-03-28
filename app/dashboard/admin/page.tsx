'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BookOpen, 
  Users, 
  Globe, 
  BarChart2, 
  LogOut, 
  Menu,
  Home,
  Settings,
  BookUser,
  X
} from 'lucide-react';
import Link from 'next/link';

import { User, CourseType } from '../../../types';
import { coursesApi } from '../../../lib/courses';
import { getLoggedInUser, logout } from '../../../lib/api';
import { getAllTeachers, getAllStudents } from '../../../lib/api';
import { AdminSidebar } from '../../../components/layout/AdminSidebar';

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get logged-in user
  const loggedInUser = getLoggedInUser();

  // Fetch teachers using React Query
  const {
    data: teachers = [],
    isLoading: isTeachersLoading
  } = useQuery<User[]>({
    queryKey: ['teachers'],
    queryFn: getAllTeachers
  });

  // Fetch students using React Query
  const {
    data: students = [],
    isLoading: isStudentsLoading
  } = useQuery<User[]>({
    queryKey: ['students'],
    queryFn: getAllStudents
  });

  const {
    data: courses = [],
    isLoading: isCoursesLoading
  } = useQuery<CourseType[]>({
    queryKey: ['courses'],
    queryFn: () => coursesApi.findAll().then(res => res.data)
  });

  // Loading state
  const isLoading = isTeachersLoading || isStudentsLoading || isCoursesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 text-gray-800 flex items-center justify-center">
        <div className="animate-pulse text-blue-600 text-2xl">
          Loading admin dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex">
      <AdminSidebar />

      <main className="flex-1 bg-white p-8 md:ml-64">
        <header className="md:hidden flex justify-between items-center mb-8">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-blue-600"
          >
            <Menu size={30} />
          </button>
          <div className="flex items-center">
            <Globe className="text-blue-600 mr-2" size={30} />
            <span className="text-xl font-bold text-blue-600">DIID Admin</span>
          </div>
        </header>

        <section>
          <h1 className="text-3xl font-bold text-blue-600 mb-8">Dashboard Overview</h1>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white shadow-md rounded-xl p-6 flex items-center justify-between border border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-blue-600 mb-2">Total Courses</h3>
                <p className="text-3xl font-bold text-gray-800">{courses.length}</p>
              </div>
              <BookOpen className="text-blue-500" size={40} />
            </div>

            <div className="bg-white shadow-md rounded-xl p-6 flex items-center justify-between border border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-blue-600 mb-2">Total Students</h3>
                <p className="text-3xl font-bold text-gray-800">{students.length}</p>
              </div>
              <Users className="text-blue-500" size={40} />
            </div>

            <div className="bg-white shadow-md rounded-xl p-6 flex items-center justify-between border border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-blue-600 mb-2">Total Teachers</h3>
                <p className="text-3xl font-bold text-gray-800">{teachers.length}</p>
              </div>
              <BookUser className="text-blue-500" size={40} />
            </div>

            <div className="bg-white shadow-md rounded-xl p-6 flex items-center justify-between border border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-blue-600 mb-2">Active Courses</h3>
                <p className="text-3xl font-bold text-gray-800">
                  {courses.filter((course:CourseType) => course.status === 'ACTIVE').length}
                </p>
              </div>
              <BarChart2 className="text-blue-500" size={40} />
            </div>
          </div>

          <section className="mt-12">
            <h2 className="text-2xl font-bold text-blue-600 mb-6">Recent Courses</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 6).map((course: CourseType) => (
                <div 
                  key={course.id} 
                  className="bg-white shadow-md rounded-xl p-6 transform hover:scale-105 transition border border-gray-200"
                >
                  <BookOpen className="text-blue-500 mb-4" size={40} />
                  <h4 className="text-xl font-bold text-blue-600 mb-2">
                    {course.title}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    {course.description || 'No description available'}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-500 font-semibold">
                      {course.status || 'Draft'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;