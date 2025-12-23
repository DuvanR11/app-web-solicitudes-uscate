import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

// 1. Definición del Usuario (Según lo que devuelve tu backend)
interface User {
  id: string;
  email: string;
  fullName: string;
  role: string; 
}

// 2. Definición del Estado (Esta es la que te faltaba)
interface AuthState {
  token: string | null;
  user: User | null;
  isHydrated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  setHydrated: () => void;
}

// 3. Creación del Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isHydrated: false, // Inicia falso hasta que lea el disco

      setAuth: (token, user) => set({ token, user }),

      logout: () => {
        // A. Borramos la cookie (para el Middleware)
        Cookies.remove('auth-token');
        
        // B. Borramos el localStorage (para Zustand)
        localStorage.removeItem('auth-storage');
        
        // C. Reseteamos el estado en memoria
        set({ token: null, user: null });

        // D. Forzamos la recarga a la página de login
        window.location.href = '/login';
      },

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Cuando termina de cargar del localStorage, marcamos como hidratado
        state?.setHydrated();
      },
    }
  )
);