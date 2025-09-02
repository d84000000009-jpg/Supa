// src/components/LoginForm.tsx - VERSÃO CORRIGIDA
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error, getCsrfToken } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Obtém o CSRF token quando o componente montar
    const initializeCsrf = async () => {
      try {
        await getCsrfToken();
      } catch (error) {
        console.error('Erro ao inicializar CSRF token:', error);
      }
    };
    
    initializeCsrf();
  }, [getCsrfToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // ✅ AGORA RECEBE O PERFIL E REDIRECIONA
      const userProfile = await login({ username, password });
      console.log('Perfil do usuário logado:', userProfile); // ✅ DEBUG
      
      // ✅ REDIRECIONAMENTO CORRIGIDO - USA AS ROTAS QUE EXISTEM
      switch (userProfile) {
        case 'admin':
          navigate('/admin/dashboard');    // ✅ CORRETO - esta rota existe
          break;
        case 'docente':
          navigate('/teacher/dashboard');  // ✅ CORRIGIDO - muda para teacher
          break;
        case 'aluno':
          navigate('/student/dashboard');  // ✅ CORRIGIDO - muda para student
          break;
        default:
          navigate('/dashboard'); // Fallback
      }
      
    } catch (error) {
      console.error('Login error:', error);
      // O erro já é tratado no store, não precisa fazer nada aqui
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            M007 Oxford English
          </h1>
          <p className="text-muted-foreground">
            Sistema Acadêmico - Faça seu login
          </p>
        </div>

        <Card className="shadow-elegant border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Entrar</CardTitle>
            <CardDescription className="text-center">
              Digite suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-md">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Seu username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-12"
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                variant="default"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Entre com suas credenciais institucionais
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}