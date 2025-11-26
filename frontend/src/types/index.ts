export type UserRole = 'housing_officer' | 'social_worker' | 'youth_worker' | 'admin';

export type RiskScore = 'red' | 'amber' | 'green';

export interface Signals {
  previousHomelessness: boolean;
  temporaryAccommodation: boolean;
  careStatus: boolean;
  parentalSubstanceAbuse: boolean;
  parentalCrimes: boolean;
  youthJustice: boolean;
  educationStatus: boolean;
}

export interface UserPermissions {
  canViewAllData: boolean;
  canEditData: boolean;
  canManageUsers: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  permissions: UserPermissions;
  connectionIds: number[];
}

export interface Person {
  id: number;
  personId?: string; // Original person_id from dataset
  name: string;
  email: string;
  department: string;
  role: string;
  connectionIds: number[];
  riskScore: RiskScore;
  signals: Signals;
  // Additional fields from dataset
  age?: number;
  ageGroup?: string;
  gender?: string;
  ethnicity?: string;
  housingTenure?: string;
  employmentStatus?: string;
  incomeLevel?: string;
}

export interface Connection {
  id: number;
  sourcePersonId: number;
  targetPersonId: number;
  relationType: string;
  description: string;
}

export interface NetworkNode {
  id: number;
  label: string;
  group: string;
}

export interface NetworkLink {
  source: number;
  target: number;
  label: string;
}

export interface NetworkData {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

export interface DataItem {
  id: number;
  name: string;
  category: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, unknown>;
}

export interface BedrockRequest {
  prompt: string;
  modelId?: string;
  maxTokens?: number;
}

export interface BedrockResponse {
  response: string;
  isSimulated: boolean;
  modelUsed: string;
}

export interface BedrockStatus {
  connected: boolean;
  mode: string;
  message: string;
}

export type SignalEventType = 
  | 'moving_house'
  | 'temporary_accommodation'
  | 'death_of_loved_one'
  | 'expelled'
  | 'arrested'
  | 'family_breakdown'
  | 'job_loss'
  | 'mental_health_crisis'
  | 'substance_abuse_incident'
  | 'care_placement_change';

export interface SignalLogEvent {
  id: number;
  date: string;
  eventType: SignalEventType;
  description: string;
  riskScoreImpact: number; // Positive means risk increased, negative means decreased
  riskScoreAfter: RiskScore;
}

export interface PersonSignalLog {
  personId: number;
  events: SignalLogEvent[];
}

// Comprehend types
export interface ComprehendAnalyzeRequest {
  text: string;
  languageCode?: string;
}

export interface ComprehendAnalyzeResponse {
  sentiment: SentimentResult | null;
  entities: EntityResult[];
  keyPhrases: KeyPhraseResult[];
  isSimulated: boolean;
}

export interface SentimentResult {
  sentiment: string;
  scores: SentimentScores;
}

export interface SentimentScores {
  positive: number;
  negative: number;
  neutral: number;
  mixed: number;
}

export interface EntityResult {
  text: string;
  type: string;
  score: number;
}

export interface KeyPhraseResult {
  text: string;
  score: number;
}

export interface ComprehendStatus {
  connected: boolean;
  mode: string;
  message: string;
}
