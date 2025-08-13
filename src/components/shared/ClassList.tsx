// src/components/shared/ClassList.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  BookOpen, 
  UserPlus,
  Eye,
  Settings,
  Trash2,
  Clock,
  MapPin,
  GraduationCap
} from "lucide-react";
import { Class, Permission } from "../../types";

interface ClassListProps {
  classes: Class[];
  permissions: Permission;
  currentUserRole: string;
  onViewStudents: (classItem: Class) => void;
  onManageClass: (classItem: Class) => void;
  onCreateClass: () => void;
  onDeleteClass?: (classId: number) => void;
  onAddStudentToClass: (classItem: Class) => void;
  onLaunchGrades?: (classItem: Class) => void;
}

export function ClassList({
  classes,
  permissions,
  currentUserRole,
  onViewStudents,
  onManageClass,
  onCreateClass,
  onDeleteClass,
  onAddStudentToClass,
  onLaunchGrades
}: ClassListProps) {

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'ativa':
        return 'default';
      case 'inactive':
      case 'inativa':
        return 'secondary';
      case 'completed':
      case 'concluída':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'ativa':
        return 'Ativa';
      case 'inactive':
      case 'inativa':
        return 'Inativa';
      case 'completed':
      case 'concluída':
        return 'Concluída';
      default:
        return 'Ativa';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header - Modificado: Professor não pode criar turmas */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {currentUserRole === 'teacher' ? 'Minhas Turmas' : 'Todas as Turmas'}
        </h3>
        {permissions.canAdd && currentUserRole !== 'teacher' && (
          <Button variant="oxford" onClick={onCreateClass}>
            <BookOpen className="h-4 w-4 mr-2" />
            Nova Turma
          </Button>
        )}
      </div>

      {/* Lista de Turmas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <Card key={classItem.id} className="shadow-elegant hover:shadow-lg transition-shadow duration-200">
            {/* Header do Card */}
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-bold text-oxford-blue mb-1">
                    {classItem.name}
                  </CardTitle>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{classItem.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GraduationCap className="h-4 w-4" />
                      <span>Prof: {classItem.teacher}</span>
                    </div>
                  </div>
                </div>
                
                {permissions.canDelete && currentUserRole === 'admin' && onDeleteClass && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteClass(classItem.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>

            {/* Conteúdo do Card */}
            <CardContent className="space-y-4">
              {/* Informações da Turma */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-oxford-gold" />
                    <span className="text-sm font-medium">
                      {classItem.students}/20 estudantes
                    </span>
                  </div>
                  <Badge variant={getStatusColor(classItem.status || 'ativa')}>
                    {getStatusText(classItem.status || 'ativa')}
                  </Badge>
                </div>

                {classItem.room && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{classItem.room}</span>
                  </div>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="space-y-2">
                {/* Ver Estudantes */}
                <Button
                  variant="outline"
                  className="w-full justify-start hover:bg-oxford-blue/5 hover:border-oxford-blue hover:text-oxford-blue"
                  onClick={() => onViewStudents(classItem)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Estudantes
                </Button>

                {/* Gerenciar Turma */}
                {permissions.canEdit && (
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-oxford-gold/5 hover:border-oxford-gold hover:text-oxford-gold"
                    onClick={() => onManageClass(classItem)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Gerenciar
                  </Button>
                )}

                {/* Adicionar Estudantes - Disponível para professor e admin */}
                {permissions.canAdd && (
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-green-50 hover:border-green-500 hover:text-green-600 transition-colors"
                    onClick={() => onAddStudentToClass(classItem)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Adicionar Estudantes
                  </Button>
                )}

                {/* Lançar Notas - Disponível para professor */}
                {currentUserRole === 'teacher' && onLaunchGrades && (
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 transition-colors"
                    onClick={() => onLaunchGrades(classItem)}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Lançar Notas
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estado Vazio */}
      {classes.length === 0 && (
        <Card className="shadow-elegant">
          <CardContent className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {currentUserRole === 'teacher' 
                ? 'Nenhuma turma atribuída' 
                : 'Nenhuma turma encontrada'
              }
            </h3>
            <p className="text-muted-foreground mb-4">
              {currentUserRole === 'teacher' 
                ? 'Você ainda não possui turmas atribuídas. Entre em contato com a administração.'
                : 'Comece criando sua primeira turma para organizar os estudantes.'
              }
            </p>
            {permissions.canAdd && currentUserRole !== 'teacher' && (
              <Button variant="oxford" onClick={onCreateClass}>
                <BookOpen className="h-4 w-4 mr-2" />
                Criar Primeira Turma
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}