import { useState } from "react";
import { LoginForm } from "@/components/LoginForm";
import { StudentDashboard } from "@/components/StudentDashboard";
import { TeacherDashboard } from "@/components/TeacherDashboard";
import { AdminDashboard } from "@/components/AdminDashboard";
import { useToast } from "@/hooks/use-toast";

interface User {
  email: string;
  name: string;
  role: "student" | "teacher" | "admin";
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  
  console.log("Index component rendered, user:", user);

  // Credenciais padrão para demonstração
  const defaultCredentials = {
    "admin@m007.com": { password: "admin123", name: "Administrator", role: "admin" as const },
    "teacher@m007.com": { password: "teacher123", name: "Prof. Maria Santos", role: "teacher" as const },
    "student@m007.com": { password: "student123", name: "João Silva", role: "student" as const },
  };

  const handleLogin = ({ email, password, role }: { email: string; password: string; role: string }) => {
    const credential = defaultCredentials[email as keyof typeof defaultCredentials];
    
    if (credential && credential.password === password && credential.role === role) {
      setUser({
        email,
        name: credential.name,
        role: credential.role,
      });
      
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${credential.name}`,
      });
    } else {
      toast({
        title: "Erro no login",
        description: "Credenciais inválidas. Verifique email, senha e tipo de acesso.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setUser(null);
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  switch (user.role) {
    case "student":
      return <StudentDashboard onLogout={handleLogout} />;
    case "teacher":
      return <TeacherDashboard onLogout={handleLogout} />;
    case "admin":
      return <AdminDashboard onLogout={handleLogout} />;
    default:
      return <LoginForm onLogin={handleLogin} />;
  }
};

export default Index;