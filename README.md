# DIID Frontend Application

Digital Inclusion and Innovation for Development (DIID) frontend is a Next.js application that provides a user interface for the digital literacy education platform designed for refugee communities.

## Project Overview

This frontend application provides interfaces for:
- User authentication (login and registration)
- Role-based dashboards for students and teachers
- Course browsing, creation, and management
- Enrollment management
- Progress tracking

## Proposed Pages

Based on the backend API endpoints, the frontend should include:

### Authentication
- `/login` - User login page
- `/register` - User registration page with role selection

### Student Experience
- `/dashboard` - Student dashboard showing enrolled courses and progress
- `/courses` - Browse available courses
- `/courses/[id]` - View course details and enroll
- `/my-courses` - View and manage enrolled courses
- `/profile` - Student profile management

### Teacher Experience
- `/teacher/dashboard` - Teacher dashboard showing created courses
- `/teacher/courses` - Manage existing courses
- `/teacher/courses/new` - Create new course
- `/teacher/courses/[id]` - Edit course details
- `/teacher/courses/[id]/students` - Manage student enrollments and progress

### Admin (Optional)
- `/admin/users` - User management
- `/admin/courses` - Course oversight

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd diid-frontend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file with:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Start the development server
```bash
npm run dev
```

The development server will be running at http://localhost:3000

## API Integration

The frontend connects to the backend API using:

- `fetch` or `axios` for API requests
- JWT authentication stored in localStorage/cookies
- React context for global state management

### Example API Usage

```javascript
// Example of login request
const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.access_token);
      return data;
    } else {
      throw new Error(data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
```

## Building for Production

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Deployment

The Next.js application can be deployed to platforms like Vercel, Netlify, or a custom server.

### Vercel Deployment

```bash
npm install -g vercel
vercel
```

## Design System

The application uses:
- Tailwind CSS for styling
- Responsive design for mobile and desktop views
- Accessible components following WCAG guidelines

## License

[MIT](LICENSE)
