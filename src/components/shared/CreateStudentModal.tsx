// src/components/shared/CreateStudentModal.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  MapPin,
  BookOpen,
  Lock,
  GraduationCap
} from "lucide-react";
import { Student, Class } from "../../types";

interface CreateStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentData: Omit<Student, 'id'>) => void;
  availableClasses: Class[];
  preSelectedClassId?: number;    // ← NOVA PROP
  preSelectedClassName?: string;  // ← NOVA PROP
}

export function CreateStudentModal({ 
  isOpen, 
  onClose, 
  onSave,
  availableClasses,
  preSelectedClassId,      // ← NOVA PROP
  preSelectedClassName     // ← NOVA PROP
}: CreateStudentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    classId: preSelectedClassId || 0,       // ← USA A TURMA PRÉ-SELECIONADA
    className: preSelectedClassName || '',   // ← USA O NOME DA TURMA
    grade: 0,
    status: 'active' as const,
    attendance: 100,
    enrollmentDate: new Date().toISOString().split('T')[0],
    birthDate: '',
    address: '',
    emergencyContact: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ← ATUALIZA QUANDO AS PROPS MUDAREM
  useEffect(() => {
    if (preSelectedClassId && preSelectedClassName) {
      setFormData(prev => ({
        ...prev,
        classId: preSelectedClassId,
        className: preSelectedClassName
      }));
    }
  }, [preSelectedClassId, preSelectedClassName]);

  // ← VERIFICA SE A TURMA FOI PRÉ-SELECIONADA
  const isClassPreSelected = Boolean(preSelectedClassId && preSelectedClassName);
  const selectedClass = availableClasses.find(c => c.id === formData.classId);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Auto-fill className when classId changes
    if (field === 'classId') {
      const selectedClass = availableClasses.find(c => c.id === Number(value));
      if (selectedClass) {
        setFormData(prev => ({
          ...prev,
          className: selectedClass.name
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.classId) {
      newErrors.classId = 'Selecione uma turma';
    }

    if (!formData.enrollmentDate) {
      newErrors.enrollmentDate = 'Data de matrícula é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      classId: preSelectedClassId || 0,       // ← MANTÉM A PRÉ-SELEÇÃO AO FECHAR
      className: preSelectedClassName || '',   // ← MANTÉM O NOME DA TURMA
      grade: 0,
      status: 'active',
      attendance: 100,
      enrollmentDate: new Date().toISOString().split('T')[0],
      birthDate: '',
      address: '',
      emergencyContact: '',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                {/* ← TÍTULO DINÂMICO */}
                {isClassPreSelected 
                  ? `Novo Estudante - ${preSelectedClassName}`
                  : 'Cadastrar Novo Estudante'
                }
              </DialogTitle>
              <DialogDescription>
                {/* ← DESCRIÇÃO DINÂMICA */}
                {isClassPreSelected 
                  ? `Adicionando estudante à turma ${preSelectedClassName}`
                  : 'Preencha as informações do novo estudante'
                }
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* ← CARD DA TURMA SELECIONADA (SE PRÉ-SELECIONADA) */}
          {isClassPreSelected && selectedClass && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900">{selectedClass.name}</h4>
                  <p className="text-sm text-blue-700">
                    📅 {selectedClass.schedule} • 👨‍🏫 {selectedClass.teacher}
                    {selectedClass.room && ` • 🏫 Sala ${selectedClass.room}`}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {selectedClass.students}/20 estudantes
                    </span>
                    <div className="flex items-center gap-1 text-xs text-blue-600">
                      <Lock className="h-3 w-3" />
                      <span>Turma pré-selecionada</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações Básicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Nome completo do estudante"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="email@exemplo.com"
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+258 84 123 4567"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Informações Acadêmicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações Acadêmicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ← SELEÇÃO DE TURMA (APENAS SE NÃO ESTIVER PRÉ-SELECIONADA) */}
              {!isClassPreSelected && (
                <div className="space-y-2">
                  <Label htmlFor="classId">Turma *</Label>
                  <select
                    id="classId"
                    value={formData.classId}
                    onChange={(e) => handleInputChange('classId', Number(e.target.value))}
                    className={`w-full p-2 border rounded-md ${errors.classId ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value={0}>Selecione uma turma</option>
                    {availableClasses.map((classItem) => (
                      <option key={classItem.id} value={classItem.id}>
                        {classItem.name} - {classItem.schedule}
                      </option>
                    ))}
                  </select>
                  {errors.classId && (
                    <p className="text-sm text-red-500">{errors.classId}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="enrollmentDate">Data de Matrícula *</Label>
                <Input
                  id="enrollmentDate"
                  type="date"
                  value={formData.enrollmentDate}
                  onChange={(e) => handleInputChange('enrollmentDate', e.target.value)}
                  className={errors.enrollmentDate ? 'border-red-500' : ''}
                />
                {errors.enrollmentDate && (
                  <p className="text-sm text-red-500">{errors.enrollmentDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade">Nota Inicial</Label>
                <Input
                  id="grade"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.grade}
                  onChange={(e) => handleInputChange('grade', Number(e.target.value))}
                  placeholder="0.0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações Adicionais</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Endereço completo"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Contato de Emergência</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  placeholder="Nome e telefone do responsável"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Observações adicionais sobre o estudante..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            {/* ← BOTÃO DINÂMICO */}
            {isClassPreSelected 
              ? `Adicionar à ${preSelectedClassName}`
              : 'Cadastrar Estudante'
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}