export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  ageGroup: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface RegistrationData extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
  password: string;
  confirmPassword?: string;
}

export interface CourseType {
  id: string;
  title: string;
  description: string;
  maxStudents: number;
  isPublished: boolean;
  startDate?: Date;
  endDate?: Date;
  teacher: User;
  enrolledStudents: User[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Enrollment {
  id: string;
  course: CourseType;
  student: User;
  status: string;
  paidAmount?: number;
  isCompleted: boolean;
  completedAt?: Date;
  enrolledAt: Date;
  updatedAt: Date;
}

export interface CreateCourseDto {
  title: string;
  description: string;
  maxStudents: number;
  isPublished: boolean;
  startDate?: Date;
  endDate?: Date;
  teacherId: string;
}

export interface UpdateCourseDto {
  title?: string;
  description?: string;
  maxStudents?: number;
  isPublished?: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface CreateEnrollmentDto {
  studentId: string;
  courseId: string;
  paidAmount?: number;
}

export interface UpdateEnrollmentDto {
  status?: string;
  isCompleted?: boolean;
  completedAt?: Date;
  paidAmount?: number;
}

export interface EnrollmentQueryDto {
  studentId?: string;
  courseId?: string;
  status?: string;
  isCompleted?: boolean;
}

export interface EnrollStudentDto {
  studentId: string;
}