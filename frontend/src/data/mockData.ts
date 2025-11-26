import type { User, Person, Signals } from '../types';

// Mock users representing different roles in local council
export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@council.gov.uk',
    role: 'housing_officer',
    permissions: { canViewAllData: false, canEditData: false, canManageUsers: false },
    connectionIds: [101, 102, 103, 104, 105], // At-risk individuals in her caseload
  },
  {
    id: 2,
    name: 'James Chen',
    email: 'james.chen@council.gov.uk',
    role: 'social_worker',
    permissions: { canViewAllData: false, canEditData: true, canManageUsers: false },
    connectionIds: [201, 202, 203, 204], // Children and young people in his care
  },
  {
    id: 3,
    name: 'Emily Parker',
    email: 'emily.parker@council.gov.uk',
    role: 'youth_worker',
    permissions: { canViewAllData: false, canEditData: false, canManageUsers: false },
    connectionIds: [101, 301, 302], // Young people she works with
  },
  {
    id: 4,
    name: 'Admin User',
    email: 'admin@council.gov.uk',
    role: 'admin',
    permissions: { canViewAllData: true, canEditData: true, canManageUsers: true },
    connectionIds: [],
  },
];

// Helper to create default signals (all false)
const defaultSignals: Signals = {
  previousHomelessness: false,
  temporaryAccommodation: false,
  careStatus: false,
  parentalSubstanceAbuse: false,
  parentalCrimes: false,
  youthJustice: false,
  educationStatus: false,
};

// Mock people database - individuals at risk of homelessness and their support network
export const mockPeople: Person[] = [
  // At-risk young people (Housing Officer's caseload)
  { 
    id: 101, 
    name: 'Tyler Wilson', 
    email: 'tyler.w@email.com', 
    department: 'Youth Housing', 
    role: 'At-Risk Youth', 
    connectionIds: [1, 3, 201],
    riskScore: 'red',
    signals: { 
      ...defaultSignals, 
      previousHomelessness: true, 
      temporaryAccommodation: true, 
      parentalSubstanceAbuse: true,
      youthJustice: true,
      educationStatus: true,
    },
  },
  { 
    id: 102, 
    name: 'Emma Davis', 
    email: 'emma.d@email.com', 
    department: 'Youth Housing', 
    role: 'At-Risk Youth', 
    connectionIds: [1, 401],
    riskScore: 'amber',
    signals: { 
      ...defaultSignals, 
      temporaryAccommodation: true, 
      educationStatus: true,
    },
  },
  { 
    id: 103, 
    name: 'Lucas Brown', 
    email: 'lucas.b@email.com', 
    department: 'Family Support', 
    role: 'Young Parent', 
    connectionIds: [1, 402],
    riskScore: 'green',
    signals: { 
      ...defaultSignals, 
      educationStatus: true,
    },
  },
  { 
    id: 104, 
    name: 'Sophia Martinez', 
    email: 'sophia.m@email.com', 
    department: 'Care Leavers', 
    role: 'Care Leaver', 
    connectionIds: [1, 201],
    riskScore: 'red',
    signals: { 
      ...defaultSignals, 
      previousHomelessness: true,
      careStatus: true, 
      parentalCrimes: true,
    },
  },
  { 
    id: 105, 
    name: 'Oliver Johnson', 
    email: 'oliver.j@email.com', 
    department: 'Youth Housing', 
    role: 'At-Risk Youth', 
    connectionIds: [1, 301],
    riskScore: 'amber',
    signals: { 
      ...defaultSignals, 
      temporaryAccommodation: true, 
      youthJustice: true,
    },
  },
  
  // Children and young people (Social Worker's caseload)
  { 
    id: 201, 
    name: 'Mia Thompson', 
    email: 'mia.t@email.com', 
    department: 'Child Protection', 
    role: 'Vulnerable Child', 
    connectionIds: [2, 101, 104],
    riskScore: 'red',
    signals: { 
      ...defaultSignals, 
      careStatus: true, 
      parentalSubstanceAbuse: true, 
      parentalCrimes: true,
      educationStatus: true,
    },
  },
  { 
    id: 202, 
    name: 'Noah Anderson', 
    email: 'noah.a@email.com', 
    department: 'Child Protection', 
    role: 'Vulnerable Child', 
    connectionIds: [2, 403],
    riskScore: 'amber',
    signals: { 
      ...defaultSignals, 
      careStatus: true,
    },
  },
  { 
    id: 203, 
    name: 'Ava Lee', 
    email: 'ava.l@email.com', 
    department: 'Family Support', 
    role: 'At-Risk Child', 
    connectionIds: [2, 404],
    riskScore: 'green',
    signals: { 
      ...defaultSignals, 
      parentalSubstanceAbuse: true,
    },
  },
  { 
    id: 204, 
    name: 'Liam Garcia', 
    email: 'liam.g@email.com', 
    department: 'Care Leavers', 
    role: 'Care Leaver', 
    connectionIds: [2],
    riskScore: 'amber',
    signals: { 
      ...defaultSignals, 
      careStatus: true, 
      previousHomelessness: true,
    },
  },
  
  // Youth Worker's connections
  { 
    id: 301, 
    name: 'Jack Roberts', 
    email: 'jack.r@email.com', 
    department: 'Youth Services', 
    role: 'NEET Youth', 
    connectionIds: [3, 105],
    riskScore: 'red',
    signals: { 
      ...defaultSignals, 
      previousHomelessness: true, 
      youthJustice: true, 
      educationStatus: true,
    },
  },
  { 
    id: 302, 
    name: 'Chloe Harris', 
    email: 'chloe.h@email.com', 
    department: 'Youth Services', 
    role: 'At-Risk Youth', 
    connectionIds: [3],
    riskScore: 'green',
    signals: { 
      ...defaultSignals, 
      educationStatus: true,
    },
  },
  
  // Family members and guardians
  { 
    id: 401, 
    name: 'Maria Davis', 
    email: 'maria.d@email.com', 
    department: 'Family Network', 
    role: 'Parent', 
    connectionIds: [102],
    riskScore: 'green',
    signals: defaultSignals,
  },
  { 
    id: 402, 
    name: 'Robert Brown', 
    email: 'robert.b@email.com', 
    department: 'Family Network', 
    role: 'Grandparent', 
    connectionIds: [103],
    riskScore: 'green',
    signals: defaultSignals,
  },
  { 
    id: 403, 
    name: 'Helen Anderson', 
    email: 'helen.a@email.com', 
    department: 'Family Network', 
    role: 'Foster Carer', 
    connectionIds: [202],
    riskScore: 'green',
    signals: defaultSignals,
  },
  { 
    id: 404, 
    name: 'David Lee', 
    email: 'david.l@email.com', 
    department: 'Family Network', 
    role: 'Parent', 
    connectionIds: [203],
    riskScore: 'green',
    signals: defaultSignals,
  },
];
