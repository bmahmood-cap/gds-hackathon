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
    connectionIds: [2033, 2881, 4023, 8860, 312, 1131, 5562, 2336], // At-risk individuals in her caseload
  },
  {
    id: 2,
    name: 'James Chen',
    email: 'james.chen@council.gov.uk',
    role: 'social_worker',
    permissions: { canViewAllData: false, canEditData: true, canManageUsers: false },
    connectionIds: [2033, 2881, 312, 313, 751], // Children and young people in his care
  },
  {
    id: 3,
    name: 'Emily Parker',
    email: 'emily.parker@council.gov.uk',
    role: 'youth_worker',
    permissions: { canViewAllData: false, canEditData: false, canManageUsers: false },
    connectionIds: [4023, 8860, 9221, 9364, 8327, 720], // Young people she works with
  },
  {
    id: 4,
    name: 'Admin User',
    email: 'admin@council.gov.uk',
    role: 'admin',
    permissions: { canViewAllData: true, canEditData: true, canManageUsers: true },
    connectionIds: [2033, 2881, 4023, 8860, 312, 1131, 9221, 5562, 2336, 313, 751, 9364, 8327, 720], // Admin sees all
  },
];

// Data derived from homelessness_all_years.csv dataset
// At-risk individuals from the dataset with person-to-person connections
// Connection types: Family, Peer, Neighbor, School, Support Group
export const mockPeople: Person[] = [
  {
    id: 2033,
    personId: '46a2e923',
    name: 'Ryan Munoz',
    email: 'r.munoz@email.com',
    department: 'Youth Housing',
    role: 'Vulnerable Child',
    connectionIds: [2336, 312, 5562], // Peers in youth housing program
    riskScore: 'red',
    signals: {
      ...defaultSignals,
      previousHomelessness: true,
      temporaryAccommodation: true,
      educationStatus: true,
    },
    age: 16,
    ageGroup: '0‑17',
    gender: 'Female',
    ethnicity: 'White‑British',
    housingTenure: 'Private rented',
    employmentStatus: 'Employed‑full‑time',
    incomeLevel: '£45‑60k',
  },
  {
    id: 2881,
    personId: 'cb336c20',
    name: 'Matthew Foster',
    email: 'm.foster@email.com',
    department: 'Care Leavers',
    role: 'At-Risk Youth',
    connectionIds: [751, 313, 312], // Fellow care leavers and peer support
    riskScore: 'red',
    signals: {
      ...defaultSignals,
      parentalSubstanceAbuse: true,
    },
    age: 21,
    ageGroup: '18‑24',
    gender: 'Male',
    ethnicity: 'White‑British',
    housingTenure: 'Owner‑occupied',
    employmentStatus: 'Employed‑full‑time',
    incomeLevel: '£30‑45k',
  },
  {
    id: 4023,
    personId: 'f39f6bef',
    name: 'Jessica Callahan',
    email: 'j.callahan@email.com',
    department: 'Family Support',
    role: 'At-Risk Child',
    connectionIds: [8860, 9221, 9364], // Sibling (Kelly), school peer, parent figure
    riskScore: 'red',
    signals: {
      ...defaultSignals,
    },
    age: 13,
    ageGroup: '0‑17',
    gender: 'Female',
    ethnicity: 'White‑British',
    housingTenure: 'Homeless/temporary',
    employmentStatus: 'Employed‑full‑time',
    incomeLevel: '£10‑20k',
  },
  {
    id: 8860,
    personId: 'f177c2ea',
    name: 'Kelly Donovan',
    email: 'k.donovan@email.com',
    department: 'Family Support',
    role: 'At-Risk Child',
    connectionIds: [4023, 9221], // Sibling (Jessica), school peer
    riskScore: 'red',
    signals: {
      ...defaultSignals,
      educationStatus: true,
    },
    age: 8,
    ageGroup: '0‑17',
    gender: 'Male',
    ethnicity: 'White‑British',
    housingTenure: 'Owner‑occupied',
    employmentStatus: 'Retired',
    incomeLevel: '<£10k',
  },
  {
    id: 312,
    personId: '284011ac',
    name: 'Michelle Harmon',
    email: 'm.harmon@email.com',
    department: 'Youth Housing',
    role: 'At-Risk Youth',
    connectionIds: [2033, 2881, 5562, 1131], // Youth housing peers
    riskScore: 'red',
    signals: {
      ...defaultSignals,
      previousHomelessness: true,
      temporaryAccommodation: true,
    },
    age: 20,
    ageGroup: '18‑24',
    gender: 'Male',
    ethnicity: 'Mixed',
    housingTenure: 'Owner‑occupied',
    employmentStatus: 'Student',
    incomeLevel: '£20‑30k',
  },
  {
    id: 1131,
    personId: '363946ed',
    name: 'Abigail Shaffer',
    email: 'a.shaffer@email.com',
    department: 'Youth Housing',
    role: 'Adult',
    connectionIds: [312, 5562, 2336], // Youth housing support network
    riskScore: 'amber',
    signals: {
      ...defaultSignals,
      parentalSubstanceAbuse: true,
    },
    age: 25,
    ageGroup: '25‑34',
    gender: 'Female',
    ethnicity: 'Mixed',
    housingTenure: 'Social housing',
    employmentStatus: 'Employed‑part‑time',
    incomeLevel: '£20‑30k',
  },
  {
    id: 9221,
    personId: 'd15b0c6e',
    name: 'Gabrielle Davis',
    email: 'g.davis@email.com',
    department: 'Family Support',
    role: 'At-Risk Child',
    connectionIds: [4023, 8860, 8327], // School peers, neighbor
    riskScore: 'amber',
    signals: {
      ...defaultSignals,
      educationStatus: true,
    },
    age: 17,
    ageGroup: '0‑17',
    gender: 'Female',
    ethnicity: 'East‑Asian',
    housingTenure: 'Owner‑occupied',
    employmentStatus: 'Student',
    incomeLevel: '<£10k',
  },
  {
    id: 5562,
    personId: 'b9bf17ab',
    name: 'Lisa Hensley',
    email: 'l.hensley@email.com',
    department: 'Youth Housing',
    role: 'At-Risk Youth',
    connectionIds: [2033, 312, 1131], // Youth housing peers
    riskScore: 'amber',
    signals: {
      ...defaultSignals,
      previousHomelessness: true,
      temporaryAccommodation: true,
    },
    age: 22,
    ageGroup: '18‑24',
    gender: 'Female',
    ethnicity: 'Black‑Caribbean',
    housingTenure: 'Social housing',
    employmentStatus: 'Employed‑full‑time',
    incomeLevel: '>£60k',
  },
  {
    id: 2336,
    personId: 'ffeb0452',
    name: 'Brian Ramirez',
    email: 'b.ramirez@email.com',
    department: 'Youth Housing',
    role: 'At-Risk Child',
    connectionIds: [2033, 1131], // Youth housing peer, mentor
    riskScore: 'amber',
    signals: {
      ...defaultSignals,
      previousHomelessness: true,
      temporaryAccommodation: true,
    },
    age: 16,
    ageGroup: '0‑17',
    gender: 'Male',
    ethnicity: 'White‑British',
    housingTenure: 'Owner‑occupied',
    employmentStatus: 'Employed‑full‑time',
    incomeLevel: '<£10k',
  },
  {
    id: 313,
    personId: '61a452a4',
    name: 'Derek Zuniga',
    email: 'd.zuniga@email.com',
    department: 'Care Leavers',
    role: 'Adult',
    connectionIds: [2881, 751], // Care leaver support network
    riskScore: 'amber',
    signals: {
      ...defaultSignals,
      parentalSubstanceAbuse: true,
    },
    age: 28,
    ageGroup: '25‑34',
    gender: 'Female',
    ethnicity: 'White‑British',
    housingTenure: 'Owner‑occupied',
    employmentStatus: 'Unemployed',
    incomeLevel: '£45‑60k',
  },
  {
    id: 751,
    personId: '3d9925c3',
    name: 'Allison Hill',
    email: 'a.hill@email.com',
    department: 'Care Leavers',
    role: 'Young Adult',
    connectionIds: [2881, 313], // Care leaver peers
    riskScore: 'green',
    signals: {
      ...defaultSignals,
    },
    age: 19,
    ageGroup: '18‑24',
    gender: 'Male',
    ethnicity: 'White‑British',
    housingTenure: 'Owner‑occupied',
    employmentStatus: 'Student',
    incomeLevel: '£10‑20k',
  },
  {
    id: 9364,
    personId: 'e98aeead',
    name: 'Noah Rhodes',
    email: 'n.rhodes@email.com',
    department: 'Family Support',
    role: 'Adult',
    connectionIds: [4023, 8327, 720], // Family support network, parent of Jessica
    riskScore: 'green',
    signals: {
      ...defaultSignals,
    },
    age: 39,
    ageGroup: '35‑44',
    gender: 'Female',
    ethnicity: 'White‑British',
    housingTenure: 'Owner‑occupied',
    employmentStatus: 'Employed‑full‑time',
    incomeLevel: '£30‑45k',
  },
  {
    id: 8327,
    personId: '2c58494e',
    name: 'Daniel Wagner',
    email: 'd.wagner@email.com',
    department: 'Family Support',
    role: 'Adult',
    connectionIds: [9221, 9364, 720], // Neighbor, community member
    riskScore: 'green',
    signals: {
      ...defaultSignals,
    },
    age: 47,
    ageGroup: '45‑54',
    gender: 'Male',
    ethnicity: 'White‑British',
    housingTenure: 'Private rented',
    employmentStatus: 'Employed‑full‑time',
    incomeLevel: '>£60k',
  },
  {
    id: 720,
    personId: '246e03d4',
    name: 'Cristian Santos',
    email: 'c.santos@email.com',
    department: 'Family Support',
    role: 'Adult',
    connectionIds: [9364, 8327], // Community support network
    riskScore: 'green',
    signals: {
      ...defaultSignals,
    },
    age: 36,
    ageGroup: '35‑44',
    gender: 'Male',
    ethnicity: 'White‑British',
    housingTenure: 'Living with relatives',
    employmentStatus: 'Employed‑full‑time',
    incomeLevel: '£45‑60k',
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
