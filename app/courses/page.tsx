'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from '../../components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { PlusCircle, UserPlus, CheckCircle2, XCircle} from "lucide-react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { coursesApi } from '../../lib/courses';
import { getAllTeachers, getAllStudents } from "../../lib/api";
import { 
  CreateCourseDto, 
  CourseType, 
  User, 
  EnrollStudentDto
} from '../../types';
import { toast } from 'sonner';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import CourseDetailsDialog from '../../components/dialogs/viewcoursedetails';

type CourseStatus = "draft" | "published" | "in-progress" | "completed";

export default function CoursesPage() {
  const queryClient = useQueryClient();
  const [isAddCourseDialogOpen, setIsAddCourseDialogOpen] = useState<boolean>(false);
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  const [newCourse, setNewCourse] = useState<Partial<CreateCourseDto>>({
    title: '',
    description: '',
    maxStudents: 30,
    teacherId: '',
    isPublished: false,
  });

  // Validation state
  const [validationErrors, setValidationErrors] = useState<{
    title?: string;
    description?: string;
    teacherId?: string;
    maxStudents?: string;
  }>({});

  // Fetch all courses
  const { 
    data: courses, 
    isLoading: isCoursesLoading 
  } = useQuery<{ data: CourseType[] }>({
    queryKey: ['courses'],
    queryFn: () => coursesApi.findAll()
  });

  // Fetch all teachers
  const { 
    data: teachers, 
    isLoading: isTeachersLoading 
  } = useQuery<User[]>({
    queryKey: ['teachers'],
    queryFn: getAllTeachers
  });

  // Fetch all students
  const { 
    data: students, 
    isLoading: isStudentsLoading 
  } = useQuery<User[]>({
    queryKey: ['students'],
    queryFn: getAllStudents
  });

  // Validate course input
  const validateCourseInput = () => {
    const errors: typeof validationErrors = {};

    if (!newCourse.title?.trim()) {
      errors.title = "Course title is required";
    }

    if (!newCourse.description?.trim()) {
      errors.description = "Course description is required";
    }

    if (!newCourse.teacherId) {
      errors.teacherId = "Please select a teacher";
    }

    if (!newCourse.maxStudents || newCourse.maxStudents < 1) {
      errors.maxStudents = "Max students must be at least 1";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create course mutation
  const createCourseMutation = useMutation({
    mutationFn: (courseData: CreateCourseDto) => coursesApi.create(courseData),
    onSuccess: (newCourseData) => {
      toast.success("Course Created", {
        description: `${newCourseData.title} has been ${newCourseData.isPublished ? 'published' : 'saved as draft'}.`
      });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setIsAddCourseDialogOpen(false);
      // Reset form
      setNewCourse({
        title: '',
        description: '',
        maxStudents: 30,
        teacherId: '',
        isPublished: false,
      });
      setValidationErrors({});
    },
    onError: (error: any) => {
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to create course. Please try again."
      });
      console.error(error);
    }
  });

  // Enroll student mutation
  const enrollStudentMutation = useMutation({
    mutationFn: (enrollData: { courseId: string; studentId: string }) => 
      coursesApi.enrollStudent(enrollData.courseId, { studentId: enrollData.studentId }),
    onSuccess: () => {
      toast.success("Student Enrolled", {
        description: `Student enrolled in ${selectedCourse?.title} course`
      });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setIsEnrollDialogOpen(false);
      setSelectedStudentId('');
      setSelectedCourse(null);
    },
    onError: (error: any) => {
      toast.error("Enrollment Error", {
        description: error.response?.data?.message || "Failed to enroll student. Please try again."
      });
      console.error(error);
    }
  });

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewCourse(prev => ({
      ...prev,
      [name]: name === 'maxStudents' ? Number(value) : value
    }));
    // Clear validation error when user starts typing
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Handle course creation submission
  const handleCreateCourse = (publish: boolean = false) => {
    // Validate input
    if (!validateCourseInput()) {
      return;
    }

    createCourseMutation.mutate({
      title: newCourse.title!,
      description: newCourse.description!,
      teacherId: newCourse.teacherId!,
      maxStudents: newCourse.maxStudents || 30,
      isPublished: publish,
    });
  };

  // Render course status badge
  const renderStatusBadge = (course: CourseType) => {
    const status = course.isPublished 
      ? course.enrolledStudents && course.enrolledStudents.length > 0 
        ? "in-progress" 
        : "published"
      : "draft";

    const badgeVariants: Record<CourseStatus, { variant: "secondary" | "default" | "outline" | "destructive", icon: React.ReactNode }> = {
      'draft': { 
        variant: 'secondary', 
        icon: <XCircle className="w-4 h-4 mr-2 text-gray-500" /> 
      },
      'published': { 
        variant: 'default', 
        icon: <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> 
      },
      'in-progress': { 
        variant: 'outline', 
        icon: <CheckCircle2 className="w-4 h-4 mr-2 text-blue-500" /> 
      },
      'completed': { 
        variant: 'default', 
        icon: <CheckCircle2 className="w-4 h-4 mr-2 text-purple-500" /> 
      }
    };

    const { variant, icon } = badgeVariants[status];

    return (
      <Badge variant={variant} className="flex items-center">
        {icon}
        {status}
      </Badge>
    );
  };

  // Open enrollment dialog
  const openEnrollDialog = (course: CourseType) => {
    setSelectedCourse(course);
    setIsEnrollDialogOpen(true);
  };

  // Handle student enrollment
  const handleEnrollStudent = () => {
    if (!selectedCourse || !selectedStudentId) {
      toast.error("Validation Error", {
        description: "Please select a student to enroll"
      });
      return;
    }

    // Check if course is full
    const currentEnrollment = selectedCourse.enrolledStudents?.length || 0;
    if (currentEnrollment >= selectedCourse.maxStudents) {
      toast.error("Enrollment Error", {
        description: "This course is already at maximum capacity"
      });
      return;
    }

    enrollStudentMutation.mutate({
      courseId: selectedCourse.id,
      studentId: selectedStudentId
    });
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-64 w-[calc(100%-16rem)] p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Courses</h1>
            <p className="text-muted-foreground">Manage and create courses</p>
          </div>
          
          <Dialog 
            open={isAddCourseDialogOpen} 
            onOpenChange={setIsAddCourseDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="title"
                      name="title"
                      value={newCourse.title}
                      onChange={handleInputChange}
                      placeholder="Enter course title"
                      className={validationErrors.title ? "border-red-500" : ""}
                    />
                    {validationErrors.title && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <div className="col-span-3">
                    <Textarea
                      id="description"
                      name="description"
                      value={newCourse.description}
                      onChange={handleInputChange}
                      placeholder="Course description"
                      className={validationErrors.description ? "border-red-500" : ""}
                    />
                    {validationErrors.description && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="teacher" className="text-right">
                    Teacher
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={newCourse.teacherId || ''}
                      onValueChange={(value) => {
                        setNewCourse(prev => ({
                          ...prev,
                          teacherId: value
                        }));
                        // Clear validation error
                        setValidationErrors(prev => ({
                          ...prev,
                          teacherId: undefined
                        }));
                      }}
                    >
                      <SelectTrigger className={validationErrors.teacherId ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select a teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        {isTeachersLoading ? (
                          <div className="p-2 text-center">Loading teachers...</div>
                        ) : (
                          teachers?.map(teacher => (
                            <SelectItem 
                              key={teacher.id} 
                              value={teacher.id}
                            >
                              {teacher.firstName} {teacher.lastName}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {validationErrors.teacherId && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.teacherId}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maxStudents" className="text-right">
                    Max Students
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="maxStudents"
                      name="maxStudents"
                      type="number"
                      value={newCourse.maxStudents}
                      onChange={handleInputChange}
                      placeholder="Maximum number of students"
                      className={validationErrors.maxStudents ? "border-red-500" : ""}
                    />
                    {validationErrors.maxStudents && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.maxStudents}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => setIsAddCourseDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => handleCreateCourse(false)}
                  disabled={createCourseMutation.isPending}
                >
                  {createCourseMutation.isPending ? 'Saving...' : 'Save as Draft'}
                </Button>
                <Button 
                  onClick={() => handleCreateCourse(true)}
                  disabled={createCourseMutation.isPending}
                >
                  {createCourseMutation.isPending ? 'Publishing...' : 'Publish Course'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Courses</CardTitle>
            <CardDescription>List of courses in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isCoursesLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Loading courses...
                    </TableCell>
                  </TableRow>
                ) : (
                  courses?.data.map(course => (
                    <TableRow key={course.id}>
                      <TableCell>{course.title}</TableCell>
                      <TableCell>
                        {course.teacher 
                          ? `${course.teacher.firstName} ${course.teacher.lastName}` 
                          : 'Unassigned'}
                      </TableCell>
                      <TableCell>
                        {renderStatusBadge(course)}
                      </TableCell>
                      <TableCell>
                        {course.enrolledStudents?.length || 0} / {course.maxStudents || 'N/A'}
                      </TableCell>
                      <TableCell className="flex space-x-2">
                        <Dialog>
                          <CourseDetailsDialog courseId={course.id} />
                        </Dialog>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => openEnrollDialog(course)}
                          disabled={(course.enrolledStudents?.length || 0) >= course.maxStudents}
                        >
                          <UserPlus className="mr-2 h-4 w-4" /> Enroll
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Enroll Student Dialog */}
        <Dialog 
          open={isEnrollDialogOpen} 
          onOpenChange={setIsEnrollDialogOpen}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Enroll Student in {selectedCourse?.title}</DialogTitle>
              <p className="text-muted-foreground">
                Currently enrolled: {selectedCourse?.enrolledStudents?.length || 0} / {selectedCourse?.maxStudents}
              </p>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="student" className="text-right">
                  Student
                </Label>
                <Select
                  value={selectedStudentId}
                  onValueChange={setSelectedStudentId}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {isStudentsLoading ? (
                      <div className="p-2 text-center">Loading students...</div>
                    ) : (
                      students
                        ?.filter(student => 
                          !selectedCourse?.enrolledStudents?.some(
                            enrolled => enrolled.id === student.id
                          )
                        )
                        .map(student => (
                          <SelectItem 
                            key={student.id} 
                            value={student.id}
                          >
                            {student.firstName} {student.lastName}
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline"
                onClick={() => setIsEnrollDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleEnrollStudent}
                disabled={
                  enrollStudentMutation.isPending || 
                  !selectedStudentId ||
                  (selectedCourse?.enrolledStudents?.length || 0) >= (selectedCourse?.maxStudents || 0)
                }
              >
                {enrollStudentMutation.isPending ? 'Enrolling...' : 'Enroll Student'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}