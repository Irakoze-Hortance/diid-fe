'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Book, 
  BookOpen, 
  CalendarDays, 
  Users, 
  LogOut 
} from "lucide-react";

import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Badge } from '../../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "../../../components/ui/dialog";
import { toast } from 'sonner';
import { StudentSidebar } from '../../../components/layout/StudentSidebar';
import { 
  getCoursesByStudent,
  getLoggedInUser, 
} from '../../../lib/api';
import { coursesApi } from '../../../lib/courses';
import { CourseType } from '../../../types';

export default function StudentDashboard() {
  const currentUser = getLoggedInUser()

  const queryClient = useQueryClient();

  const { 
    data: enrolledCourses, 
    isLoading, 
    error 
  } = useQuery<CourseType[]>({
    queryKey: currentUser ? ['student-enrolled-courses', currentUser.id] : [],
    queryFn: () => currentUser ? getCoursesByStudent(currentUser.id) : Promise.reject(new Error("User not logged in")),
    enabled: !!currentUser
  });

  // Unenrollment mutation
  const unenrollMutation = useMutation({
    mutationFn: ({ courseId, studentId }: { courseId: string, studentId: string }) => 
      coursesApi.unenrollStudent(courseId, studentId),
    onSuccess: (_, { courseId }) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ 
        queryKey: ['student-enrolled-courses', currentUser?.id] 
      });
      
      toast.success(`Successfully unenrolled from course`);
    },
    onError: (error) => {
      toast.error(`Failed to unenroll from course: ${error}`);
    }
    });

  // Course Details Dialog Component
  const CourseDetailsDialog = ({ course }: { course: CourseType }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">View Details</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{course.title}</DialogTitle>
          <DialogDescription>{course.description}</DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold flex items-center">
              <BookOpen className="mr-2 h-4 w-4" /> Course Details
            </h3>
            <div className="space-y-2 mt-2">
              <p><strong>Status:</strong> {course.status}</p>
              <p><strong>Max Students:</strong> {course.maxStudents}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold flex items-center">
              <CalendarDays className="mr-2 h-4 w-4" /> Schedule
            </h3>
            <div className="space-y-2 mt-2">
              <p><strong>Start Date:</strong> {course.startDate ? new Date(course.startDate).toLocaleDateString() : 'Not set'}</p>
              <p><strong>End Date:</strong> {course.endDate ? new Date(course.endDate).toLocaleDateString() : 'Not set'}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Unenrollment Confirmation Dialog
  const UnenrollDialog = ({ course }: { course: CourseType }) => {
    const handleUnenroll = () => {
      unenrollMutation.mutate({
        courseId: course.id,
        studentId: currentUser?.id || ''
      });
    };

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm">
            <LogOut className="mr-2 h-4 w-4" /> Unenroll
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Unenrollment</DialogTitle>
            <DialogDescription>
              Are you sure you want to unenroll from {course.title}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleUnenroll}
              disabled={unenrollMutation.isPending}
            >
              Confirm Unenroll
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Overview Cards
  const CourseOverviewCards = () => {
    const totalCourses = Array.isArray(enrolledCourses) ? enrolledCourses.length : 0;

    return (
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              Current active enrollments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Course Hours</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Array.isArray(enrolledCourses) 
                ? enrolledCourses.reduce((total, course) => total + (course.maxStudents || 0), 0)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Estimated course capacity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Course Progress</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Array.isArray(enrolledCourses) 
                ? `${Math.round((enrolledCourses.filter(course => course.status === 'completed').length / enrolledCourses.length) * 100 || 0)}%`
                : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">
              Completed courses
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Courses Table
  const CoursesTable = () => {
    if (!Array.isArray(enrolledCourses) || enrolledCourses.length === 0) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
            <CardDescription>You are not enrolled in any courses</CardDescription>
          </CardHeader>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>My Courses</CardTitle>
          <CardDescription>Courses you are currently enrolled in</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrolledCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>
                    {course.teacher 
                      ? `${course.teacher.firstName} ${course.teacher.lastName}` 
                      : 'Unknown'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={course.status === 'completed' ? 'outline' : 'default'}>
                      {course.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <CourseDetailsDialog course={course} />
                    <UnenrollDialog course={course} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading courses</div>;

  return (
    <div className="flex">
      <StudentSidebar />
      
      <main className="flex-1 p-8 mt-8 ml-64 space-y-6">
        <div className="greeting">
          <h1 className="text-2xl font-bold">Welcome, {currentUser?.firstName} {currentUser?.lastName}</h1>
          <p className="text-muted-foreground">Here's an overview of your enrolled courses</p>
        </div>

        <CourseOverviewCards />

        <CoursesTable />
      </main>
    </div>
  );
}