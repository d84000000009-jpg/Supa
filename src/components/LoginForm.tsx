import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, BookOpen, Shield } from "lucide-react";

interface LoginFormProps {
  onLogin: (credentials: { email: string; password: string; role: string }) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ email, password, role });
  };

  const getRoleIcon = (roleType: string) => {
    switch (roleType) {
      case "student":
        return <GraduationCap className="h-5 w-5" />;
      case "teacher":
        return <BookOpen className="h-5 w-5" />;
      case "admin":
        return <Shield className="h-5 w-5" />;
      default:
        return <GraduationCap className="h-5 w-5" />;
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
              Selecione seu tipo de acesso e faça login
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Tipo de Acesso</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="h-12">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(role)}
                      <SelectValue placeholder="Selecione o tipo de acesso" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Estudante
                      </div>
                    </SelectItem>
                    <SelectItem value="teacher">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Docente
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Administrador
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                variant="default"
              >
                Entrar
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Credenciais padrão para teste:
              </p>
              <div className="mt-2 space-y-1 text-xs">
                <p><strong>Admin:</strong> admin@m007.com / admin123</p>
                <p><strong>Docente:</strong> teacher@m007.com / teacher123</p>
                <p><strong>Estudante:</strong> student@m007.com / student123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}