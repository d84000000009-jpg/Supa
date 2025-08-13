import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Users, 
  Mail, 
  Phone, 
  Calendar,
  BookOpen,
  MessageSquare,
  Star
} from "lucide-react";

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  enrollmentDate: string;
  grade: number;
  status: "active" | "inactive";
  attendance: number;
}

interface StudentListModalProps {
  isOpen: boolean;
  onClose: () => void;
  className: string;
  classId: number;
}

export function StudentListModal({ isOpen, onClose, className, classId }: StudentListModalProps) {
  const [students] = useState<Student[]>([
    {
      id: 1,
      name: "João Silva",
      email: "joao.silva@email.com",
      phone: "+258 84 123 4567",
      enrollmentDate: "2024-01-15",
      grade: 8.5,
      status: "active",
      attendance: 95
    },
    {
      id: 2,
      name: "Maria Oliveira",
      email: "maria.oliveira@email.com",
      phone: "+258 87 234 5678",
      enrollmentDate: "2024-01-10",
      grade: 9.2,
      status: "active",
      attendance: 98
    },
    {
      id: 3,
      name: "Pedro Santos",
      email: "pedro.santos@email.com",
      phone: "+258 82 345 6789",
      enrollmentDate: "2024-01-20",
      grade: 7.8,
      status: "active",
      attendance: 87
    },
    {
      id: 4,
      name: "Ana Costa",
      email: "ana.costa@email.com",
      phone: "+258 86 456 7890",
      enrollmentDate: "2024-01-08",
      grade: 8.9,
      status: "inactive",
      attendance: 76
    }
  ]);

  const getAttendanceColor = (attendance: number) => {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Estudantes - {className}
          </DialogTitle>
          <DialogDescription>
            Lista completa dos estudantes matriculados nesta turma
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Total: {students.length} estudantes
              </div>
              <div className="text-sm text-muted-foreground">
                Ativos: {students.filter(s => s.status === "active").length}
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Enviar Email para Todos
            </Button>
          </div>

          <div className="grid gap-4">
            {students.map((student) => (
              <Card key={student.id} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
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
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {student.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {student.phone}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Matrícula: {new Date(student.enrollmentDate).toLocaleDateString('pt-BR')}
                          </div>
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
                      
                      <div className="text-center">
                        <div className={`text-lg font-bold ${getAttendanceColor(student.attendance)}`}>
                          {student.attendance}%
                        </div>
                        <div className="text-xs text-muted-foreground">Presença</div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Conversar
                        </Button>
                        <Button variant="outline" size="sm">
                          <BookOpen className="h-4 w-4 mr-1" />
                          Perfil
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}