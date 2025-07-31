import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Users, 
  FileText, 
  Upload, 
  Calendar,
  LogOut,
  GraduationCap,
  BarChart3,
  MessageSquare,
  Settings
} from "lucide-react";

interface TeacherDashboardProps {
  onLogout: () => void;
}

export function TeacherDashboard({ onLogout }: TeacherDashboardProps) {
  const [currentUser] = useState({
    name: "Prof. Maria Santos",
    email: "teacher@m007.com",
    classes: 3,
    students: 45
  });

  const [classes] = useState([
    { id: 1, name: "Business English - A2", students: 15, schedule: "Seg/Qua 14:00-15:30" },
    { id: 2, name: "Conversation - B1", students: 12, schedule: "Ter/Qui 16:00-17:30" },
    { id: 3, name: "Advanced Grammar - C1", students: 18, schedule: "Sex 10:00-12:00" }
  ]);

  const [students] = useState([
    { id: 1, name: "João Silva", class: "Business English - A2", grade: 8.5, status: "active" },
    { id: 2, name: "Maria Oliveira", class: "Conversation - B1", grade: 9.2, status: "active" },
    { id: 3, name: "Pedro Santos", class: "Advanced Grammar - C1", grade: 7.8, status: "active" },
    { id: 4, name: "Ana Costa", class: "Business English - A2", grade: 8.9, status: "inactive" },
  ]);

  const [assignments] = useState([
    { id: 1, title: "Essay Writing - Business Topic", class: "Business English - A2", dueDate: "2024-02-15", submissions: 12, total: 15 },
    { id: 2, title: "Conversation Practice Video", class: "Conversation - B1", dueDate: "2024-02-18", submissions: 8, total: 12 },
    { id: 3, title: "Grammar Exercises Unit 5", class: "Advanced Grammar - C1", dueDate: "2024-02-20", submissions: 15, total: 18 },
  ]);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">M007 Oxford</h1>
                <p className="text-sm text-muted-foreground">Portal do Docente</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="font-medium">{currentUser.name}</p>
                <p className="text-sm text-muted-foreground">Docente</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Bem-vindo, {currentUser.name}!</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-oxford-gold" />
              <span className="font-medium">{currentUser.classes} Turmas Ativas</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="font-medium">{currentUser.students} Estudantes</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto p-1">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="classes" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Turmas</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Estudantes</span>
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Trabalhos</span>
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Materiais</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-elegant">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Turmas Ativas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{currentUser.classes}</div>
                  <p className="text-sm text-muted-foreground">Turmas sendo lecionadas</p>
                </CardContent>
              </Card>

              <Card className="shadow-elegant">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-oxford-gold" />
                    Total Estudantes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-oxford-gold">{currentUser.students}</div>
                  <p className="text-sm text-muted-foreground">Estudantes matriculados</p>
                </CardContent>
              </Card>

              <Card className="shadow-elegant">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-warning" />
                    Trabalhos Pendentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-warning">8</div>
                  <p className="text-sm text-muted-foreground">Para corrigir</p>
                </CardContent>
              </Card>

              <Card className="shadow-elegant">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-success" />
                    Próxima Aula
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold">Business English</div>
                  <p className="text-sm text-muted-foreground">Segunda, 14:00</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="classes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Minhas Turmas</h3>
              <Button variant="oxford">
                <BookOpen className="h-4 w-4 mr-2" />
                Nova Turma
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((classItem) => (
                <Card key={classItem.id} className="shadow-elegant">
                  <CardHeader>
                    <CardTitle className="text-lg">{classItem.name}</CardTitle>
                    <CardDescription>{classItem.schedule}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{classItem.students} estudantes</span>
                      </div>
                      <Badge variant="default">Ativa</Badge>
                    </div>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full" size="sm">
                        Ver Estudantes
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        Gerenciar Turma
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Estudantes</CardTitle>
                    <CardDescription>Gerenciar estudantes das suas turmas</CardDescription>
                  </div>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.class}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="font-semibold">{student.grade}</div>
                          <div className="text-xs text-muted-foreground">Média</div>
                        </div>
                        <Badge variant={student.status === "active" ? "default" : "destructive"}>
                          {student.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Trabalhos e Atividades</h3>
              <Button variant="oxford">
                <FileText className="h-4 w-4 mr-2" />
                Criar Trabalho
              </Button>
            </div>

            <div className="space-y-4">
              {assignments.map((assignment) => (
                <Card key={assignment.id} className="shadow-elegant">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{assignment.title}</CardTitle>
                        <CardDescription>{assignment.class}</CardDescription>
                      </div>
                      <Badge variant="outline">
                        Prazo: {new Date(assignment.dueDate).toLocaleDateString('pt-BR')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {assignment.submissions}
                          </div>
                          <div className="text-xs text-muted-foreground">Entregues</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-muted-foreground">
                            {assignment.total}
                          </div>
                          <div className="text-xs text-muted-foreground">Total</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-warning">
                            {assignment.total - assignment.submissions}
                          </div>
                          <div className="text-xs text-muted-foreground">Pendentes</div>
                        </div>
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">
                          Ver Entregas
                        </Button>
                        <Button variant="default" size="sm">
                          Corrigir
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="materials" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Materiais de Ensino</h3>
              <Button variant="oxford">
                <Upload className="h-4 w-4 mr-2" />
                Upload Material
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="shadow-elegant border-dashed border-2 border-muted-foreground/25 hover:border-primary transition-colors cursor-pointer">
                <CardContent className="flex flex-col items-center justify-center h-40">
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">Upload de Áudio</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Envie arquivos de áudio para suas turmas
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-elegant border-dashed border-2 border-muted-foreground/25 hover:border-primary transition-colors cursor-pointer">
                <CardContent className="flex flex-col items-center justify-center h-40">
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">Upload de Vídeo</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Envie vídeos educativos
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-elegant border-dashed border-2 border-muted-foreground/25 hover:border-primary transition-colors cursor-pointer">
                <CardContent className="flex flex-col items-center justify-center h-40">
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">Upload de Documentos</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    PDFs, exercícios e materiais escritos
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}