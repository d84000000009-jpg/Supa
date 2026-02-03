// src/components/shared/TeacherProfileModal.tsx - VERSÃO MODERNIZADA
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Phone, 
  Mail, 
  GraduationCap, 
  Clock, 
  Award,
  Edit,
  Save,
  X,
  Users,
  BookOpen,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface Teacher {
  id: number;
  name: string;
  email: string;
  classes: number;
  students: number;
  status: "active" | "inactive";
  phone?: string;
  specialization?: string;
  contractType?: string;
  experience?: string;
  qualifications?: string;
  salary?: number;
}

interface TeacherProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
  onSave?: (updatedTeacher: Teacher) => void;
}

export function TeacherProfileModal({ 
  isOpen, 
  onClose, 
  teacher, 
  onSave 
}: TeacherProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Teacher | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (teacher && isOpen) {
      setFormData({ ...teacher });
      setIsEditing(false);
      setErrors({});
    }
  }, [teacher, isOpen]);

  if (!teacher || !formData) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (formData.phone && !/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = "Telefone inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = () => {
    setIsEditing(true);
    setErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ ...teacher });
    setErrors({});
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    if (formData && onSave) {
      onSave(formData);
    }
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleStatusChange = (newStatus: "active" | "inactive") => {
    if (isEditing) {
      setFormData(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const formatSalary = (salary?: number) => {
    if (!salary) return "Não informado";
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(salary);
  };

  const getContractTypeLabel = (contractType?: string) => {
    const types: { [key: string]: string } = {
      'full-time': 'Integral',
      'part-time': 'Parcial', 
      'freelance': 'Freelancer',
      'substitute': 'Substituto'
    };
    return types[contractType || ''] || contractType || "Não informado";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl max-h-[95vh] p-0 flex flex-col">
        {/* Header com Gradiente */}
        <div className="bg-gradient-to-r from-[#004B87] to-[#0066B3] p-5 rounded-t-lg flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">Perfil do Docente</span>
                  {isEditing && (
                    <Badge variant="secondary" className="ml-3 bg-white/90 text-[#004B87]">
                      <Edit className="h-3 w-3 mr-1" />
                      Editando
                    </Badge>
                  )}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="space-y-5 p-5 overflow-y-auto flex-1">
          {/* Header Card com Avatar e Info Principal */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-[#F5821F] to-[#FF9933]"></div>
            <CardContent className="p-5">
              <div className="flex items-center gap-5">
                {/* Avatar Grande */}
                <div className="relative">
                  <div className="h-20 w-20 bg-gradient-to-br from-[#004B87] to-[#0066B3] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  {/* Status Badge no Avatar */}
                  <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-white ${
                    formData.status === "active" ? "bg-green-500" : "bg-red-500"
                  }`}></div>
                </div>

                {/* Informações Principais */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-[#004B87] truncate">{formData.name}</h3>
                    <Badge 
                      variant={formData.status === "active" ? "default" : "destructive"}
                      className={`flex items-center gap-1 ${
                        formData.status === "active" 
                          ? "bg-green-600 hover:bg-green-700" 
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {formData.status === "active" ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      {formData.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="h-7 w-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="h-3.5 w-3.5 text-[#004B87]" />
                      </div>
                      <span className="truncate">{formData.email}</span>
                    </div>
                    
                    {formData.phone && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="h-7 w-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Phone className="h-3.5 w-3.5 text-[#004B87]" />
                        </div>
                        <span>{formData.phone}</span>
                      </div>
                    )}
                    
                    {formData.specialization && (
                      <div className="flex items-center gap-2 text-sm text-slate-600 md:col-span-2">
                        <div className="h-7 w-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Award className="h-3.5 w-3.5 text-[#004B87]" />
                        </div>
                        <span className="truncate">{formData.specialization}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botão Editar */}
                {!isEditing && onSave && (
                  <Button 
                    onClick={handleEdit} 
                    className="flex-shrink-0 bg-gradient-to-r from-[#004B87] to-[#0066B3] hover:from-[#003d6e] hover:to-[#00528f] text-white shadow-md h-10"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cards de Estatísticas - Modernos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-3">
                <div className="flex flex-col items-center text-center">
                  <div className="h-10 w-10 bg-gradient-to-br from-[#004B87] to-[#0066B3] rounded-xl flex items-center justify-center mb-2 shadow-md">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-[#004B87] mb-0.5">{formData.classes}</div>
                  <div className="text-xs text-slate-600 font-medium">Turmas</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-3">
                <div className="flex flex-col items-center text-center">
                  <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-2 shadow-md">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-0.5">{formData.students}</div>
                  <div className="text-xs text-slate-600 font-medium">Estudantes</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-3">
                <div className="flex flex-col items-center text-center">
                  <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-2 shadow-md">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-sm font-bold text-purple-600 mb-0.5">
                    {getContractTypeLabel(formData.contractType)}
                  </div>
                  <div className="text-xs text-slate-600 font-medium">Contrato</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-3">
                <div className="flex flex-col items-center text-center">
                  <div className="h-10 w-10 bg-gradient-to-br from-[#F5821F] to-[#FF9933] rounded-xl flex items-center justify-center mb-2 shadow-md">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-sm font-bold text-[#F5821F] mb-0.5 truncate px-2">
                    {formData.salary ? formatSalary(formData.salary) : "N/A"}
                  </div>
                  <div className="text-xs text-slate-600 font-medium">Salário</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulário Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Coluna 1 - Informações Pessoais */}
            <Card className="border-0 shadow-lg">
              <div className="h-1 bg-gradient-to-r from-[#004B87] to-[#0066B3]"></div>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-[#004B87]">
                  <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 text-[#004B87]" />
                  </div>
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 font-medium">
                    Nome Completo <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`h-11 ${!isEditing ? "bg-slate-50 border-slate-200" : "border-2 focus:border-[#F5821F]"}`}
                    placeholder="Digite o nome completo"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`h-11 ${!isEditing ? "bg-slate-50 border-slate-200" : "border-2 focus:border-[#F5821F]"}`}
                    placeholder="exemplo@m007.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700 font-medium">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    placeholder="+258 84 000 0000"
                    disabled={!isEditing}
                    className={`h-11 ${!isEditing ? "bg-slate-50 border-slate-200" : "border-2 focus:border-[#F5821F]"}`}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contractType" className="text-slate-700 font-medium">Tipo de Contrato</Label>
                  {isEditing ? (
                    <select
                      name="contractType"
                      value={formData.contractType || ""}
                      onChange={(e) => handleSelectChange('contractType', e.target.value)}
                      className="w-full h-11 px-3 border-2 rounded-lg bg-white focus:border-[#F5821F] focus:outline-none focus:ring-2 focus:ring-[#F5821F]/20"
                    >
                      <option value="">Selecione...</option>
                      <option value="full-time">Integral</option>
                      <option value="part-time">Parcial</option>
                      <option value="freelance">Freelancer</option>
                      <option value="substitute">Substituto</option>
                    </select>
                  ) : (
                    <Input
                      value={getContractTypeLabel(formData.contractType)}
                      disabled
                      className="h-11 bg-slate-50 border-slate-200"
                    />
                  )}
                </div>

                {isEditing && (
                  <div className="space-y-2">
                    <Label htmlFor="salary" className="text-slate-700 font-medium">Salário (MZN)</Label>
                    <Input
                      id="salary"
                      name="salary"
                      type="number"
                      value={formData.salary || ""}
                      onChange={(e) => setFormData(prev => prev ? { 
                        ...prev, 
                        salary: e.target.value ? Number(e.target.value) : undefined 
                      } : null)}
                      placeholder="0"
                      min="0"
                      className="h-11 border-2 focus:border-[#F5821F]"
                    />
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  <Label className="text-slate-700 font-medium">Status do Docente</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={formData.status === "active" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange("active")}
                      disabled={!isEditing}
                      className={`flex-1 h-10 ${
                        formData.status === "active" 
                          ? "bg-green-600 hover:bg-green-700" 
                          : "border-2 border-slate-200"
                      }`}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Ativo
                    </Button>
                    <Button
                      type="button"
                      variant={formData.status === "inactive" ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange("inactive")}
                      disabled={!isEditing}
                      className={`flex-1 h-10 ${
                        formData.status === "inactive" 
                          ? "bg-red-600 hover:bg-red-700" 
                          : "border-2 border-slate-200"
                      }`}
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Inativo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coluna 2 - Informações Acadêmicas */}
            <Card className="border-0 shadow-lg">
              <div className="h-1 bg-gradient-to-r from-[#F5821F] to-[#FF9933]"></div>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-[#004B87]">
                  <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 text-[#F5821F]" />
                  </div>
                  Informações Acadêmicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="specialization" className="text-slate-700 font-medium">Especializações</Label>
                  <Input
                    id="specialization"
                    name="specialization"
                    value={formData.specialization || ""}
                    onChange={handleInputChange}
                    placeholder="Ex: Business English, IELTS, Conversação"
                    disabled={!isEditing}
                    className={`h-11 ${!isEditing ? "bg-slate-50 border-slate-200" : "border-2 focus:border-[#F5821F]"}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qualifications" className="text-slate-700 font-medium">Qualificações</Label>
                  <textarea
                    id="qualifications"
                    name="qualifications"
                    value={formData.qualifications || ""}
                    onChange={handleTextareaChange}
                    className={`w-full p-3 border-2 rounded-lg h-36 resize-none ${
                      !isEditing 
                        ? "bg-slate-50 border-slate-200 cursor-not-allowed" 
                        : "focus:border-[#F5821F] focus:outline-none focus:ring-2 focus:ring-[#F5821F]/20"
                    }`}
                    placeholder="Licenciatura, mestrado, certificações, cursos..."
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-slate-700 font-medium">Experiência Profissional</Label>
                  <textarea
                    id="experience"
                    name="experience"
                    value={formData.experience || ""}
                    onChange={handleTextareaChange}
                    className={`w-full p-3 border-2 rounded-lg h-36 resize-none ${
                      !isEditing 
                        ? "bg-slate-50 border-slate-200 cursor-not-allowed" 
                        : "focus:border-[#F5821F] focus:outline-none focus:ring-2 focus:ring-[#F5821F]/20"
                    }`}
                    placeholder="Descreva a experiência profissional, anos de ensino, especialidades..."
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer com Botões de Ação - FIXO */}
        <div className="flex justify-end gap-3 p-5 border-t-2 border-slate-100 bg-slate-50/50 flex-shrink-0">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="h-11 px-6 border-2 border-slate-300 hover:bg-slate-100"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button 
                onClick={handleSave} 
                className="h-11 px-6 bg-gradient-to-r from-[#004B87] to-[#0066B3] hover:from-[#003d6e] hover:to-[#00528f] text-white shadow-md"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="h-11 px-6 border-2 border-slate-300 hover:bg-slate-100"
              >
                Fechar
              </Button>
              {onSave && (
                <Button 
                  onClick={handleEdit} 
                  className="h-11 px-6 bg-gradient-to-r from-[#004B87] to-[#0066B3] hover:from-[#003d6e] hover:to-[#00528f] text-white shadow-md"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}