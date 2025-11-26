import type { User, Person } from '../types';

// Mock users representing different roles
export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@school.edu',
    role: 'teacher',
    permissions: { canViewAllData: false, canEditData: false, canManageUsers: false },
    connectionIds: [101, 102, 103, 104, 105], // Her students
  },
  {
    id: 2,
    name: 'Dr. James Chen',
    email: 'james.chen@hospital.org',
    role: 'doctor',
    permissions: { canViewAllData: false, canEditData: true, canManageUsers: false },
    connectionIds: [201, 202, 203, 204], // His patients
  },
  {
    id: 3,
    name: 'Emily Parker',
    email: 'emily.parker@email.com',
    role: 'parent',
    permissions: { canViewAllData: false, canEditData: false, canManageUsers: false },
    connectionIds: [101, 301], // Her children
  },
  {
    id: 4,
    name: 'Admin User',
    email: 'admin@system.org',
    role: 'admin',
    permissions: { canViewAllData: true, canEditData: true, canManageUsers: true },
    connectionIds: [],
  },
];

// Mock people database - these are the "connections"
export const mockPeople: Person[] = [
  // Students (Teacher's connections)
  { id: 101, name: 'Tommy Wilson', email: 'tommy.w@school.edu', department: 'Class 5A', role: 'Student', connectionIds: [1, 3] },
  { id: 102, name: 'Emma Davis', email: 'emma.d@school.edu', department: 'Class 5A', role: 'Student', connectionIds: [1] },
  { id: 103, name: 'Lucas Brown', email: 'lucas.b@school.edu', department: 'Class 5A', role: 'Student', connectionIds: [1] },
  { id: 104, name: 'Sophia Martinez', email: 'sophia.m@school.edu', department: 'Class 5A', role: 'Student', connectionIds: [1] },
  { id: 105, name: 'Oliver Johnson', email: 'oliver.j@school.edu', department: 'Class 5A', role: 'Student', connectionIds: [1] },
  
  // Patients (Doctor's connections)
  { id: 201, name: 'Margaret Thompson', email: 'margaret.t@email.com', department: 'Primary Care', role: 'Patient', connectionIds: [2] },
  { id: 202, name: 'Robert Anderson', email: 'robert.a@email.com', department: 'Primary Care', role: 'Patient', connectionIds: [2] },
  { id: 203, name: 'Jennifer Lee', email: 'jennifer.l@email.com', department: 'Primary Care', role: 'Patient', connectionIds: [2] },
  { id: 204, name: 'William Garcia', email: 'william.g@email.com', department: 'Primary Care', role: 'Patient', connectionIds: [2] },
  
  // Children (Parent's connections)
  { id: 301, name: 'Max Parker', email: 'max.p@school.edu', department: 'Class 3B', role: 'Child', connectionIds: [3] },
];
