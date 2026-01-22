// src/store/authStore.ts - ✅ COM SUPORTE A ACADEMIC_ADMIN
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import authService, { User } from '@/services/authService';

// ✅ TIPO ATUALIZADO COM ACADEMIC_ADMIN
export type UserProfile = 'admin' | 'academic_admin' | 'docente' | 'aluno';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions - ✅ TIPO ATUALIZADO
  login: (credentials: { email: string; senha: string }) => Promise<UserProfile | null>;
  logout: () => void;
  checkAuth: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        login: async (credentials): Promise<UserProfile | null> => {
          set({ isLoading: true, error: null });
          
          try {
            console.log('\n🔄 [authStore] === INICIANDO LOGIN ===');
            console.log('📧 Email:', credentials.email);
            
            // ✅ Chama authService.login() que já salva os tokens
            const response = await authService.login(credentials);
            
            console.log('📦 [authStore] Resposta recebida:', {
              success: response.success,
              hasUser: !!response.data?.user,
              hasToken: !!response.data?.access_token,
              role: response.data?.user?.role
            });
            
            if (!response.success) {
              throw new Error(response.message || 'Erro ao fazer login');
            }

            const userData = response.data.user;
            const accessToken = response.data.access_token;
            
            if (!userData || !accessToken) {
              throw new Error('Dados incompletos na resposta do servidor');
            }
            
            // ✅ VALIDAR ROLE
            const validRoles: UserProfile[] = ['admin', 'academic_admin', 'docente', 'aluno'];
            if (!validRoles.includes(userData.role as UserProfile)) {
              throw new Error(`Role inválido: ${userData.role}`);
            }
            
            // ✅ CRÍTICO: Garantir que o token está no localStorage
            const tokenSaved = localStorage.getItem('access_token');
            
            console.log('\n🔐 [authStore] === VERIFICAÇÃO DE TOKEN ===');
            console.log('Token da resposta:', accessToken.substring(0, 30) + '...');
            console.log('Token no localStorage:', tokenSaved ? tokenSaved.substring(0, 30) + '...' : 'NÃO ENCONTRADO');
            
            if (!tokenSaved) {
              console.error('❌ [authStore] Token não foi salvo! Salvando agora...');
              localStorage.setItem('access_token', accessToken);
              console.log('✅ Token salvo manualmente');
            }
            
            // ✅ Adiciona alias 'profile' para compatibilidade
            const userWithProfile = {
              ...userData,
              profile: userData.role as UserProfile
            };
            
            set({
              user: userWithProfile,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
            
            console.log('\n✅ [authStore] === LOGIN COMPLETO ===');
            console.log('👤 Usuário:', userData.nome);
            console.log('🎭 Role:', userData.role);
            console.log('🔐 Token salvo:', !!localStorage.getItem('access_token'));
            
            return userData.role as UserProfile;

          } catch (error: any) {
            console.error('\n❌ [authStore] === ERRO NO LOGIN ===');
            console.error('Mensagem:', error.message);
            console.error('Stack:', error.stack);
            
            set({
              isLoading: false,
              error: error.message || 'Erro ao conectar com o servidor',
              isAuthenticated: false,
              user: null
            });
            
            throw error;
          }
        },

        logout: () => {
          console.log('\n👋 [authStore] === FAZENDO LOGOUT ===');
          
          // ✅ Limpa tokens via authService
          authService.logout();
          
          // ✅ Limpa estado do Zustand
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
          
          console.log('✅ [authStore] Logout completo');
          console.log('Token removido:', !localStorage.getItem('access_token'));
        },

        checkAuth: () => {
          console.log('\n🔍 [authStore] === VERIFICANDO AUTENTICAÇÃO ===');
          
          const isAuth = authService.isAuthenticated();
          const user = authService.getCurrentUser();
          const token = authService.getAccessToken();
          
          console.log('Token presente:', !!token);
          console.log('Usuário presente:', !!user);
          console.log('isAuth:', isAuth);
          
          if (isAuth && user && token) {
            console.log('✅ Usuário autenticado:', user.nome, `(${user.role})`);
            
            // ✅ Validar role
            const validRoles: UserProfile[] = ['admin', 'academic_admin', 'docente', 'aluno'];
            if (!validRoles.includes(user.role as UserProfile)) {
              console.error('❌ Role inválido:', user.role);
              authService.logout();
              set({
                isAuthenticated: false,
                user: null
              });
              return;
            }
            
            set({
              user: {
                ...user,
                profile: user.role as UserProfile
              },
              isAuthenticated: true
            });
          } else {
            console.log('❌ Usuário não autenticado ou token ausente');
            
            // Limpar tudo se algo estiver inconsistente
            if (!token) {
              authService.logout();
            }
            
            set({
              isAuthenticated: false,
              user: null
            });
          }
        },

        clearError: () => set({ error: null })
      }),
      {
        name: 'auth-storage',
        // Persiste apenas dados essenciais (NÃO o token - fica no localStorage)
        partialize: (state) => ({ 
          user: state.user,
          isAuthenticated: state.isAuthenticated
        })
      }
    ),
    { name: 'auth-store' }
  )
);