// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { 
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { 
//   Settings, 
//   Users, 
//   Calendar,
//   Clock,
//   BookOpen,
//   FileText,
//   Save,
//   UserPlus,
//   Trash2,
//   Edit,
//   Bell
// } from "lucide-react";

// interface ClassInfo {
//   id: number;
//   name: string;
//   description: string;
//   schedule: string;
//   duration: string;
//   capacity: number;
//   currentStudents: number;
//   startDate: string;
//   endDate: string;
//   room: string;
//   status: "active" | "inactive" | "completed";
// }

// interface ManageClassModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   classData: any;
// }

// export function ManageClassModal({ isOpen, onClose, classData }: ManageClassModalProps) {
//   const [classInfo, setClassInfo] = useState<ClassInfo>({
//     id: classData?.id || 1,
//     name: classData?.name || "Business English - A2",
//     description: "Curso de inglês focado em comunicação empresarial para nível A2",
//     schedule: classData?.schedule || "Seg/Qua 14:00-15:30",
//     duration: "1h30min",
//     capacity: 20,
//     currentStudents: classData?.students || 15,
//     startDate: "2024-01-15",
//     endDate: "2024-06-15",
//     room: "Sala 105",
//     status: "active"
//   });

//   const [announcements] = useState([
//     {
//       id: 1,
//       title: "Prova marcada para próxima semana",
//       content: "A prova do módulo 3 será na quarta-feira, dia 21/02",
//       date: "2024-02-14",
//       priority: "high"
//     },
//     {
//       id: 2,
//       title: "Material disponível",
//       content: "Novo material de listening disponível na plataforma",
//       date: "2024-02-13",
//       priority: "medium"
//     }
//   ]);

//   const handleSaveChanges = () => {
//     // Aqui você implementaria a lógica para salvar as mudanças
//     console.log("Salvando alterações:", classInfo);
//     onClose();
//   };

//   const handleInputChange = (field: keyof ClassInfo, value: string | number) => {
//     setClassInfo(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Settings className="h-5 w-5" />
//             Gerenciar Turma - {classInfo.name}
//           </DialogTitle>
//           <DialogDescription>
//             Gerencie as configurações, estudantes e conteúdo da turma
//           </DialogDescription>
//         </DialogHeader>

//         <Tabs defaultValue="settings" className="space-y-4">
//           <TabsList className="grid w-full grid-cols-4">
//             <TabsTrigger value="settings" className="flex items-center gap-2">
//               <Settings className="h-4 w-4" />
//               Configurações
//             </TabsTrigger>
//             <TabsTrigger value="schedule" className="flex items-center gap-2">
//               <Calendar className="h-4 w-4" />
//               Cronograma
//             </TabsTrigger>
//             <TabsTrigger value="content" className="flex items-center gap-2">
//               <BookOpen className="h-4 w-4" />
//               Conteúdo
//             </TabsTrigger>
//             <TabsTrigger value="announcements" className="flex items-center gap-2">
//               <Bell className="h-4 w-4" />
//               Avisos
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="settings" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Informações Básicas</CardTitle>
//                 <CardDescription>Configure os dados principais da turma</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="className">Nome da Turma</Label>
//                     <Input
//                       id="className"
//                       value={classInfo.name}
//                       onChange={(e) => handleInputChange('name', e.target.value)}
//                     />
//                   </div>
                  
//                   <div className="space-y-2">
//                     <Label htmlFor="room">Sala</Label>
//                     <Input
//                       id="room"
//                       value={classInfo.room}
//                       onChange={(e) => handleInputChange('room', e.target.value)}
//                     />
//                   </div>
                  
//                   <div className="space-y-2">
//                     <Label htmlFor="capacity">Capacidade Máxima</Label>
//                     <Input
//                       id="capacity"
//                       type="number"
//                       value={classInfo.capacity}
//                       onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
//                     />
//                   </div>
                  
//                   <div className="space-y-2">
//                     <Label htmlFor="duration">Duração da Aula</Label>
//                     <Input
//                       id="duration"
//                       value={classInfo.duration}
//                       onChange={(e) => handleInputChange('duration', e.target.value)}
//                     />
//                   </div>
                  
//                   <div className="space-y-2">
//                     <Label htmlFor="startDate">Data de Início</Label>
//                     <Input
//                       id="startDate"
//                       type="date"
//                       value={classInfo.startDate}
//                       onChange={(e) => handleInputChange('startDate', e.target.value)}
//                     />
//                   </div>
                  
//                   <div className="space-y-2">
//                     <Label htmlFor="endDate">Data de Término</Label>
//                     <Input
//                       id="endDate"
//                       type="date"
//                       value={classInfo.endDate}
//                       onChange={(e) => handleInputChange('endDate', e.target.value)}
//                     />
//                   </div>
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="description">Descrição</Label>
//                   <Textarea
//                     id="description"
//                     value={classInfo.description}
//                     onChange={(e) => handleInputChange('description', e.target.value)}
//                     rows={3}
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Status da Turma</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center justify-between">
//                   <div className="space-y-2">
//                     <div className="flex items-center gap-2">
//                       <Users className="h-4 w-4" />
//                       <span>{classInfo.currentStudents}/{classInfo.capacity} estudantes</span>
//                     </div>
//                     <Badge variant={classInfo.status === "active" ? "default" : "destructive"}>
//                       {classInfo.status === "active" ? "Ativa" : "Inativa"}
//                     </Badge>
//                   </div>
//                   <div className="space-x-2">
//                     <Button variant="outline">
//                       <UserPlus className="h-4 w-4 mr-2" />
//                       Adicionar Estudante
//                     </Button>
//                     <Button variant="destructive" size="sm">
//                       <Trash2 className="h-4 w-4 mr-2" />
//                       Arquivar Turma
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="schedule" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Horários das Aulas</CardTitle>
//                 <CardDescription>Configure os dias e horários das aulas</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="space-y-2">
//                       <Label>Dia da Semana</Label>
//                       <select className="w-full p-2 border rounded-md">
//                         <option>Segunda-feira</option>
//                         <option>Terça-feira</option>
//                         <option>Quarta-feira</option>
//                         <option>Quinta-feira</option>
//                         <option>Sexta-feira</option>
//                         <option>Sábado</option>
//                       </select>
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Horário de Início</Label>
//                       <Input type="time" defaultValue="14:00" />
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Horário de Fim</Label>
//                       <Input type="time" defaultValue="15:30" />
//                     </div>
//                   </div>
//                   <Button variant="outline">
//                     <Clock className="h-4 w-4 mr-2" />
//                     Adicionar Horário
//                   </Button>
//                 </div>
                
//                 <div className="mt-6">
//                   <h4 className="font-semibold mb-3">Horários Atuais</h4>
//                   <div className="space-y-2">
//                     <div className="flex items-center justify-between p-3 border rounded-lg">
//                       <div className="flex items-center gap-2">
//                         <Calendar className="h-4 w-4" />
//                         <span>Segunda-feira: 14:00 - 15:30</span>
//                       </div>
//                       <Button variant="ghost" size="sm">
//                         <Edit className="h-4 w-4" />
//                       </Button>
//                     </div>
//                     <div className="flex items-center justify-between p-3 border rounded-lg">
//                       <div className="flex items-center gap-2">
//                         <Calendar className="h-4 w-4" />
//                         <span>Quarta-feira: 14:00 - 15:30</span>
//                       </div>
//                       <Button variant="ghost" size="sm">
//                         <Edit className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="content" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Plano de Aulas</CardTitle>
//                 <CardDescription>Organize o conteúdo programático da turma</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <Button variant="outline">
//                     <FileText className="h-4 w-4 mr-2" />
//                     Criar Nova Aula
//                   </Button>
                  
//                   <div className="space-y-3">
//                     {[1, 2, 3, 4, 5].map((lesson) => (
//                       <div key={lesson} className="flex items-center justify-between p-4 border rounded-lg">
//                         <div>
//                           <h4 className="font-semibold">Aula {lesson}: Business Vocabulary</h4>
//                           <p className="text-sm text-muted-foreground">
//                             Introdução ao vocabulário empresarial básico
//                           </p>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Badge variant="outline">Planejada</Badge>
//                           <Button variant="ghost" size="sm">
//                             <Edit className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="announcements" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <CardTitle>Avisos da Turma</CardTitle>
//                     <CardDescription>Gerencie comunicados para os estudantes</CardDescription>
//                   </div>
//                   <Button variant="outline">
//                     <Bell className="h-4 w-4 mr-2" />
//                     Novo Aviso
//                   </Button>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {announcements.map((announcement) => (
//                     <div key={announcement.id} className="p-4 border rounded-lg">
//                       <div className="flex justify-between items-start mb-2">
//                         <h4 className="font-semibold">{announcement.title}</h4>
//                         <Badge variant={announcement.priority === "high" ? "destructive" : "default"}>
//                           {announcement.priority === "high" ? "Alta" : "Média"} Prioridade
//                         </Badge>
//                       </div>
//                       <p className="text-sm text-muted-foreground mb-2">
//                         {announcement.content}
//                       </p>
//                       <div className="flex justify-between items-center">
//                         <span className="text-xs text-muted-foreground">
//                           {new Date(announcement.date).toLocaleDateString('pt-BR')}
//                         </span>
//                         <div className="space-x-2">
//                           <Button variant="ghost" size="sm">
//                             <Edit className="h-4 w-4" />
//                           </Button>
//                           <Button variant="ghost" size="sm">
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>

//         <div className="flex justify-end gap-2 pt-4 border-t">
//           <Button variant="outline" onClick={onClose}>
//             Cancelar
//           </Button>
//           <Button onClick={handleSaveChanges}>
//             <Save className="h-4 w-4 mr-2" />
//             Salvar Alterações
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }