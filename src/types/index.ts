// src/types/index.ts
export * from './mobile.types';

// Tipos existentes de tu aplicación
export interface DashboardConfig {
  id: string;
  title: string;
  url: string;
  description?: string;
  size?: 'small' | 'medium' | 'large';
  requiredRoles?: string[];
}

export interface User {
  id: number;
  email: string;
  full_name: string | null;
  is_active: boolean;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  full_name?: string;
  is_active?: boolean;
  roles?: string[];
}