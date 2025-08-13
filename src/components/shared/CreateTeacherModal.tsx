// src/components/shared/CreateTeacherModal.tsx
import { useState } from "react";
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
  GraduationCap,
  Award
} from "lucide-react";
import { User } from "../../types";

interface CreateTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (teacherData: Omit<User, 'id'> & { 
    specializations: string[];
    experience: string;
    qualifications: string;
    salary?: number;
    contractType: string;
  }) => void;
}

export function CreateTeacherModal({ 
  isOpen, 
  onClose, 
  onSave 
}: CreateTeacherModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'teacher' as const,
    phone: '',
    specializations: [] as string[],
    experience: '',
    qualifications: '',
    salary: 0,
    contractType: 'full-time',
    startDate: new Date().toISOString().split('T')[0],
    birthDate: '',
    address: '',
    emergencyContact: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentSpecialization, setCurrentSpecialization] = useState('');

  const handleInputChange = (field: string, value: string | number | string[]) => {
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
  };

  const addSpecialization = () => {
    if (currentSpecialization.trim() && !formData.specializations.includes(currentSpecialization.trim())) {
      setFormData(prev => ({
        ...prev,
        specializations: [...prev.specializations, currentSpecialization.trim()]
      }));
      setCurrentSpecialization('');
    }
  };

  const removeSpecialization = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.filter(s => s !== spec)
    }));
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

    if (!formData.qualifications.trim()) {
      newErrors.qualifications = 'Qualificações são obrigatórias';
    }

    if (!formData.experience.trim()) {
      newErrors.experience = 'Experiência é obrigatória';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Data de início é obrigatória';
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
      role: 'teacher',
      phone: '',
      specializations: [],
      experience: '',
      qualifications: '',
      salary: 0,
      contractType: 'full-time',
      startDate: new Date().toISOString().split('T')[0],
      birthDate: '',
      address: '',
      emergencyContact: '',
      notes: ''
    });
    setCurrentSpecialization('');
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
                Cadastrar Novo Docente
              </DialogTitle>
              <DialogDescription>
                Preencha as informações do novo professor
              </DialogDescription>
            </div>
            {/* <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button> */}
          </div>
        </DialogHeader>

        <div className="space-y-6">
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
                  placeholder="Nome completo do professor"
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
                    placeholder="professor@m007.com"
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
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="qualifications">Qualificações *</Label>
                <div className="relative">
                  <Award className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="qualifications"
                    value={formData.qualifications}
                    onChange={(e) => handleInputChange('qualifications', e.target.value)}
                    placeholder="Ex: Licenciatura em Letras - Inglês, Certificado TEFL..."
                    rows={3}
                    className={`pl-10 ${errors.qualifications ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.qualifications && (
                  <p className="text-sm text-red-500">{errors.qualifications}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experiência *</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="Descreva a experiência profissional..."
                    rows={3}
                    className={`pl-10 ${errors.experience ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.experience && (
                  <p className="text-sm text-red-500">{errors.experience}</p>
                )}
              </div>

              {/* Especializacoes */}
              <div className="space-y-2">
                <Label>Especializações</Label>
                <div className="flex gap-2">
                  <Input
                    value={currentSpecialization}
                    onChange={(e) => setCurrentSpecialization(e.target.value)}
                    placeholder="Ex: Business English, IELTS, Conversação..."
                    onKeyPress={(e) => e.key === 'Enter' && addSpecialization()}
                  />
                  <Button type="button" variant="outline" onClick={addSpecialization}>
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.specializations.map((spec) => (
                    <div key={spec} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {spec}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-primary hover:text-destructive"
                        onClick={() => removeSpecialization(spec)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Informacoes Contratuais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações Contratuais</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contractType">Tipo de Contrato</Label>
                <select
                  id="contractType"
                  value={formData.contractType}
                  onChange={(e) => handleInputChange('contractType', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="full-time">Tempo Integral</option>
                  <option value="part-time">Meio Período</option>
                  <option value="freelance">Freelancer</option>
                  <option value="substitute">Substituto</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Data de Início *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={errors.startDate ? 'border-red-500' : ''}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500">{errors.startDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Salário (MT)</Label>
                <Input
                  id="salary"
                  type="number"
                  min="0"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', Number(e.target.value))}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações Adicionais</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Endereço completo"
                />
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
                  placeholder="Observações adicionais sobre o professor..."
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
            Cadastrar Docente
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}