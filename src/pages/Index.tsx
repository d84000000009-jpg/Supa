// src/pages/Index.tsx - VERSÃO CORRIGIDA
import { useEffect } from "react";
import { LoginForm } from "@/components/LoginForm";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {

    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Erro de autenticação",
        description: error,
        variant: "destructive",
      });
      clearError();
    }
  }, [error, toast, clearError]);

  // ✅ Mostra loading apenas se estiver carregando E não autenticado
  // Se estiver autenticado, o redirecionamento acima já aconteceu
  if (isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // ✅ Se estiver autenticado, não mostra nada (já redirecionou)
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Redirecionando...</p>
        </div>
      </div>
    );
  }

  // ✅ Se não estiver autenticado e não estiver carregando, mostra o formulário de login
  return <LoginForm />;
};

export default Index;