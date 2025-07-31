import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  Settings,
  UserPlus,
  GraduationCap,
  LogOut,
  Shield,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [currentUser] = useState({
    name: "Administrator",
    email: "admin@m007.com",
    role: "Super Admin"
  });

  const [stats] = useState({
    totalStudents: 156,
    totalTeachers: 12,
    totalClasses: 18,
    activePayments: 134,
    pendingPayments: 22
  });

  const [students] = useState([
    { id: 1, name: "João Silva", email: "joao@email.com", class: "Business English A2", status: "active", paymentStatus: "paid", lastPayment: "2024-01-15" },
    { id: 2, name: "Maria Oliveira", email: "maria@email.com", class: "Conversation B1", status: "active", paymentStatus: "pending", lastPayment: "2023-12-15" },
    { id: 3, name: "Pedro Santos", email: "pedro@email.com", class: "Advanced C1", status: "blocked", paymentStatus: "overdue", lastPayment: "2023-11-15" },
    { id: 4, name: "Ana Costa", email: "ana@email.com", class: "Business English A2", status: "active", paymentStatus: "paid", lastPayment: "2024-01-20" },
  ]);

  const [teachers] = useState([
    { id: 1, name: "Prof. Maria Santos", email: "maria.santos@m007.com", classes: 3, students: 45, status: "active" },
    { id: 2, name: "Prof. João Pedro", email: "joao.pedro@m007.com", classes: 2, students: 28, status: "active" },
    { id: 3, name: "Prof. Ana Silva", email: "ana.silva@m007.com", classes: 4, students: 52, status: "active" },
    { id: 4, name: "Prof. Carlos Lima", email: "carlos.lima@m007.com", classes: 1, students: 15, status: "inactive" },
  ]);

  const [classes] = useState([
    { id: 1, name: "Business English A2", teacher: "Prof. Maria Santos", students: 15, schedule: "Seg/Qua 14:00", status: "active" },
    { id: 2, name: "Conversation B1", teacher: "Prof. João Pedro", students: 12, schedule: "Ter/Qui 16:00", status: "active" },
    { id: 3, name: "Advanced Grammar C1", teacher: "Prof. Ana Silva", students: 18, schedule: "Sex 10:00", status: "active" },
    { id: 4, name: "Beginner A1", teacher: "Prof. Carlos Lima", students: 8, schedule: "Sáb 09:00", status: "inactive" },
  ]);

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-success";
      case "pending":
        return "bg-warning";
      case "overdue":
        return "bg-destructive";
      default:
        return "bg-muted";
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Pago";
      case "pending":
        return "Pendente";
      case "overdue":
        return "Em Atraso";
      default:
        return "Indefinido";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">M007 Oxford</h1>
                <p className="text-sm text-muted-foreground">Portal Administrativo</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="font-medium">{currentUser.name}</p>
                <p className="text-sm text-muted-foreground">{currentUser.role}</p>
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
          <h2 className="text-2xl font-bold mb-2">Painel Administrativo</h2>
          <p className="text-muted-foreground">Gerencie estudantes, docentes, turmas e pagamentos</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto p-1">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Estudantes</span>
            </TabsTrigger>
            <TabsTrigger value="teachers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Docentes</span>
            </TabsTrigger>
            <TabsTrigger value="classes" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Turmas</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Pagamentos</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Configurações</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="shadow-elegant">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Estudantes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{stats.totalStudents}</div>
                  <p className="text-sm text-muted-foreground">Total matriculados</p>
                </CardContent>
              </Card>

              <Card className="shadow-elegant">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-oxford-gold" />
                    Docentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-oxford-gold">{stats.totalTeachers}</div>
                  <p className="text-sm text-muted-foreground">Professores ativos</p>
                </CardContent>
              </Card>

              <Card className="shadow-elegant">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-success" />
                    Turmas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-success">{stats.totalClasses}</div>
                  <p className="text-sm text-muted-foreground">Turmas ativas</p>
                </CardContent>
              </Card>

              <Card className="shadow-elegant">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    Pagos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-success">{stats.activePayments}</div>
                  <p className="text-sm text-muted-foreground">Pagamentos em dia</p>
                </CardContent>
              </Card>

              <Card className="shadow-elegant">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    Pendentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-warning">{stats.pendingPayments}</div>
                  <p className="text-sm text-muted-foreground">Pagamentos pendentes</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Gerenciar Estudantes</h3>
              <Button variant="oxford">
                <UserPlus className="h-4 w-4 mr-2" />
                Novo Estudante
              </Button>
            </div>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Lista de Estudantes</CardTitle>
                <CardDescription>Gerencie estudantes, status e pagamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <GraduationCap className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.email}</div>
                          <div className="text-sm text-muted-foreground">{student.class}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <Badge variant={student.status === "active" ? "default" : "destructive"}>
                            {student.status === "active" ? "Ativo" : "Bloqueado"}
                          </Badge>
                          <div className={`mt-1 h-2 w-2 rounded-full mx-auto ${getPaymentStatusColor(student.paymentStatus)}`} />
                          <div className="text-xs text-muted-foreground mt-1">
                            {getPaymentStatusText(student.paymentStatus)}
                          </div>
                        </div>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                          <Button 
                            variant={student.status === "active" ? "destructive" : "success"} 
                            size="sm"
                          >
                            {student.status === "active" ? "Bloquear" : "Ativar"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teachers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Gerenciar Docentes</h3>
              <Button variant="oxford">
                <UserPlus className="h-4 w-4 mr-2" />
                Novo Docente
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((teacher) => (
                <Card key={teacher.id} className="shadow-elegant">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-oxford-gold/10 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-oxford-gold" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{teacher.name}</CardTitle>
                        <CardDescription>{teacher.email}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Turmas:</span>
                        <span className="font-medium">{teacher.classes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Estudantes:</span>
                        <span className="font-medium">{teacher.students}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <Badge variant={teacher.status === "active" ? "default" : "destructive"}>
                          {teacher.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" className="flex-1" size="sm">
                          Editar
                        </Button>
                        <Button 
                          variant={teacher.status === "active" ? "destructive" : "success"}
                          className="flex-1" 
                          size="sm"
                        >
                          {teacher.status === "active" ? "Desativar" : "Ativar"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="classes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Gerenciar Turmas</h3>
              <Button variant="oxford">
                <BookOpen className="h-4 w-4 mr-2" />
                Nova Turma
              </Button>
            </div>

            <div className="space-y-4">
              {classes.map((classItem) => (
                <Card key={classItem.id} className="shadow-elegant">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{classItem.name}</CardTitle>
                        <CardDescription>Professor: {classItem.teacher}</CardDescription>
                      </div>
                      <Badge variant={classItem.status === "active" ? "default" : "destructive"}>
                        {classItem.status === "active" ? "Ativa" : "Inativa"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{classItem.students}</div>
                          <div className="text-xs text-muted-foreground">Estudantes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold">{classItem.schedule}</div>
                          <div className="text-xs text-muted-foreground">Horário</div>
                        </div>
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">
                          Ver Detalhes
                        </Button>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                        <Button variant="outline" size="sm">
                          Atribuir Docente
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Controle de Pagamentos</CardTitle>
                <CardDescription>Monitore mensalidades e validações de pagamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`h-4 w-4 rounded-full ${getPaymentStatusColor(student.paymentStatus)}`} />
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Último pagamento: {new Date(student.lastPayment).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge 
                          variant={
                            student.paymentStatus === "paid" ? "default" : 
                            student.paymentStatus === "pending" ? "secondary" : "destructive"
                          }
                        >
                          {getPaymentStatusText(student.paymentStatus)}
                        </Badge>
                        {student.paymentStatus !== "paid" && (
                          <Button variant="success" size="sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Validar Pagamento
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle>Configurações do Sistema</CardTitle>
                  <CardDescription>Configurações gerais do M007 Oxford</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurações Gerais
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Gerenciar Permissões
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Configurar Pagamentos
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle>Backup e Dados</CardTitle>
                  <CardDescription>Gerenciar dados do sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Relatórios
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Backup de Dados
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Logs do Sistema
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}