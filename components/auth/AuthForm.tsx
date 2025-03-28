// src/components/AuthForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "../ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { User } from '../../types';
import { loginUser, registerUser } from '../../lib/api';
interface RegistrationData extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
  password: string;
  confirmPassword?: string;
}

const AuthForm: React.FC = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    ageGroup: '',
    role: 'student' // Default role
  });

  const [registrationError, setRegistrationError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await loginUser(loginEmail, loginPassword);
      
      // Redirect based on user role
      switch (response.user.role) {
        case 'admin':
          router.push('/dashboard/admin');
          break;
        case 'educator':
          router.push('/dashboard/educator');
          break;
        case 'student':
          router.push('/dashboard/student');
          break;
        default:
          router.push('/dashboard');
      }
    } catch (err) {
      setLoginError('Login failed. Please check your credentials.');
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationError('');

    // Validate password match
    if (registrationData.password !== registrationData.confirmPassword) {
      setRegistrationError('Passwords do not match');
      return;
    }

    try {
      const { confirmPassword, ...registrationPayload } = registrationData;
      
      const response = await registerUser(registrationPayload);
      

      
      switch (response.role) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'educator':
          router.push('/educator/dashboard');
          break;
        case 'student':
          router.push('/student/dashboard');
          break;
        default:
          router.push('/dashboard');
      }
    } catch (err: any) {
      setRegistrationError(
        err.response?.data?.message || 
        'Registration failed. Please try again.'
      );
    }
  };

  const handleRegistrationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRegistrationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>EduConnect Authentication</CardTitle>
          <CardDescription>
            Access your personalized educational platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 pt-4">
                {loginError && (
                  <div className="bg-red-100 text-red-700 p-3 rounded">
                    {loginError}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </TabsContent>
            
            {/* Signup Tab */}
            <TabsContent value="signup">
              <form onSubmit={handleRegistration} className="space-y-4 pt-4">
                {registrationError && (
                  <div className="bg-red-100 text-red-700 p-3 rounded">
                    {registrationError}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={registrationData.firstName}
                      onChange={handleRegistrationChange}
                      required
                      placeholder="First Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={registrationData.lastName}
                      onChange={handleRegistrationChange}
                      required
                      placeholder="Last Name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={registrationData.email}
                    onChange={handleRegistrationChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ageGroup">Age Group</Label>
                  <select
                    id="ageGroup"
                    name="ageGroup"
                    value={registrationData.ageGroup}
                    onChange={handleRegistrationChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Age Group</option>
                    <option value="<12">Under 12</option>
                    <option value="12-18">12-18</option>
                    <option value="19-25">19-25</option>
                    <option value="26-35">26-35</option>
                    <option value="36+">36 and above</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    name="role"
                    value={registrationData.role}
                    onChange={handleRegistrationChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="student">Student</option>
                    <option value="educator">Educator</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={registrationData.password}
                    onChange={handleRegistrationChange}
                    required
                    placeholder="Create a password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={registrationData.confirmPassword}
                    onChange={handleRegistrationChange}
                    required
                    placeholder="Confirm your password"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;

