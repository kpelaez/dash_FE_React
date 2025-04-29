import { create } from 'zustand';

// Define la URL base de la API de autenticacion
const API_URL = 'http://localhost:8000';

interface LoginCredentials {
  email: string;
  password: string;
}

interface User { //<-Asi es el tipo de dato que nos va a devolver la funcion current_user del back?
  id: number;
  email: string;
  full_name: string | null;
  is_active: boolean;
  created_at: string;
}

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: ()=>void;
    getUser: ()=>Promise<void>;
    register:(credentials: LoginCredentials & {full_name?:string}) =>Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get)=>({
  token: localStorage.getItem('auth_token'),
  user: null,
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

      set({
        token: data.access_token,
        isAuthenticated: true,
        isLoading: false,
      });

      await get().getUser();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
        isAuthenticated: false,
        token: null,
        user: null,
      });
    }
  },

  logout: ()=>{
    localStorage.removeItem('auth_token');
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      error: null
    });
  },

  getUser: async ()=>{
    const {token} = get();

    if (!token) {
      set({ 
        user: null,
        isAuthenticated: false
      })
      return;
    }

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
  }
}));