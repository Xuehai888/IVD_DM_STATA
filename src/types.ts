export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
}

export interface DataRecord {
  id: string;
  projectId: string;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface DataField {
  name: string;
  type: 'text' | 'number' | 'date';
  required?: boolean;
}