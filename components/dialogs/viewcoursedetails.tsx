import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { Card, CardContent } from '../ui/card';
import { formatDate } from 'date-fns';
import { coursesApi } from '../../lib/courses';
import { 
  BookOpen, 
  Users, 
  CalendarDays, 
  UserCircle2, 
  GraduationCap, 
  Clock 
} from 'lucide-react';

// Course Details Interface (as provided)
interface CourseDetails {
  id: string;
  title: string;
  description: string;
  maxStudents: number;
  isPublished: boolean;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  teacher: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  enrolledStudents: Array<{
    id: string;
    student: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }>;
}

// Define props interface
interface CourseDetailsDialogProps {
  courseId: string;
  triggerButton?: React.ReactNode;
}

const CourseDetailsDialog: React.FC<CourseDetailsDialogProps> = ({ 
  courseId, 
  triggerButton 
}) => {
  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchCourseDetails = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const details = await coursesApi.findOne(courseId);
      setCourseDetails({
        ...details,
        startDate: details.startDate ? (details.startDate instanceof Date ? details.startDate.toISOString() : details.startDate) : '',
        endDate: details.endDate ? (details.endDate instanceof Date ? details.endDate.toISOString() : details.endDate) : '',
        createdAt: details.createdAt ? (details.createdAt instanceof Date? details.createdAt.toDateString() :details.createdAt) : '',
        updatedAt: details.updatedAt ? (details.updatedAt instanceof Date ? details.updatedAt.toISOString() : details.updatedAt) : '',
        enrolledStudents: details.enrolledStudents.map((enrollment: any) => ({
          id: enrollment.id,
          student: {
            id: enrollment.id,
            firstName: enrollment.firstName,
            lastName: enrollment.lastName,
          },
        })),
      });
    } catch (err) {
      setError('Failed to fetch course details');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button 
            onClick={handleFetchCourseDetails}
            className="w-full max-w-xs bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            View Course Details
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-white shadow-2xl rounded-xl">
        {isLoading ? (
          <div className="text-center p-4 flex items-center justify-center">
            <Clock className="animate-spin text-indigo-600 h-8 w-8" />
            <span className="ml-2 text-gray-600">Loading course details...</span>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
            {error}
          </div>
        ) : courseDetails ? (
          <div className="space-y-6">
            <DialogHeader className="bg-indigo-50 p-4 rounded-t-xl">
              <DialogTitle className="text-2xl text-indigo-800 flex items-center">
                <GraduationCap className="mr-3 text-indigo-600" />
                {courseDetails.title}
              </DialogTitle>
              <DialogDescription className="text-gray-600 mt-2">
                {courseDetails.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid md:grid-cols-2 gap-6 px-4">
              <Card className="border-indigo-100 shadow-md">
                <CardContent className="p-6 space-y-4 bg-indigo-50/50">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-6 w-6 text-indigo-600" />
                    <h3 className="font-semibold text-lg text-indigo-800">Course Details</h3>
                  </div>
                  <div className="space-y-2 text-gray-700">
                    <p className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-indigo-500" />
                      <strong>Status:</strong> 
                      <span className="ml-2 px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                        {courseDetails.status}
                      </span>
                    </p>
                    <p className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-indigo-500" />
                      <strong>Max Students:</strong> 
                      <span className="ml-2 text-indigo-800">
                        {courseDetails.maxStudents}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-emerald-100 shadow-md">
                <CardContent className="p-6 space-y-4 bg-emerald-50/50">
                  <div className="flex items-center space-x-3">
                    <UserCircle2 className="h-6 w-6 text-emerald-600" />
                    <h3 className="font-semibold text-lg text-emerald-800">Instructor</h3>
                  </div>
                  <div className="space-y-2 text-gray-700">
                    <p className="flex items-center">
                      <UserCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
                      <strong>Name:</strong> 
                      <span className="ml-2 text-emerald-800">
                        {courseDetails.teacher.firstName} {courseDetails.teacher.lastName}
                      </span>
                    </p>
                    <p className="flex items-center">
                      <CalendarDays className="mr-2 h-4 w-4 text-emerald-500" />
                      <strong>Email:</strong> 
                      <span className="ml-2 text-emerald-800">
                        {courseDetails.teacher.email}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mx-4 border-amber-100 shadow-md">
              <CardContent className="p-6 space-y-4 bg-amber-50/50">
                <div className="flex items-center space-x-3">
                  <Users className="h-6 w-6 text-amber-600" />
                  <h3 className="font-semibold text-lg text-amber-800">Enrolled Students</h3>
                </div>
                {courseDetails.enrolledStudents.length > 0 ? (
                  <p className="text-gray-700 flex items-center">
                    <Users className="mr-2 h-4 w-4 text-amber-500" />
                    <strong>Total Students:</strong>
                    <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                      {courseDetails.enrolledStudents.length}
                    </span>
                  </p>
                ) : (
                  <p className="text-gray-500">No students enrolled yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default CourseDetailsDialog;