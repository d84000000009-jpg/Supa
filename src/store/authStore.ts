// src/store/authStore.ts - VERSÃO FINAL COM PERSISTÊNCIA
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  phone: string
  profile: 'admin' | 'docente' | 'aluno'
  is_active: boolean
  is_staff: boolean
  is_superuser: boolean
  date_joined: string
  last_login: string
  addresses: any[]
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: { username: string; password: string }) => Promise<string>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
  getCsrfToken: () => Promise<string | null>
}

const API_BASE_URL = 'http://localhost:8000/api/account'

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    ?.split('=')[1] || null;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        getCsrfToken: async (): Promise<string | null> => {
          return getCookie('csrftoken');
        },

        login: async (credentials): Promise<string> => {
          set({ isLoading: true, error: null });
          
          try {
            let csrfToken = getCookie('csrftoken');
            
            if (!csrfToken) {
              await fetch(`${API_BASE_URL}/login/`, {
                method: 'GET',
                credentials: 'include',
              });
              csrfToken = getCookie('csrftoken');
            }

            if (!csrfToken) {
              throw new Error('Não foi possível obter token CSRF');
            }

            // 1. Faz login
            const loginResponse = await fetch(`${API_BASE_URL}/login/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
              },
              credentials: 'include',
              body: JSON.stringify(credentials),
            });

            if (!loginResponse.ok) {
              const errorData = await loginResponse.json();
              throw new Error(errorData.detail || 'Erro ao fazer login');
            }

            // ✅ Aguarda para cookies serem processados
            await new Promise(resolve => setTimeout(resolve, 100));

            // 2. Busca dados do usuário
            const profileResponse = await fetch(`${API_BASE_URL}/profile/`, {
              method: 'GET',
              credentials: 'include',
              headers: {
                'X-CSRFToken': csrfToken,
              },
            });

            if (profileResponse.ok) {
              const userData = await profileResponse.json();
              set({
                user: userData,
                isAuthenticated: true,
                isLoading: false,
                error: null
              });
              
              return userData.profile;
            } else {
              // ✅ Tenta alternativa: usa dados do login response
              try {
                const loginData = await loginResponse.json();
                if (loginData.user) {
                  set({
                    user: loginData.user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                  });
                  return loginData.user.profile;
                }
              } catch (e) {
                // Continua com o erro original
              }
              
              throw new Error('Erro ao obter dados do usuário');
            }

          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message,
              isAuthenticated: false,
              user: null
            });
            throw error;
          }
        },

        logout: async () => {
          set({ isLoading: true });
          
          try {
            const csrfToken = getCookie('csrftoken');
            
            await fetch(`${API_BASE_URL}/logout/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(csrfToken && { 'X-CSRFToken': csrfToken }),
              },
              credentials: 'include',
            });

          } catch (error: any) {
            console.error('Erro no logout:', error);
          } finally {
            // ✅ Limpa o estado completamente
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null
            });
          }
        },

        checkAuth: async () => {
          set({ isLoading: true });
          
          try {
            const csrfToken = getCookie('csrftoken');
            const response = await fetch(`${API_BASE_URL}/profile/`, {
              method: 'GET',
              credentials: 'include',
              headers: {
                ...(csrfToken && { 'X-CSRFToken': csrfToken }),
              },
            });

            if (response.ok) {
              const userData = await response.json();
              set({
                user: userData,
                isAuthenticated: true,
                isLoading: false,
                error: null
              });
            } else {
              // ✅ Não é erro, só não está autenticado
              set({
                isAuthenticated: false,
                user: null,
                isLoading: false,
                error: null
              });
            }
          } catch (error: any) {
            // ✅ Erro de rede, mas não limpa estado persistido
            set({
              isLoading: false,
              error: error.message
            });
          }
        },

        clearError: () => set({ error: null })
      }),
      {
        name: 'auth-storage',
        // ✅ PERSISTÊNCIA - Mantém o estado entre recarregamentos
        partialize: (state) => ({ 
          user: state.user,
          isAuthenticated: state.isAuthenticated
        })
      }
    ),
    { name: 'auth-storage' }
  )
);