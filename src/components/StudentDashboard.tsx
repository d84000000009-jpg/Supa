import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Calendar, 
  FileText, 
  Download, 
  Play, 
  MessageCircle, 
  Trophy, 
  Clock,
  Star,
  LogOut,
  User,
  BarChart3
} from "lucide-react";

interface StudentDashboardProps {
  onLogout: () => void;
}

export function StudentDashboard({ onLogout }: StudentDashboardProps) {
  const [currentUser] = useState({
    name: "João Silva",
    email: "student@m007.com",
    level: "Intermediate",
    progress: 75
  });

  const [grades] = useState([
    { subject: "Grammar", grade: 8.5, status: "approved" },
    { subject: "Listening", grade: 9.0, status: "approved" },
    { subject: "Speaking", grade: 7.8, status: "approved" },
    { subject: "Writing", grade: 8.2, status: "approved" },
    { subject: "Reading", grade: 9.2, status: "approved" }
  ]);

  const [schedule] = useState([
    { day: "Segunda", time: "14:00-15:30", topic: "Business English", type: "class" },
    { day: "Quarta", time: "14:00-15:30", topic: "Conversation Practice", type: "class" },
    { day: "Sexta", time: "16:00-17:00", topic: "Essay Writing - Deadline", type: "assignment" },
    { day: "Sábado", time: "10:00-11:30", topic: "Pronunciation Workshop", type: "workshop" }
  ]);

  const [materials] = useState([
    { name: "Unit 5 - Audio Files", type: "audio", size: "15.2 MB", downloads: 45 },
    { name: "Grammar Exercises", type: "pdf", size: "2.1 MB", downloads: 89 },
    { name: "Conversation Videos", type: "video", size: "125.4 MB", downloads: 67 },
    { name: "Pronunciation Guide", type: "audio", size: "8.7 MB", downloads: 33 }
  ]);

  const getGradeColor = (grade: number) => {
    if (grade >= 9) return "bg-success";
    if (grade >= 7) return "bg-warning";
    return "bg-destructive";
  };

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
                <p className="text-sm text-muted-foreground">Portal do Estudante</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="font-medium">{currentUser.name}</p>
                <p className="text-sm text-muted-foreground">{currentUser.level}</p>
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
              <Star className="h-5 w-5 text-oxford-gold" />
              <span className="font-medium">Nível: {currentUser.level}</span>
            </div>
            <div className="flex-1 max-w-xs">
              <div className="flex justify-between text-sm mb-1">
                <span>Progresso Geral</span>
                <span>{currentUser.progress}%</span>
              </div>
              <Progress value={currentUser.progress} className="h-2" />
            </div>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto p-1">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="grades" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Notas</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Horários</span>
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Materiais</span>
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              <span className="hidden sm:inline">Jogos</span>
            </TabsTrigger>
            <TabsTrigger value="ai-chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">IA Chat</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-elegant">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-oxford-gold" />
                    Média Geral
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">8.5</div>
                  <p className="text-sm text-muted-foreground">Excelente desempenho!</p>
                </CardContent>
              </Card>

              <Card className="shadow-elegant">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Próxima Aula
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold">Business English</div>
                  <p className="text-sm text-muted-foreground">Segunda, 14:00</p>
                </CardContent>
              </Card>

              <Card className="shadow-elegant">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-warning" />
                    Pendências
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-warning">2</div>
                  <p className="text-sm text-muted-foreground">Trabalhos a entregar</p>
                </CardContent>
              </Card>

              <Card className="shadow-elegant">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="h-5 w-5 text-oxford-gold" />
                    Ranking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-oxford-gold">#3</div>
                  <p className="text-sm text-muted-foreground">Na sua turma</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="grades" className="space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Minhas Notas</CardTitle>
                <CardDescription>Desempenho nas disciplinas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {grades.map((grade, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${getGradeColor(grade.grade)}`} />
                        <span className="font-medium">{grade.subject}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold">{grade.grade}</span>
                        <Badge variant={grade.status === "approved" ? "default" : "destructive"}>
                          {grade.status === "approved" ? "Aprovado" : "Reprovado"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Horário Semanal</CardTitle>
                <CardDescription>Aulas e atividades programadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schedule.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="text-center min-w-[80px]">
                        <div className="font-semibold">{item.day}</div>
                        <div className="text-sm text-muted-foreground">{item.time}</div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{item.topic}</div>
                        <Badge variant={item.type === "assignment" ? "destructive" : "default"}>
                          {item.type === "class" ? "Aula" : item.type === "assignment" ? "Trabalho" : "Workshop"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials" className="space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Materiais de Estudo</CardTitle>
                <CardDescription>Downloads disponíveis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {materials.map((material, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          {material.type === "audio" && <Play className="h-5 w-5 text-primary" />}
                          {material.type === "video" && <Play className="h-5 w-5 text-primary" />}
                          {material.type === "pdf" && <FileText className="h-5 w-5 text-primary" />}
                        </div>
                        <div>
                          <div className="font-medium">{material.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {material.size} • {material.downloads} downloads
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="games" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="shadow-elegant cursor-pointer hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-primary" />
                    Vocabulary Quiz
                  </CardTitle>
                  <CardDescription>Teste seu vocabulário</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Jogar Agora</Button>
                </CardContent>
              </Card>

              <Card className="shadow-elegant cursor-pointer hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-primary" />
                    Grammar Challenge
                  </CardTitle>
                  <CardDescription>Desafio de gramática</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Jogar Agora</Button>
                </CardContent>
              </Card>

              <Card className="shadow-elegant cursor-pointer hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-primary" />
                    Listening Game
                  </CardTitle>
                  <CardDescription>Jogo de listening</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Jogar Agora</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-chat" className="space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  IA Assistant - Oxford English Coach
                </CardTitle>
                <CardDescription>
                  Pratique inglês com nossa IA. Faça perguntas, pratique conversação ou peça exercícios!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 border rounded-lg p-4 bg-muted/30 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <MessageCircle className="h-12 w-12 text-primary mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold">Chat IA em Desenvolvimento</h3>
                      <p className="text-muted-foreground">
                        Em breve você poderá conversar com nossa IA para praticar inglês!
                      </p>
                    </div>
                    <Button variant="oxford" disabled>
                      Iniciar Chat (Em breve)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}