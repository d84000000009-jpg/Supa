// src/components/shared/ClassModal.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, 
  Users, 
  Calendar,
  Clock,
  BookOpen,
  FileText,
  Save,
  UserPlus,
  Trash2,
  Edit,
  Bell,
  X
} from "lucide-react";
import { Class, Permission, Announcement } from "../../types";

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData?: Class | null;
  permissions: Permission;
  currentUserRole: 'teacher' | 'admin';
  onSave: (classData: Partial<Class>) => void;
  onDelete?: (classId: number) => void;
  isCreating?: boolean;
}

export function ClassModal({ 
  isOpen, 
  onClose, 
  classData, 
  permissions,
  currentUserRole,
  onSave,
  onDelete,
  isCreating = false
}: ClassModalProps) {
  const [formData, setFormData] = useState<Partial<Class>>({
    name: '',
    description: '',
    schedule: '',
    duration: '',
    capacity: 20,
    startDate: '',
    endDate: '',
    room: '',
    status: 'active',
    students: 0
  });

const [announcements] = useState<Announcement[]>([
  {
    id: 1,
    title: "Prova marcada para próxima semana",
    content: "A prova do módulo 3 será na quarta-feira, dia 21/02",
    date: "2024-02-14",
    priority: "high",
    authorId: 1,
    targetAudience: "students",  
    isActive: true               
  },
  {
    id: 2,
    title: "Material disponível",
    content: "Novo material de listening disponível na plataforma",
    date: "2024-02-13",
    priority: "medium",
    authorId: 1,
    targetAudience: "students",
    isActive: true
  }
]);
                                                                                                                                                                                                                                                                                                                                                                                                                       

  const [scheduleEntries, setScheduleEntries] = useState([
    { day: 'Segunda-feira', startTime: '14:00', endTime: '15:30' },
    { day: 'Quarta-feira', startTime: '14:00', endTime: '15:30' }
  ]);

  useEffect(() => {
    if (classData) {
      setFormData({
        ...classData
      });
    } else if (isCreating) {
      setFormData({
        name: '',
        description: '',
        schedule: '',
        duration: '1h30min',
        capacity: 20,
        startDate: '',
        endDate: '',
        room: '',
        status: 'active',
        students: 0
      });
    }
  }, [classData, isCreating, isOpen]);

  const handleInputChange = (field: keyof Class, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    if (classData?.id && onDelete) {
      onDelete(classData.id);
      onClose();
    }
  };

  const addScheduleEntry = () => {
    setScheduleEntries(prev => [...prev, { day: 'Segunda-feira', startTime: '09:00', endTime: '10:30' }]);
  };

  const removeScheduleEntry = (index: number) => {
    setScheduleEntries(prev => prev.filter((_, i) => i !== index));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {isCreating ? 'Criar Nova Turma' : `Gerenciar Turma - ${formData.name}`}
          </DialogTitle>
          <DialogDescription>
            {isCreating 
              ? 'Configure as informações da nova turma'
              : 'Gerencie as configurações, estudantes e conteúdo da turma'
            }
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="settings" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Cronograma
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="announcements" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Avisos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>Configure os dados principais da turma</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="className">Nome da Turma *</Label>
                    <Input
                      id="className"
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Ex: Business English - A2"
                      disabled={!permissions.canEdit}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="room">Sala</Label>
                    <Input
                      id="room"
                      value={formData.room || ''}
                      onChange={(e) => handleInputChange('room', e.target.value)}
                      placeholder="Ex: Sala 105"
                      disabled={!permissions.canEdit}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacidade Máxima</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={formData.capacity || ''}
                      onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                      min="1"
                      max="50"
                      disabled={!permissions.canEdit}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duração da Aula</Label>
                    <Input
                      id="duration"
                      value={formData.duration || ''}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      placeholder="Ex: 1h30min"
                      disabled={!permissions.canEdit}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Data de Início</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate || ''}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      disabled={!permissions.canEdit}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Data de Término</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate || ''}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      disabled={!permissions.canEdit}
                    />
                  </div>

                  {currentUserRole === 'admin' && (
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <select 
                        id="status"
                        value={formData.status || 'active'}
                        onChange={(e) => handleInputChange('status', e.target.value as any)}
                        className="w-full p-2 border rounded-md"
                        disabled={!permissions.canEdit}
                      >
                        <option value="active">Ativa</option>
                        <option value="inactive">Inativa</option>
                        <option value="completed">Concluída</option>
                      </select>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    placeholder="Descreva o conteúdo e objetivos da turma..."
                    disabled={!permissions.canEdit}
                  />
                </div>
              </CardContent>
            </Card>

            {!isCreating && (
              <Card>
                <CardHeader>
                  <CardTitle>Status da Turma</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{formData.students || 0}/{formData.capacity || 0} estudantes</span>
                      </div>
                      <Badge variant={formData.status === "active" ? "default" : "secondary"}>
                        {formData.status === "active" ? "Ativa" : formData.status === "inactive" ? "Inativa" : "Concluída"}
                      </Badge>
                    </div>
                    <div className="space-x-2">
                      {permissions.canAdd && (
                        <Button variant="outline">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Adicionar Estudante
                        </Button>
                      )}
                      {permissions.canDelete && currentUserRole === 'admin' && (
                        <Button variant="destructive" size="sm" onClick={handleDelete}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Arquivar Turma
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Horários das Aulas</CardTitle>
                <CardDescription>Configure os dias e horários das aulas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {permissions.canEdit && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>Dia da Semana</Label>
                          <select className="w-full p-2 border rounded-md">
                            <option>Segunda-feira</option>
                            <option>Terça-feira</option>
                            <option>Quarta-feira</option>
                            <option>Quinta-feira</option>
                            <option>Sexta-feira</option>
                            <option>Sábado</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Horário de Início</Label>
                          <Input type="time" defaultValue="14:00" />
                        </div>
                        <div className="space-y-2">
                          <Label>Horário de Fim</Label>
                          <Input type="time" defaultValue="15:30" />
                        </div>
                        <div className="space-y-2">
                          <Label>&nbsp;</Label>
                          <Button variant="outline" onClick={addScheduleEntry}>
                            <Clock className="h-4 w-4 mr-2" />
                            Adicionar
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Horários Configurados</h4>
                    <div className="space-y-2">
                      {scheduleEntries.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{entry.day}: {entry.startTime} - {entry.endTime}</span>
                          </div>
                          {permissions.canEdit && (
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeScheduleEntry(index)}
                                className="text-destructive hover:text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plano de Aulas</CardTitle>
                <CardDescription>Organize o conteúdo programático da turma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {permissions.canAdd && (
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Criar Nova Aula
                    </Button>
                  )}
                  
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((lesson) => (
                      <div key={lesson} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">Aula {lesson}: Business Vocabulary</h4>
                          <p className="text-sm text-muted-foreground">
                            Introdução ao vocabulário empresarial básico
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Planejada</Badge>
                          {permissions.canEdit && (
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Avisos da Turma</CardTitle>
                    <CardDescription>Gerencie comunicados para os estudantes</CardDescription>
                  </div>
                  {permissions.canAdd && (
                    <Button variant="outline">
                      <Bell className="h-4 w-4 mr-2" />
                      Novo Aviso
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{announcement.title}</h4>
                        <Badge variant={getPriorityColor(announcement.priority)}>
                          {getPriorityText(announcement.priority)} Prioridade
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {announcement.content}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          {new Date(announcement.date).toLocaleDateString('pt-BR')}
                        </span>
                        {permissions.canEdit && (
                          <div className="space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <div>
            {!isCreating && permissions.canDelete && currentUserRole === 'admin' && (
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Deletar Turma
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            {permissions.canEdit && (
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                {isCreating ? 'Criar Turma' : 'Salvar Alterações'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}