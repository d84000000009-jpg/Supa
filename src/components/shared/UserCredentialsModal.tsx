import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  User,
  Mail,
  Lock,
  Shield,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Key
} from "lucide-react";
import { SystemUser } from "./UsersList";

interface UserCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: SystemUser | null;
  onResetPassword?: (userId: number) => void;
}

export function UserCredentialsModal({
  isOpen,
  onClose,
  user,
  onResetPassword
}: UserCredentialsModalProps) {
  const [showPassword, setShowPassword] = useState(false);

  if (!user) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado para área de transferência`);
  };

  const handleResetPassword = () => {
    if (confirm(`Tem certeza que deseja resetar a senha de ${user.name}?`)) {
      if (onResetPassword) {
        onResetPassword(user.id);
      }
      toast.success("Senha resetada com sucesso. Nova senha enviada por email.");
    }
  };

  const getRoleInfo = () => {
    const roles = {
      admin: {
        label: "Administrador",
        icon: Shield,
        color: "bg-red-500",
        bgColor: "bg-red-50",
        textColor: "text-red-700"
      },
      teacher: {
        label: "Docente",
        icon: User,
        color: "bg-blue-500",
        bgColor: "bg-blue-50",
        textColor: "text-blue-700"
      },
      student: {
        label: "Estudante",
        icon: User,
        color: "bg-green-500",
        bgColor: "bg-green-50",
        textColor: "text-green-700"
      }
    };
    return roles[user.role];
  };

  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo.icon;

  const mockPassword = "********";
  const username = user.email.split("@")[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#004B87] flex items-center gap-2">
            <Key className="h-6 w-6" />
            Credenciais de Acesso
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border-2 border-slate-200">
            <div className="h-16 w-16 bg-gradient-to-br from-[#004B87] to-[#0066B3] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-white font-bold text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800 mb-1">{user.name}</h3>
              <p className="text-sm text-slate-600 mb-2">{user.email}</p>
              <div className="flex items-center gap-2">
                <Badge className={`${roleInfo.color} text-white border-0`}>
                  <RoleIcon className="h-3 w-3 mr-1" />
                  {roleInfo.label}
                </Badge>
                <Badge
                  className={
                    user.status === "active"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-gray-100 text-gray-700 border-gray-200"
                  }
                >
                  {user.status === "active" ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 bg-white rounded-xl border-2 border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-500" />
                  Email / Nome de Usuário
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(user.email, "Email")}
                  className="h-8 px-3 text-xs"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copiar
                </Button>
              </div>
              <div className="font-mono text-sm bg-slate-50 p-3 rounded-lg border border-slate-200">
                {user.email}
              </div>
            </div>

            <div className="p-5 bg-white rounded-xl border-2 border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-slate-500" />
                  Senha
                </Label>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="h-8 px-3 text-xs"
                  >
                    {showPassword ? (
                      <>
                        <EyeOff className="h-3 w-3 mr-1" />
                        Ocultar
                      </>
                    ) : (
                      <>
                        <Eye className="h-3 w-3 mr-1" />
                        Mostrar
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(mockPassword, "Senha")}
                    className="h-8 px-3 text-xs"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copiar
                  </Button>
                </div>
              </div>
              <div className="font-mono text-sm bg-slate-50 p-3 rounded-lg border border-slate-200">
                {showPassword ? mockPassword : "••••••••••••"}
              </div>
            </div>

            <div className="p-5 bg-yellow-50 rounded-xl border-2 border-yellow-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-yellow-800 mb-1">Informação de Segurança</h4>
                  <p className="text-xs text-yellow-700 leading-relaxed">
                    As senhas são criptografadas e não podem ser visualizadas. Apenas o usuário tem acesso
                    à sua senha. Você pode resetar a senha, e uma nova será enviada para o email do usuário.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-700 flex items-center gap-2">
              <Shield className="h-4 w-4 text-slate-500" />
              Informações de Acesso
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Data de Criação</p>
                <p className="text-sm font-semibold text-slate-800">
                  {new Date(user.createdAt).toLocaleDateString("pt-PT", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                  })}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Último Acesso</p>
                <p className="text-sm font-semibold text-slate-800">
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleDateString("pt-PT", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })
                    : "Nunca acessou"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose}>
            Fechar
          </Button>
          <Button
            onClick={handleResetPassword}
            className="bg-gradient-to-r from-[#F5821F] to-[#FF9933] hover:from-[#E07318] hover:to-[#F58820] text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Resetar Senha
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <label className={className}>{children}</label>;
}
