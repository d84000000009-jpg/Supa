// src/App.tsx - VERSÃO CORRIGIDA
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { StudentDashboard } from "@/components/StudentDashboard";
import { TeacherDashboard } from "@/components/TeacherDashboard";
import { AdminDashboard } from "@/components/AdminDashboard";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

// Componente para proteger rotas baseado no perfil - CORRIGIDO
function ProtectedRoute({ 
  children, 
  requiredProfile 
}: { 
  children: React.ReactNode;
  requiredProfile?: 'admin' | 'docente' | 'aluno';
}) {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  
  // ✅ Mostra loading apenas se estiver carregando
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }
  
  // ✅ Redireciona apenas se NÃO estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Verifica perfil se necessário
  if (requiredProfile && user?.profile !== requiredProfile) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
}

// Componente para redirecionar baseado no perfil - CORRIGIDO
function ProfileRedirect() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // ✅ Só redireciona se não estiver loading e estiver autenticado
    if (!isLoading && isAuthenticated && user) {
      switch (user.profile) {
        case 'aluno':
          navigate('/student/dashboard', { replace: true });
          break;
        case 'docente':
          navigate('/teacher/dashboard', { replace: true });
          break;
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        default:
          navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, isLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Redirecionando...</p>
      </div>
    </div>
  );
}

// Página de não autorizado
function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-destructive">Acesso Não Autorizado</h1>
        <p className="text-muted-foreground mt-2">
          Você não tem permissão para acessar esta página.
        </p>
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Rota de login */}
          <Route path="/login" element={<Index />} />
          
          {/* Rota principal redireciona para login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Dashboard do Aluno */}
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute requiredProfile="aluno">
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Dashboard do Docente */}
          <Route 
            path="/teacher/dashboard" 
            element={
              <ProtectedRoute requiredProfile="docente">
                <TeacherDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Dashboard do Administrador */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute requiredProfile="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Dashboard genérico (redireciona baseado no perfil) */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <ProfileRedirect />
              </ProtectedRoute>
            } 
          />
          
          {/* Página de não autorizado */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;