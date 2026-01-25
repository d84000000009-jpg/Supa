// src/components/shared/registration-student-modal/tabs/CredentialsTab.tsx

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Hash,
  Key,
  Lock,
  Shield,
  Sparkles,
  User,
  X,
} from "lucide-react";
import type {
  RegistrationFormData,
  RegistrationFormErrors,
} from "../types/registrationModal.types";

interface CredentialsTabProps {
  formData: RegistrationFormData;
  formErrors: RegistrationFormErrors;

  showPassword: boolean;
  onToggleShowPassword: () => void;

  onChangeField: (field: keyof RegistrationFormData, value: any) => void;

  formatCurrency: (value: number) => string;
}

export function CredentialsTab({
  formData,
  formErrors,
  showPassword,
  onToggleShowPassword,
  onChangeField,
  formatCurrency,
}: CredentialsTabProps) {
  const enrollmentFee = Number(formData.enrollmentFee || 0);
  const monthlyFee = Number(formData.monthlyFee || 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
      {/* Banner de Sucesso */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-green-800">
              Matrícula Pronta para Finalizar!
            </h3>
            <p className="text-sm text-green-600">
              Revise as credenciais geradas antes de confirmar
            </p>
          </div>
        </div>
      </div>

      {/* Card de Credenciais */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-[#F5821F]/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#F5821F] text-white rounded-lg">
            <Shield className="h-5 w-5" />
          </div>
          <Label className="font-bold text-[#004B87] leading-none">
            Credenciais de Acesso ao Sistema
          </Label>
        </div>

        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-800">
              As credenciais foram geradas automaticamente. Você pode editá-las
              se necessário antes de finalizar.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Código do Estudante - READ ONLY */}
          <div className="space-y-2">
            <Label className="text-slate-600 font-semibold ml-1">
              Código do Estudante <span className="text-red-500">*</span>
            </Label>

            <div className="relative">
              <Hash className="absolute left-4 top-3 h-4 w-4 text-green-600" />
              <Input
                value={formData.studentCode || ""}
                readOnly
                className="h-12 pl-11 rounded-xl font-mono font-bold text-base bg-green-50 border-2 border-green-300 text-green-700"
              />
            </div>

            {formData.studentCode ? (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Código gerado automaticamente
              </p>
            ) : null}
          </div>

          {/* Usuário */}
          <div className="space-y-2">
            <Label className="text-slate-600 font-semibold ml-1">
              Usuário <span className="text-red-500">*</span>
            </Label>

            <div className="relative">
              <User className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="usuario.estudante"
                value={formData.username || ""}
                onChange={(e) => onChangeField("username", e.target.value)}
                className={cn("h-12 pl-11 rounded-xl", formErrors.username && "border-red-500")}
              />
            </div>

            {formErrors.username ? (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {formErrors.username}
              </p>
            ) : null}
          </div>

          {/* Senha */}
          <div className="space-y-2">
            <Label className="text-slate-600 font-semibold ml-1">
              Senha <span className="text-red-500">*</span>
            </Label>

            <div className="relative">
              <Key className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password || ""}
                onChange={(e) => onChangeField("password", e.target.value)}
                className={cn(
                  "h-12 pl-11 pr-10 rounded-xl",
                  formErrors.password && "border-red-500"
                )}
              />

              <button
                type="button"
                onClick={onToggleShowPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <X className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              </button>
            </div>

            {formErrors.password ? (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {formErrors.password}
              </p>
            ) : null}
          </div>
        </div>

        {/* Preview Visual das Credenciais */}
        {formData.username && formData.password && formData.studentCode ? (
          <div className="mt-6 p-5 bg-white border-2 border-[#F5821F]/30 rounded-xl shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-[#F5821F]" />
              <p className="text-sm font-bold text-slate-700">
                Resumo das Credenciais
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                <span className="text-xs text-slate-600 font-medium">Código:</span>
                <span className="text-sm font-mono font-bold text-purple-700">
                  {formData.studentCode}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                <span className="text-xs text-slate-600 font-medium">Usuário:</span>
                <span className="text-sm font-mono font-bold text-[#004B87]">
                  {formData.username}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                <span className="text-xs text-slate-600 font-medium">Senha:</span>
                <span className="text-sm font-mono font-bold text-[#F5821F]">
                  {showPassword ? formData.password : "••••••••"}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Resumo COMPLETO da Matrícula */}
      <div className="bg-gradient-to-br from-[#004B87]/5 to-[#F5821F]/5 border-2 border-[#004B87]/30 rounded-2xl p-6">
        <h3 className="text-base font-bold text-[#004B87] mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#F5821F]" />
          Resumo Completo da Matrícula
        </h3>

        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Estudante:</span>
            <span className="text-sm font-semibold text-[#004B87]">
              {formData.studentName || "-"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Código:</span>
            <span className="text-sm font-semibold font-mono text-purple-600">
              {formData.studentCode || "-"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Curso:</span>
            <span className="text-sm font-semibold font-mono text-purple-600">
              {formData.courseName || "-"}
            </span>
          </div>

          {formData.className ? (
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Turma:</span>
              <span className="text-sm font-semibold text-blue-600">
                {formData.className}
              </span>
            </div>
          ) : null}

          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Período:</span>
            <span className="text-sm font-semibold text-[#F5821F]">
              {formData.period || "-"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Data:</span>
            <span className="text-sm font-semibold text-slate-700">
              {formData.enrollmentDate
                ? new Date(formData.enrollmentDate).toLocaleDateString("pt-BR")
                : "-"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Taxa Matrícula:</span>
            <span className="text-sm font-semibold text-orange-600">
              {formatCurrency(enrollmentFee)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Mensalidade:</span>
            <span className="text-sm font-semibold text-green-600">
              {formatCurrency(monthlyFee)}/mês
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
