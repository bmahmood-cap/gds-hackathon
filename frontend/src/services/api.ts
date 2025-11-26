import type { DataItem, Person, Connection, NetworkData, BedrockRequest, BedrockResponse, BedrockStatus } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Data Store API
export const dataApi = {
  getAll: () => fetchApi<DataItem[]>('/api/data'),
  get: (id: number) => fetchApi<DataItem>(`/api/data/${id}`),
  create: (item: Partial<DataItem>) =>
    fetchApi<DataItem>('/api/data', {
      method: 'POST',
      body: JSON.stringify(item),
    }),
  update: (id: number, item: Partial<DataItem>) =>
    fetchApi<DataItem>(`/api/data/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    }),
  delete: (id: number) =>
    fetchApi<void>(`/api/data/${id}`, { method: 'DELETE' }),
};

// People API
export const peopleApi = {
  getAll: () => fetchApi<Person[]>('/api/people'),
  get: (id: number) => fetchApi<Person>(`/api/people/${id}`),
  create: (person: Partial<Person>) =>
    fetchApi<Person>('/api/people', {
      method: 'POST',
      body: JSON.stringify(person),
    }),
  update: (id: number, person: Partial<Person>) =>
    fetchApi<Person>(`/api/people/${id}`, {
      method: 'PUT',
      body: JSON.stringify(person),
    }),
  delete: (id: number) =>
    fetchApi<void>(`/api/people/${id}`, { method: 'DELETE' }),
  getConnections: () => fetchApi<Connection[]>('/api/people/connections'),
  createConnection: (connection: Partial<Connection>) =>
    fetchApi<Connection>('/api/people/connections', {
      method: 'POST',
      body: JSON.stringify(connection),
    }),
  getNetworkData: () => fetchApi<NetworkData>('/api/people/network'),
};

// Bedrock API
export const bedrockApi = {
  invoke: (request: BedrockRequest) =>
    fetchApi<BedrockResponse>('/api/bedrock/invoke', {
      method: 'POST',
      body: JSON.stringify(request),
    }),
  getStatus: () => fetchApi<BedrockStatus>('/api/bedrock/status'),
};
