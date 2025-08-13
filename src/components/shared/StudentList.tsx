// src/components/shared/StudentList.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Settings,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  BookOpen,
  Edit,
  Trash2
} from "lucide-react";
import { Student, Permission } from "../../types";

interface StudentListProps {
  students: Student[];
  permissions: Permission;
  currentUserRole: 'teacher' | 'admin';
  showClassInfo?: boolean;
  onViewStudent?: (student: Student) => void;
  onEditStudent?: (student: Student) => void;
  onDeleteStudent?: (studentId: number) => void;
  onAddStudent?: () => void;
  onSendEmailToAll?: () => void;
}

export function StudentList({ 
  students, 
  permissions, 
  currentUserRole,
  showClassInfo = true,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  onAddStudent,
  onSendEmailToAll
}: StudentListProps) {

  const getAttendanceColor = (attendance?: number) => {
    if (!attendance) return "text-muted-foreground";
    if (attendance >= 90) return "text-green-600";
    if (attendance >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 9) return "text-green-600";
    if (grade >= 7) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Estudantes</CardTitle>
            <CardDescription>
              {currentUserRole === 'admin' 
                ? 'Gerenciar todos os estudantes do sistema'
                : 'Gerenciar estudantes das suas turmas'
              }
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {permissions.canAdd && onAddStudent && (
              <Button variant="outline" onClick={onAddStudent}>
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            )}
            {onSendEmailToAll && students.length > 0 && (
              <Button variant="outline" onClick={onSendEmailToAll}>
                <Mail className="h-4 w-4 mr-2" />
                Email para Todos
              </Button>
            )}
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>
      </CardHeader>       
      <CardContent>
        {students.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Nenhum estudante encontrado</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Não há estudantes cadastrados nesta turma
            </p>
            {permissions.canAdd && onAddStudent && (
              <Button variant="outline" onClick={onAddStudent}>
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Estudante
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Total: {students.length} estudantes</span>
              <span>
                Ativos: {students.filter(s => s.status === "active").length}
              </span>
            </div>
            
            <div className="space-y-4">
              {students.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{student.name}</h3>
                        <Badge variant={student.status === "active" ? "default" : "destructive"}>
                          {student.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {student.email}
                        </div>
                        {student.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {student.phone}
                          </div>
                        )}
                        {showClassInfo && (
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {student.className}
                          </div>
                        )}
                        {student.enrollmentDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Matrícula: {new Date(student.enrollmentDate).toLocaleDateString('pt-BR')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className={`text-lg font-bold ${getGradeColor(student.grade)}`}>
                        {student.grade}
                      </div>
                      <div className="text-xs text-muted-foreground">Média</div>
                    </div>
                    
                    {student.attendance && (
                      <div className="text-center">
                        <div className={`text-lg font-bold ${getAttendanceColor(student.attendance)}`}>
                          {student.attendance}%
                        </div>
                        <div className="text-xs text-muted-foreground">Presença</div>
                      </div>
                    )}
                    
                    <div className="flex gap-1">
                      {currentUserRole === 'teacher' && (
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {permissions.canViewDetails && onViewStudent && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onViewStudent(student)}
                        >
                          <BookOpen className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {permissions.canEdit && onEditStudent && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onEditStudent(student)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {permissions.canDelete && onDeleteStudent && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onDeleteStudent(student.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}