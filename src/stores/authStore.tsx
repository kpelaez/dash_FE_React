import { create } from 'zustand';
import toast from 'react-hot-toast';
// Define la URL base de la API de autenticacion
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
import { API_URL } from '../config/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface User { 
  id: number;
  email: string;
  full_name: string | null;
  is_active: boolean;
  created_at: string;
}

export interface RegisterData extends LoginCredentials {
  full_name?: string;
  is_active?: boolean;
  roles?: string[];
}

interface AuthState {
    token: string | null;
    user: User | null;
    roles: string[];
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () =>void;
    getUser: () =>Promise<void>;
    register:(credentials: LoginCredentials & {full_name?:string, roles?: string[]}) => Promise<void>;
    hasRole: (role:string) => boolean;
    hasAnyRole:(roles: string[]) => boolean;
    getApiUrl: () => string; 
}

export const useAuthStore = create<AuthState>((set, get)=>({
  token: localStorage.getItem('auth_token'),
  user: null,
  roles: [],
  isAuthenticated: !!localStorage.getItem('auth_token'),
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null});

    try{
      const formData = new URLSearchParams();
      formData.append('username', credentials.email);
      formData.append('password', credentials.password);

      const response = await fetch(`${API_URL}/token`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error de autenticacion')
      }

      const data = await response.json();

      localStorage.setItem('auth_token', data.access_token);//<-- Se llama asi en el backend

      // IMPORTANTE: Asegúrate de que los roles se están guardando correctamente
      console.log("Roles recibidos:", data.roles); // Para depuración

      set({
        token: data.access_token,
        roles: data.roles || [],
        isAuthenticated: true,
        isLoading: false,
      });

      await get().getUser();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
      set({
        error: errorMessage,
        isLoading: false,
        roles: [],
        isAuthenticated: false,
        token: null,
        user: null,
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  logout: ()=>{
    localStorage.removeItem('auth_token');
    set({
      token: null,
      user: null,
      roles: [],
      isAuthenticated: false,
      error: null
    });
    toast.success('Sesión cerrada exitosamente');
  },

  getUser: async ()=>{
    const {token, user} = get();

    if (!token) {
      set({ 
        user: null,
        isAuthenticated: false,
        roles: [],
      })
      return;
    }

    if (user) return;

    set({ isLoading: true});

    try {
      const response = await fetch(`${API_URL}/users/me`, { // <-- Asi es la ruta para obtener usuario en el back
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if(!response.ok) {
        throw new Error('Error al obtener datos del usuario');
      }

      const userData = await response.json();

      set({ user: userData, isLoading: false});

    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      localStorage.removeItem('auth_token');
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
        user: null,
        roles: [],
        isAuthenticated: false,
        token: null,
      });
    }
  },

  register: async (credentials)=>{
    set({isLoading: true, error: null});

    try {
      const response = await fetch(`${API_URL}/register`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ //<-- Aca va el cuerpo que necesita para registrarse del Backend
          email: credentials.email,
          password: credentials.password,
          full_name: credentials.full_name || null,
          roles: credentials.roles || ['user'],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al registrar');
      }

      set({
        isLoading: false
      });

      // Opcionalmente, inicia sesion automaticamente cuando se registra
      await get().login({
        email: credentials.email,
        password: credentials.password,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false
      });
    }
  },

  //Funciones de utilidad para verificar roles
  hasRole: (role: string) => {
    const { roles } = get();
    return roles.includes(role);
  },

  hasAnyRole: (requiredRoles: string[]) => {
    const { roles } = get();
    return requiredRoles.some(role => roles.includes(role));
  },

  // Nueva función para debug
  getApiUrl: () => API_URL,
}));