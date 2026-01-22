// src/components/shared/CreateAssignmentModal.tsx
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
  Plus,
  Save,
  X,
  Calendar,
  FileText,
  Clock,
  Users
} from "lucide-react";
import { Assignment, Class } from "../../types";

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assignmentData: Omit<Assignment, 'id'>) => void;
  availableClasses: Class[];
  teacherId: number;
}

export function CreateAssignmentModal({ 
  isOpen, 
  onClose, 
  onSave,
  availableClasses,
  teacherId
}: CreateAssignmentModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'exercise' as const,
    classId: 0,
    class: '',
    dueDate: '',
    maxScore: 10,
    instructions: '',
    submissions: 0,
    total: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const assignmentTypes = [
    { value: 'essay', label: 'Redação/Ensaio', icon: '📝' },
    { value: 'exercise', label: 'Exercícios', icon: '📚' },
    { value: 'presentation', label: 'Apresentação', icon: '🎤' },
    { value: 'exam', label: 'Prova', icon: '📄' },
    { value: 'project', label: 'Projeto', icon: '🛠️' },
    { value: 'quiz', label: 'Quiz', icon: '❓' }
  ];

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

    // Auto-fill class name and total students when classId changes
    if (field === 'classId') {
      const selectedClass = availableClasses.find(c => c.id === Number(value));
      if (selectedClass) {
        setFormData(prev => ({
          ...prev,
          class: selectedClass.name,
          total: selectedClass.students
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.classId) {
      newErrors.classId = 'Selecione uma turma';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Data de entrega é obrigatória';
    } else {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      if (dueDate <= today) {
        newErrors.dueDate = 'Data de entrega deve ser futura';
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const assignmentData = {
        ...formData,
        createdAt: new Date().toISOString(),
        authorId: teacherId
      };
      onSave(assignmentData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      type: 'exercise',
      classId: 0,
      class: '',
      dueDate: '',
      maxScore: 10,
      instructions: '',
      submissions: 0,
      total: 0
    });
    setErrors({});
    onClose();
  };

  const selectedType = assignmentTypes.find(t => t.value === formData.type);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Criar Nova Atividade
              </DialogTitle>
              <DialogDescription>
                Configure uma nova atividade para suas turmas
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
                <Label htmlFor="title">Título da Atividade *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Exercícios de Grammar Unit 5"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Atividade</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {assignmentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descreva objetivos e resumo da atividade..."
                rows={3}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Configurações da Turma */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Turma e Prazo</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="classId">Turma *</Label>
                <select
                  id="classId"
                  value={formData.classId}
                  onChange={(e) => handleInputChange('classId', Number(e.target.value))}
                  className={`w-full p-2 border rounded-md ${errors.classId ? 'border-red-500' : ''}`}
                >
                  <option value={0}>Selecione uma turma</option>
                  {availableClasses.map((classItem) => (
                    <option key={classItem.id} value={classItem.id}>
                      {classItem.name} ({classItem.students} estudantes)
                    </option>
                  ))}
                </select>
                {errors.classId && (
                  <p className="text-sm text-red-500">{errors.classId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Data de Entrega *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dueDate"
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className={`pl-10 ${errors.dueDate ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.dueDate && (
                  <p className="text-sm text-red-500">{errors.dueDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxScore">Pontuação Máxima</Label>
                <Input
                  id="maxScore"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.maxScore}
                  onChange={(e) => handleInputChange('maxScore', Number(e.target.value))}
                  placeholder="10"
                />
              </div>
            </div>
          </div>

          {/* Instruções Detalhadas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Instruções Detalhadas</h3>
            
            <div className="space-y-2">
              <Label htmlFor="instructions">Instruções para os Estudantes</Label>
              <Textarea
                id="instructions"
                value={formData.instructions}
                onChange={(e) => handleInputChange('instructions', e.target.value)}
                placeholder="Instruções específicas sobre como completar a atividade, critérios de avaliação, formato de entrega, etc..."
                rows={4}
              />
            </div>
          </div>

          {/* Preview da Atividade */}
          {formData.title && formData.classId && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Preview da Atividade</h3>
              <div className="p-4 bg-muted/20 rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedType?.icon}</span>
                    <div>
                      <h4 className="font-semibold">{formData.title}</h4>
                      <p className="text-sm text-muted-foreground">{formData.class}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Prazo</div>
                    <div className="font-medium">
                      {formData.dueDate && new Date(formData.dueDate).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {formData.total} estudantes
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Máximo: {formData.maxScore} pontos
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {selectedType?.label}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Criar Atividade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}