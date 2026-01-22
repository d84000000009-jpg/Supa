// src/components/shared/AnnouncementModal.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Bell,
  Save,
  X,
  AlertTriangle,
  Info,
  CheckCircle,
  Calendar,
  Users
} from "lucide-react";
import { Announcement, Class, AnnouncementPriority } from "../../types";

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (announcementData: Omit<Announcement, 'id'>) => void;
  availableClasses: Class[];
  teacherId: number;
}

export function AnnouncementModal({ 
  isOpen, 
  onClose, 
  onSave,
  availableClasses,
  teacherId
}: AnnouncementModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium' as AnnouncementPriority,
    classId: 0, // 0 = todas as turmas
    targetAudience: 'students' as const,
    isActive: true,
    expiresAt: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const priorityOptions = [
    { value: 'low', label: 'Baixa', icon: Info, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { value: 'medium', label: 'Média', icon: Bell, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { value: 'high', label: 'Alta', icon: AlertTriangle, color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { value: 'urgent', label: 'Urgente', icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-100' }
  ];

  const handleInputChange = (field: string, value: string | number | boolean) => {
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Conteúdo é obrigatório';
    }

    if (formData.expiresAt) {
      const expiryDate = new Date(formData.expiresAt);
      const today = new Date();
      if (expiryDate <= today) {
        newErrors.expiresAt = 'Data de expiração deve ser futura';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const announcementData = {
        ...formData,
        date: new Date().toISOString(),
        authorId: teacherId,
        classId: formData.classId === 0 ? undefined : formData.classId
      };
      onSave(announcementData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      content: '',
      priority: 'medium',
      classId: 0,
      targetAudience: 'students',
      isActive: true,
      expiresAt: ''
    });
    setErrors({});
    onClose();
  };

  const selectedPriority = priorityOptions.find(p => p.value === formData.priority);
  const selectedClass = availableClasses.find(c => c.id === formData.classId);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Criar Novo Aviso
              </DialogTitle>
              <DialogDescription>
                Envie um comunicado para suas turmas
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações do Aviso</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">Título do Aviso *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Ex: Prova marcada para próxima semana"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Descreva os detalhes do aviso..."
                rows={4}
                className={errors.content ? 'border-red-500' : ''}
              />
              {errors.content && (
                <p className="text-sm text-red-500">{errors.content}</p>
              )}
            </div>
          </div>

          {/* Configurações do Aviso */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configurações</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prioridade</Label>
                <div className="grid grid-cols-2 gap-2">
                  {priorityOptions.map((priority) => {
                    const IconComponent = priority.icon;
                    return (
                      <button
                        key={priority.value}
                        type="button"
                        onClick={() => handleInputChange('priority', priority.value)}
                        className={`p-3 border rounded-lg flex items-center gap-2 transition-all ${
                          formData.priority === priority.value
                            ? `border-current ${priority.bgColor} ${priority.color}`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm font-medium">{priority.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="classId">Turma de Destino</Label>
                <select
                  id="classId"
                  value={formData.classId}
                  onChange={(e) => handleInputChange('classId', Number(e.target.value))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value={0}>Todas as minhas turmas</option>
                  {availableClasses.map((classItem) => (
                    <option key={classItem.id} value={classItem.id}>
                      {classItem.name} ({classItem.students} estudantes)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetAudience">Público Alvo</Label>
                <select
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="students">Estudantes</option>
                  {/* <option value="teachers">Professores</option>
                  <option value="all">Todos</option> */}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresAt">Data de Expiração (Opcional)</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="expiresAt"
                    type="datetime-local"
                    value={formData.expiresAt}
                    onChange={(e) => handleInputChange('expiresAt', e.target.value)}
                    className={`pl-10 ${errors.expiresAt ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.expiresAt && (
                  <p className="text-sm text-red-500">{errors.expiresAt}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="rounded"
              />
              <label htmlFor="isActive" className="text-sm font-medium">
                Publicar aviso imediatamente
              </label>
            </div>
          </div>

          {/* Preview do Aviso */}
          {formData.title && formData.content && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Preview do Aviso</h3>
              <div className="p-4 bg-muted/20 rounded-lg border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {selectedPriority && (
                      <div className={`p-2 rounded-lg ${selectedPriority.bgColor}`}>
                        <selectedPriority.icon className={`h-4 w-4 ${selectedPriority.color}`} />
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold">{formData.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {formData.classId === 0 ? 'Todas as turmas' : selectedClass?.name}
                        <span>•</span>
                        <span>Agora</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={formData.priority === 'urgent' ? 'destructive' : 'default'}>
                    {selectedPriority?.label} Prioridade
                  </Badge>
                </div>
                
                <p className="text-sm mb-3">{formData.content}</p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Para: {formData.targetAudience === 'students' ? 'Estudantes' : 'Todos'}</span>
                  {formData.expiresAt && (
                    <span>
                      Expira: {new Date(formData.expiresAt).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Dicas */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">Dicas para um bom aviso:</p>
                <ul className="text-blue-700 space-y-1 list-disc list-inside">
                  <li>Use títulos claros e objetivos</li>
                  <li>Inclua datas e horários específicos quando relevante</li>
                  <li>Defina a prioridade adequada para o tipo de informação</li>
                  <li>Para avisos urgentes, considere também comunicação direta</li>
                </ul>
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
            {formData.isActive ? 'Publicar Aviso' : 'Salvar Rascunho'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}