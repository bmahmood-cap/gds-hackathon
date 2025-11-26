import type { User, Person, PersonSignalLog } from '../types';
import { defaultSignals } from '../utils/riskUtils';

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

// Mock signal log data for tracking life events over time
export const mockSignalLogs: PersonSignalLog[] = [
  {
    personId: 101, // Tyler Wilson - High Risk
    events: [
      { id: 1, date: '2023-01-15', eventType: 'family_breakdown', description: 'Parents separated, moved to temporary accommodation', riskScoreImpact: 2, riskScoreAfter: 'amber' },
      { id: 2, date: '2023-03-22', eventType: 'expelled', description: 'Expelled from secondary school for persistent truancy', riskScoreImpact: 2, riskScoreAfter: 'red' },
      { id: 3, date: '2023-05-10', eventType: 'temporary_accommodation', description: 'Placed in emergency B&B accommodation', riskScoreImpact: 1, riskScoreAfter: 'red' },
      { id: 4, date: '2023-08-05', eventType: 'arrested', description: 'Arrested for shoplifting', riskScoreImpact: 2, riskScoreAfter: 'red' },
      { id: 5, date: '2023-11-20', eventType: 'substance_abuse_incident', description: 'Overdose requiring hospital admission', riskScoreImpact: 2, riskScoreAfter: 'red' },
      { id: 6, date: '2024-02-14', eventType: 'moving_house', description: 'Moved to supported housing', riskScoreImpact: -1, riskScoreAfter: 'red' },
    ],
  },
  {
    personId: 102, // Emma Davis - Medium Risk
    events: [
      { id: 1, date: '2023-06-01', eventType: 'moving_house', description: 'Family relocated due to domestic violence', riskScoreImpact: 1, riskScoreAfter: 'amber' },
      { id: 2, date: '2023-09-15', eventType: 'temporary_accommodation', description: 'Placed in temporary accommodation by council', riskScoreImpact: 1, riskScoreAfter: 'amber' },
      { id: 3, date: '2024-01-10', eventType: 'mental_health_crisis', description: 'Referred to CAMHS for anxiety', riskScoreImpact: 1, riskScoreAfter: 'amber' },
    ],
  },
  {
    personId: 104, // Sophia Martinez - High Risk
    events: [
      { id: 1, date: '2022-09-01', eventType: 'care_placement_change', description: 'Moved to third foster placement', riskScoreImpact: 1, riskScoreAfter: 'amber' },
      { id: 2, date: '2022-12-10', eventType: 'death_of_loved_one', description: 'Biological mother passed away', riskScoreImpact: 2, riskScoreAfter: 'red' },
      { id: 3, date: '2023-02-20', eventType: 'mental_health_crisis', description: 'Self-harm incident, hospital admission', riskScoreImpact: 2, riskScoreAfter: 'red' },
      { id: 4, date: '2023-06-15', eventType: 'care_placement_change', description: 'Foster placement breakdown, moved to residential care', riskScoreImpact: 1, riskScoreAfter: 'red' },
      { id: 5, date: '2023-10-01', eventType: 'expelled', description: 'Permanently excluded from school', riskScoreImpact: 1, riskScoreAfter: 'red' },
    ],
  },
  {
    personId: 201, // Mia Thompson - High Risk
    events: [
      { id: 1, date: '2023-02-01', eventType: 'family_breakdown', description: 'Parents reported to social services', riskScoreImpact: 2, riskScoreAfter: 'amber' },
      { id: 2, date: '2023-04-15', eventType: 'care_placement_change', description: 'Emergency removal from home, placed in foster care', riskScoreImpact: 2, riskScoreAfter: 'red' },
      { id: 3, date: '2023-07-20', eventType: 'mental_health_crisis', description: 'PTSD diagnosis following trauma assessment', riskScoreImpact: 1, riskScoreAfter: 'red' },
      { id: 4, date: '2024-01-05', eventType: 'care_placement_change', description: 'Moved to long-term stable foster placement', riskScoreImpact: -1, riskScoreAfter: 'red' },
    ],
  },
  {
    personId: 301, // Jack Roberts - High Risk
    events: [
      { id: 1, date: '2022-11-01', eventType: 'expelled', description: 'Excluded from school for violent behavior', riskScoreImpact: 2, riskScoreAfter: 'amber' },
      { id: 2, date: '2023-01-15', eventType: 'arrested', description: 'Cautioned for assault', riskScoreImpact: 2, riskScoreAfter: 'red' },
      { id: 3, date: '2023-04-10', eventType: 'family_breakdown', description: 'Kicked out of family home', riskScoreImpact: 2, riskScoreAfter: 'red' },
      { id: 4, date: '2023-06-20', eventType: 'temporary_accommodation', description: 'Placed in youth hostel', riskScoreImpact: 1, riskScoreAfter: 'red' },
      { id: 5, date: '2023-09-01', eventType: 'job_loss', description: 'Lost apprenticeship due to attendance issues', riskScoreImpact: 1, riskScoreAfter: 'red' },
    ],
  },
  {
    personId: 105, // Oliver Johnson - Medium Risk
    events: [
      { id: 1, date: '2023-08-01', eventType: 'moving_house', description: 'Family evicted, temporary accommodation', riskScoreImpact: 2, riskScoreAfter: 'amber' },
      { id: 2, date: '2023-11-10', eventType: 'arrested', description: 'Warning for possession of cannabis', riskScoreImpact: 1, riskScoreAfter: 'amber' },
    ],
  },
  {
    personId: 204, // Liam Garcia - Medium Risk
    events: [
      { id: 1, date: '2023-03-01', eventType: 'care_placement_change', description: 'Turned 18, leaving care services', riskScoreImpact: 1, riskScoreAfter: 'amber' },
      { id: 2, date: '2023-05-15', eventType: 'moving_house', description: 'Moved to independent living with support', riskScoreImpact: 0, riskScoreAfter: 'amber' },
      { id: 3, date: '2023-08-20', eventType: 'job_loss', description: 'Made redundant from part-time job', riskScoreImpact: 1, riskScoreAfter: 'amber' },
    ],
  },
];
