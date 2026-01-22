// src/components/shared/CreateTeacherModal.tsx - VERSÃO MODERNA E ESTILIZADA
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import teacherService, { CreateTeacherData } from "@/services/teacherService";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  UserPlus,
  Save,
  X,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Award,
  User,
  Key,
  Lock,
  Shield,
  AlertCircle,
  Briefcase,
  BookOpen,
  DollarSign,
  MapPin
} from "lucide-react";
import { Class } from "../../types";

interface CreateTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (teacherData: any) => void;
  availableClasses?: Class[]; // NOVA PROP: Lista de turmas disponíveis
}

export function CreateTeacherModal({
  isOpen,
  onClose,
  onSave,
  availableClasses = []
}: CreateTeacherModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    address: '',
    specialization: '',
    qualifications: '',
    experience: '',
    contractType: 'full-time',
    salary: '',
    startDate: new Date().toISOString().split('T')[0],
    assignedClasses: [] as number[],
    emergencyContact1: '',
    emergencyContact2: '',
    notes: '',
    usuario: '',
    senha: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [autoGenerateCredentials, setAutoGenerateCredentials] = useState(true);

  // Gerar credenciais automaticamente
  useEffect(() => {
    if (autoGenerateCredentials && formData.name) {
      const generateUsername = (name: string) => {
        const names = name.toLowerCase().trim().split(' ');
        const firstName = names[0];
        const lastName = names[names.length - 1];
        return `${firstName}.${lastName}`.replace(/[^a-z.]/g, '');
      };

      const generatePassword = () => {
        return Math.random().toString(36).slice(-8) + Math.random().toString(10).slice(-2);
      };

      setFormData(prev => ({
        ...prev,
        usuario: generateUsername(formData.name),
        senha: generatePassword()
      }));
    }
  }, [formData.name, autoGenerateCredentials]);

  const handleInputChange = (field: string, value: string | number | number[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Função para formatar data de nascimento
  const handleBirthDateChange = (field: 'birthDay' | 'birthMonth' | 'birthYear', value: string) => {
    const numbers = value.replace(/\D/g, '');
    let maxLength = field === 'birthYear' ? 4 : 2;
    const formatted = numbers.substring(0, maxLength);

    setFormData(prev => ({ ...prev, [field]: formatted }));

    if (errors.birthDate) {
      setErrors(prev => ({ ...prev, birthDate: '' }));
    }
  };

  // Toggle turma atribuída
  const toggleClassAssignment = (classId: number) => {
    setFormData(prev => ({
      ...prev,
      assignedClasses: prev.assignedClasses.includes(classId)
        ? prev.assignedClasses.filter(id => id !== classId)
        : [...prev.assignedClasses, classId]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.qualifications.trim()) newErrors.qualifications = 'Qualificações são obrigatórias';
    if (!formData.experience.trim()) newErrors.experience = 'Experiência é obrigatória';
    if (!formData.startDate) newErrors.startDate = 'Data de início é obrigatória';

    // Validar data de nascimento (se preenchida)
    if (formData.birthDay || formData.birthMonth || formData.birthYear) {
      const day = parseInt(formData.birthDay);
      const month = parseInt(formData.birthMonth);
      const year = parseInt(formData.birthYear);

      if (!formData.birthDay || day < 1 || day > 31) {
        newErrors.birthDate = 'Dia inválido';
      }
      if (!formData.birthMonth || month < 1 || month > 12) {
        newErrors.birthDate = 'Mês inválido';
      }
      if (!formData.birthYear || year < 1900 || year > new Date().getFullYear()) {
        newErrors.birthDate = 'Ano inválido';
      }
    }

    if (!formData.usuario.trim()) newErrors.usuario = 'Usuário é obrigatório';
    if (!formData.senha.trim()) newErrors.senha = 'Senha é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      try {
        // Converter data DD/MM/AAAA para AAAA-MM-DD
        let birthDateISO = undefined;
        if (formData.birthDay && formData.birthMonth && formData.birthYear) {
          const day = formData.birthDay.padStart(2, '0');
          const month = formData.birthMonth.padStart(2, '0');
          birthDateISO = `${formData.birthYear}-${month}-${day}`;
        }

        const teacherData: CreateTeacherData = {
          nome: formData.name,
          email: formData.email,
          telefone: formData.phone || undefined,
          data_nascimento: birthDateISO,
          endereco: formData.address || undefined,
          especialidade: formData.specialization || undefined,
          tipo_contrato: formData.contractType === 'full-time' ? 'tempo_integral' :
            formData.contractType === 'part-time' ? 'meio_periodo' :
              formData.contractType === 'freelance' ? 'freelancer' : 'substituto',
          data_inicio: formData.startDate,
          salario: formData.salary ? Number(formData.salary) : undefined,
          contato_emergencia: formData.emergencyContact || undefined,
          observacoes: `${formData.qualifications}\n\n${formData.experience}\n\n${formData.notes}`.trim(),
          status: 'ativo'
        };

        console.log('📤 Enviando dados do docente:', teacherData);
        const response = await teacherService.create(teacherData);

        toast.success(response.message || "Docente cadastrado com sucesso!");
        onSave(formData);
        handleClose();

      } catch (error: any) {
        console.error("Erro ao criar docente:", error);
        toast.error(error.message || "Erro ao cadastrar docente");
      }
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      birthDay: '',
      birthMonth: '',
      birthYear: '',
      address: '',
      specialization: '',
      qualifications: '',
      experience: '',
      contractType: 'full-time',
      salary: '',
      startDate: new Date().toISOString().split('T')[0],
      assignedClasses: [],
      emergencyContact: '',
      notes: '',
      usuario: '',
      senha: ''
    });
    setErrors({});
    setAutoGenerateCredentials(true);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header Estilizado */}
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gradient-to-br from-[#F5821F] to-[#FF9933] rounded-xl flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl text-[#004B87]">
                Cadastrar Novo Docente
              </DialogTitle>
              <DialogDescription className="text-sm">
                Preencha todos os campos obrigatórios marcados com *
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Seção 1: Informações Pessoais */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
              <User className="h-5 w-5 text-[#F5821F]" />
              <h3 className="text-lg font-bold text-[#004B87]">Informações Pessoais</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">
                  Nome Completo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Nome completo do professor"
                  className={`h-11 ${errors.name ? 'border-red-500' : 'border-slate-300'}`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="professor@exemplo.com"
                    className={`h-11 pl-10 ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+258 84 123 4567"
                    className="h-11 pl-10 border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Data de Nascimento</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                  <div className="flex items-center gap-1 border-2 border-slate-300 rounded-lg h-11 pl-10 pr-3">
                    <input
                      value={formData.birthDay}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                        handleInputChange('birthDay', value);
                      }}
                      placeholder="DD"
                      maxLength={2}
                      className="w-8 text-center outline-none bg-transparent"
                    />
                    <span className="text-slate-400 font-bold">/</span>
                    <input
                      value={formData.birthMonth}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                        handleInputChange('birthMonth', value);
                      }}
                      placeholder="MM"
                      maxLength={2}
                      className="w-8 text-center outline-none bg-transparent"
                    />
                    <span className="text-slate-400 font-bold">/</span>
                    <input
                      value={formData.birthYear}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                        handleInputChange('birthYear', value);
                      }}
                      placeholder="AAAA"
                      maxLength={4}
                      className="w-14 text-center outline-none bg-transparent"
                    />
                  </div>
                </div>
                {errors.birthDate && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.birthDate}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address" className="text-sm font-semibold">Endereço</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Endereço completo"
                    className="h-11 pl-10 border-slate-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seção 2: Informações Acadêmicas */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
              <GraduationCap className="h-5 w-5 text-[#F5821F]" />
              <h3 className="text-lg font-bold text-[#004B87]">Informações Acadêmicas</h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specialization" className="text-sm font-semibold">
                  Especialização
                </Label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                    placeholder="Ex: Matemática, Física, Literatura..."
                    className="h-11 pl-10 border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualifications" className="text-sm font-semibold">
                  Qualificações <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="qualifications"
                  value={formData.qualifications}
                  onChange={(e) => handleInputChange('qualifications', e.target.value)}
                  placeholder="Ex: Licenciatura em Letras - Inglês, Certificado TEFL, Mestrado..."
                  rows={3}
                  className={`${errors.qualifications ? 'border-red-500' : 'border-slate-300'}`}
                />
                {errors.qualifications && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.qualifications}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience" className="text-sm font-semibold">
                  Experiência <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  placeholder="Descreva a experiência profissional do docente..."
                  rows={3}
                  className={`${errors.experience ? 'border-red-500' : 'border-slate-300'}`}
                />
                {errors.experience && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.experience}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Seção 3: Informações Contratuais */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
              <Briefcase className="h-5 w-5 text-[#F5821F]" />
              <h3 className="text-lg font-bold text-[#004B87]">Informações Contratuais</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contractType" className="text-sm font-semibold">
                  Tipo de Contrato
                </Label>
                <select
                  id="contractType"
                  value={formData.contractType}
                  onChange={(e) => handleInputChange('contractType', e.target.value)}
                  className="w-full h-11 px-3 border-2 border-slate-300 rounded-lg focus:border-[#F5821F] focus:ring-2 focus:ring-[#F5821F]/20 outline-none"
                >
                  <option value="full-time">Tempo Integral</option>
                  <option value="part-time">Meio Período</option>
                  <option value="freelance">Freelancer</option>
                  <option value="substitute">Substituto</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-semibold">
                  Data de Início <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={`h-11 ${errors.startDate ? 'border-red-500' : 'border-slate-300'}`}
                />
                {errors.startDate && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary" className="text-sm font-semibold">
                  Salário (MZN)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="salary"
                    type="number"
                    min="0"
                    value={formData.salary}
                    onChange={(e) => handleInputChange('salary', e.target.value)}
                    placeholder="0"
                    className="h-11 pl-10 border-slate-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seção 4: Atribuir Turmas */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
              <BookOpen className="h-5 w-5 text-[#F5821F]" />
              <h3 className="text-lg font-bold text-[#004B87]">Atribuir Turmas (Opcional)</h3>
            </div>

            {availableClasses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableClasses.map((classItem) => (
                  <div
                    key={classItem.id}
                    onClick={() => toggleClassAssignment(classItem.id)}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${formData.assignedClasses.includes(classItem.id)
                        ? 'border-[#F5821F] bg-orange-50'
                        : 'border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-[#004B87]">{classItem.name}</h4>
                        <p className="text-xs text-slate-600">{classItem.schedule}</p>
                      </div>
                      <div className={`h-5 w-5 rounded border-2 flex items-center justify-center ${formData.assignedClasses.includes(classItem.id)
                          ? 'border-[#F5821F] bg-[#F5821F]'
                          : 'border-slate-300'
                        }`}>
                        {formData.assignedClasses.includes(classItem.id) && (
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">
                Nenhuma turma disponível para atribuição
              </p>
            )}
          </div>

          {/* Seção 5: Credenciais de Acesso */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-[#F5821F]/30 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F5821F]/30">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#F5821F]" />
                <h3 className="text-lg font-bold text-[#004B87]">Credenciais de Acesso</h3>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoGenerate"
                  checked={autoGenerateCredentials}
                  onChange={(e) => setAutoGenerateCredentials(e.target.checked)}
                  className="h-4 w-4 text-[#F5821F] rounded border-slate-300 focus:ring-[#F5821F]"
                />
                <Label htmlFor="autoGenerate" className="text-xs text-slate-700 cursor-pointer">
                  Gerar automaticamente
                </Label>
              </div>
            </div>

            {autoGenerateCredentials && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-800">
                    As credenciais serão geradas automaticamente com base no nome do docente.
                    Você pode editá-las manualmente desmarcando a opção acima.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="usuario" className="text-sm font-semibold">
                  Usuário <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="usuario"
                    value={formData.usuario}
                    onChange={(e) => handleInputChange('usuario', e.target.value)}
                    placeholder="usuario.docente"
                    disabled={autoGenerateCredentials}
                    className={`h-11 pl-10 ${autoGenerateCredentials ? 'bg-slate-100' : ''} ${errors.usuario ? 'border-red-500' : 'border-slate-300'}`}
                  />
                </div>
                {errors.usuario && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.usuario}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha" className="text-sm font-semibold">
                  Senha <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="senha"
                    type={showPassword ? "text" : "password"}
                    value={formData.senha}
                    onChange={(e) => handleInputChange('senha', e.target.value)}
                    placeholder="••••••••"
                    disabled={autoGenerateCredentials}
                    className={`h-11 pl-10 pr-10 ${autoGenerateCredentials ? 'bg-slate-100' : ''} ${errors.senha ? 'border-red-500' : 'border-slate-300'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.senha && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.senha}
                  </p>
                )}
              </div>
            </div>

            {formData.usuario && formData.senha && (
              <div className="mt-4 p-3 bg-white border border-slate-200 rounded-lg">
                <p className="text-xs text-slate-600 mb-2 font-semibold">
                  📋 Credenciais que serão criadas:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-500">Usuário:</span>
                    <span className="ml-2 text-[#004B87] font-semibold">{formData.usuario}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Senha:</span>
                    <span className="ml-2 text-[#004B87] font-semibold">{formData.senha}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Seção 6: Informações Adicionais */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
              <Phone className="h-5 w-5 text-[#F5821F]" />
              <h3 className="text-lg font-bold text-[#004B87]">Informações Adicionais (Opcional)</h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* DOIS CAMPOS NUMÉRICOS DE CONTATO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact1" className="text-sm font-semibold">
                    Contato de Emergência 1
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="emergencyContact1"
                      type="tel"
                      value={formData.emergencyContact1}
                      onChange={(e) => handleInputChange('emergencyContact1', e.target.value)}
                      placeholder="+258 84 000 0000"
                      className="h-11 pl-10 border-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact2" className="text-sm font-semibold">
                    Contato de Emergência 2
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="emergencyContact2"
                      type="tel"
                      value={formData.emergencyContact2}
                      onChange={(e) => handleInputChange('emergencyContact2', e.target.value)}
                      placeholder="+258 85 000 0000"
                      className="h-11 pl-10 border-slate-300"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-semibold">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Observações adicionais sobre o docente..."
                  rows={3}
                  className="border-slate-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer com Botões */}
        <div className="flex justify-between items-center gap-3 pt-4 border-t-2 border-slate-200">
          <p className="text-xs text-slate-500">
            <span className="text-red-500">*</span> Campos obrigatórios
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="border-2 border-slate-300 hover:bg-slate-100"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-[#F5821F] to-[#FF9933] hover:from-[#E07318] hover:to-[#F58820] text-white shadow-lg"
            >
              <Save className="h-4 w-4 mr-2" />
              Cadastrar Docente
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}