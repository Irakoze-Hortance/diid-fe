'use client'
import axios from 'axios';
import { LoginResponse, User, RegistrationData, CourseType } from '../types';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const registerUser = async (userData: Omit<RegistrationData, 'password' | 'confirmPassword'>) => {
  try {
    const response = await axios.post<User>(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Registration failed', error);
    throw error;
  }
};
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, {
      email,
      password
    });
    
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('accessToken');
};

export const getUserRole = (): string | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).role : null;
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  window.location.href = '/'; 
};

export const getLoggedInUser = (): User | null => {
 const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user from localStorage', error);
      }
    }
  }, []);

  return user;
}


export const getAllTeachers = async () => {
  try {
    const response = await axios.get<User[]>(`${API_URL}/users/teachers/all`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch teachers', error);
    throw error;
  }
}

export const getAllStudents = async () => {
  try {
    const response = await axios.get<User[]>(`${API_URL}/users/students/all`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch students', error);
    throw error;
  }
}

export const updateUser = async (userId: string, userData: Partial<User>) => {
  try {
    const response = await axios.put<User>(`${API_URL}/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Failed to update user', error);
    throw error;
  }
}

export const deleteUser = async (userId: string) => {
  try {
    const response = await axios.delete<User>(`${API_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete user', error);
    throw error;
  }
}

export const getCoursesByTeacher = async (teacherId: string): Promise<CourseType[]> => {
  const response = await fetch(`${API_URL}/courses/teacher/${teacherId}`);
  return response.json();
};


export const getCoursesByStudent = async (studentId: string): Promise<CourseType[]> => {
  const response = await fetch(`${API_URL}/courses/student/${studentId}`);
  return response.json();
};

