'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "../../../components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { 
  Book, 
  BookOpen, 
  CalendarDays, 
  Users, 
  MoreHorizontal, 
  PlusCircle 
} from "lucide-react";

import { EducatorSidebar } from '../../../components/layout/EducatorSidebar';
import { getCoursesByTeacher, getLoggedInUser } from '../../../lib/api';
import { User, CourseType } from '../../../types';

export default function EducatorDashboard() {
  const currentUser = getLoggedInUser() as User;

  const { 
    data: courses, 
    isLoading, 
    error 
  } = useQuery<CourseType[]>({
    queryKey: ['educator-courses', currentUser?.id],
    queryFn: () => getCoursesByTeacher(currentUser?.id),
    enabled: !!currentUser
  });

  // Course status color mapping
  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case 'draft': return 'secondary';
      case 'published': return 'default';
      case 'in-progress': return 'default';
      case 'completed': return 'outline';
      default: return 'secondary';
    }
  };

  // Course Overview Cards
  const CourseOverviewCards = () => {
    // Safe calculations
    const totalCourses = Array.isArray(courses) ? courses.length : 0;
    const publishedCourseCount = Array.isArray(courses) 
      ? courses.filter(course => course.isPublished).length 
      : 0;
    const totalStudents = Array.isArray(courses) 
      ? courses.reduce((total, course) => total + (course.enrolledStudents?.length || 0), 0)
      : 0;

    return (
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {publishedCourseCount} Published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Across all courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Enrollment</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {totalCourses > 0 
                ? Math.round(totalStudents / totalCourses) 
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Students per course
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Existing components from the previous implementation remain the same
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
              <p>
                <strong>Enrolled:</strong> {course.enrolledStudents?.length || 0}
              </p>
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

  const CoursesTable = () => {
    // Only render table if courses is an array
    if (!Array.isArray(courses)) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle>My Courses</CardTitle>
          <CardDescription>Courses you are teaching</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.enrolledStudents?.length || 0}/{course.maxStudents}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(course.status)}>
                      {course.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(course.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <CourseDetailsDialog course={course} />
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit Course</DropdownMenuItem>
                        <DropdownMenuItem>Manage Enrollments</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Course
          </Button>
        </CardFooter>
      </Card>
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading courses</div>;

  return (
    <div className="flex">
      <EducatorSidebar />
      
      <main className="flex-1 p-8 mt-8 ml-64 space-y-6">
        <div className="greeting">
          <h1 className="text-2xl font-bold">Welcome, {currentUser?.firstName} {currentUser?.lastName}</h1>
          <p className="text-muted-foreground">Here's an overview of your courses</p>
        </div>

        <CourseOverviewCards />

        <CoursesTable />
      </main>
    </div>
  );
}