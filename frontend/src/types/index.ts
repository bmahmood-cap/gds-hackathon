export type UserRole = 'housing_officer' | 'social_worker' | 'youth_worker' | 'admin';

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
  name: string;
  email: string;
  department: string;
  role: string;
  connectionIds: number[];
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
