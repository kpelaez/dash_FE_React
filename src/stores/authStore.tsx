import { create } from 'zustand';

interface AuthState {
    isAuthenticated: boolean;
    
    login: (email: string, password: string) => Promise<void>;
    logout: ()=>void;
}

export const useAuthStore = create<AuthState>((set)=>({
  isAuthenticated: localStorage.getItem('isAunthenticated') === 'true',

  login: async (email:string, password: string) => {
    return new Promise<void>((resolve, reject) => {
        setTimeout(()=>{
            if(email && password) {
                localStorage.setItem('isAuthenticated', 'true');
                set({ isAuthenticated: true});
                resolve();
            } else {
                reject(new Error('Credenciales invalidas'));
            }
        }, 1000);
    })
  },

  logout: ()=>{
    localStorage.removeItem('isAuthenticated');
    set({isAuthenticated: false});
  }
}));