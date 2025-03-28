import axios from 'axios';
import { CourseType, Enrollment, CreateCourseDto, UpdateCourseDto, CreateEnrollmentDto, EnrollmentQueryDto, EnrollStudentDto } from '../types';
import { useQuery } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Courses API Service
export const coursesApi = {
  // Create a new course
  create: async (createCourseDto: CreateCourseDto): Promise<CourseType> => {
    try {
      const response = await axios.post<CourseType>(`${API_URL}/courses`, createCourseDto);
      return response.data;
    } catch (error) {
      console.error('Failed to create course', error);
      throw error;
    }
  },

  // Get all courses with optional query parameters
  findAll: async (query?: EnrollmentQueryDto): Promise<{ data: CourseType[], total: number }> => {
    try {
      const response = await axios.get<{ data: CourseType[], total: number }>(`${API_URL}/courses`, { params: query });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch courses', error);
      throw error;
    }
  },

  // Get a single course by ID
  findOne: async (id: string): Promise<CourseType> => {
    try {
      const response = await axios.get<CourseType>(`${API_URL}/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch course ${id}`, error);
      throw error;
    }
  },

  // Update a course
  update: async (id: string, updateCourseDto: UpdateCourseDto): Promise<CourseType> => {
    try {
      const response = await axios.patch<CourseType>(`${API_URL}/courses/${id}`, updateCourseDto);
      return response.data;
    } catch (error) {
      console.error(`Failed to update course ${id}`, error);
      throw error;
    }
  },

  // Delete a course
  remove: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/courses/${id}`);
    } catch (error) {
      console.error(`Failed to delete course ${id}`, error);
      throw error;
    }
  },

  // Get courses by teacher
  getCoursesByTeacher: async (teacherId: string): Promise<CourseType[]> => {
    try {
      const response = await axios.get<CourseType[]>(`${API_URL}/courses/teacher/${teacherId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch courses for teacher ${teacherId}`, error);
      throw error;
    }
  },

  enrollStudent: async (courseId: string, enrollStudentDto: EnrollStudentDto): Promise<any> => {
    try {
      const response = await axios.post<any>(`${API_URL}/courses/${courseId}/enroll`, enrollStudentDto);
      return response.data;
    } catch (error) {
      console.error(`Failed to enroll student in course`, error);
      throw error;
    }
  },

  // Unenroll a student from a course
  unenrollStudent: async (courseId: string, studentId: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/courses/${courseId}/students/${studentId}`);
    } catch (error) {
      console.error(`Failed to unenroll student ${studentId} from course ${courseId}`, error);
      throw error;
    }
  },

  // Get course enrollments
  getCourseEnrollments: async (courseId: string): Promise<Enrollment[]> => {
    try {
      const response = await axios.get<Enrollment[]>(`${API_URL}/courses/${courseId}/enrollments`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch enrollments for course ${courseId}`, error);
      throw error;
    }
  },

  // Get courses for a student
  getStudentCourses: async (studentId: string): Promise<CourseType[]> => {
    try {
      const response = await axios.get<CourseType[]>(`${API_URL}/courses/student/${studentId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch courses for student ${studentId}`, error);
      throw error;
    }
  },

  // Mark a course enrollment as completed
  markCourseCompleted: async (enrollmentId: string): Promise<Enrollment> => {
    try {
      const response = await axios.patch<Enrollment>(`${API_URL}/courses/enrollments/${enrollmentId}/complete`);
      return response.data;
    } catch (error) {
      console.error(`Failed to mark enrollment ${enrollmentId} as completed`, error);
      throw error;
    }
  }
};

// Optional: React Query hooks for course-related data fetching
export const useCourses = () => {
  // Fetch all courses
  const { data: courses, isLoading, error } = useQuery<CourseType[]>({
    queryKey: ['courses'],
    queryFn: () => coursesApi.findAll().then(res => res.data)
  });

  return { courses, isLoading, error };
};

export const useCoursesByTeacher = (teacherId: string) => {
  // Fetch courses for a specific teacher
  const { data: courses, isLoading, error } = useQuery<CourseType[]>({
    queryKey: ['courses', teacherId],
    queryFn: () => coursesApi.getCoursesByTeacher(teacherId)
  });

  return { courses, isLoading, error };
};

export const useStudentCourses = (studentId: string) => {
  // Fetch courses for a specific student
  const { data: courses, isLoading, error } = useQuery<CourseType[]>({
    queryKey: ['student-courses', studentId],
    queryFn: () => coursesApi.getStudentCourses(studentId)
  });

  return { courses, isLoading, error };
};