// src/components/shared/ReportsModal.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  BarChart3,
  Download,
  X,
  FileText,
  Users,
  BookOpen,
  DollarSign,
  Calendar,
  TrendingUp,
  PieChart,
  Activity
} from "lucide-react";

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateReport: (reportType: string, filters: any) => void;
}

export function ReportsModal({ 
  isOpen, 
  onClose, 
  onGenerateReport 
}: ReportsModalProps) {
  const [selectedReport, setSelectedReport] = useState('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    classId: '',
    teacherId: '',
    status: 'all'
  });

  const reportTypes = [
    {
      id: 'students-performance',
      title: 'Desempenho dos Estudantes',
      description: 'Relatório completo de notas, frequência e progressão',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      id: 'financial',
      title: 'Relatório Financeiro',
      description: 'Pagamentos, inadimplência e receitas',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      id: 'classes-overview',
      title: 'Visão Geral das Turmas',
      description: 'Ocupação, performance e estatísticas por turma',
      icon: BookOpen,
      color: 'text-purple-600'
    },
    {
      id: 'teachers-performance',
      title: 'Performance dos Docentes',
      description: 'Avaliação e estatísticas dos professores',
      icon: Activity,
      color: 'text-orange-600'
    },
    {
      id: 'attendance',
      title: 'Relatório de Frequência',
      description: 'Análise detalhada de presença e faltas',
      icon: Calendar,
      color: 'text-red-600'
    },
    {
      id: 'enrollment-trends',
      title: 'Tendências de Matrícula',
      description: 'Análise de crescimento e sazonalidade',
      icon: TrendingUp,
      color: 'text-indigo-600'
    }
  ];

  const handleGenerateReport = () => {
    if (selectedReport) {
      onGenerateReport(selectedReport, filters);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedReport('');
    setFilters({
      startDate: '',
      endDate: '',
      classId: '',
      teacherId: '',
      status: 'all'
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Gerar Relatório
              </DialogTitle>
              <DialogDescription>
                Selecione o tipo de relatório e configure os filtros
              </DialogDescription>
            </div>
         
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Seleção do tipo de relatório */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tipos de Relatório</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTypes.map((report) => {
                const IconComponent = report.icon;
                return (
                  <Card 
                    key={report.id} 
                    className={`cursor-pointer transition-all ${
                      selectedReport === report.id 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedReport(report.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center`}>
                          <IconComponent className={`h-5 w-5 ${report.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-base">{report.title}</CardTitle>
                          <CardDescription className="text-sm">
                            {report.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Filtros */}
          {selectedReport && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Filtros</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Data Inicial</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Data Final</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>

                {(selectedReport === 'students-performance' || selectedReport === 'classes-overview' || selectedReport === 'attendance') && (
                  <div className="space-y-2">
                    <Label htmlFor="classId">Turma (Opcional)</Label>
                    <select
                      id="classId"
                      value={filters.classId}
                      onChange={(e) => setFilters(prev => ({ ...prev, classId: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Todas as turmas</option>
                      <option value="1">Business English - A2</option>
                      <option value="2">Conversation - B1</option>
                      <option value="3">Advanced Grammar - C1</option>
                    </select>
                  </div>
                )}

                {(selectedReport === 'teachers-performance' || selectedReport === 'classes-overview') && (
                  <div className="space-y-2">
                    <Label htmlFor="teacherId">Professor (Opcional)</Label>
                    <select
                      id="teacherId"
                      value={filters.teacherId}
                      onChange={(e) => setFilters(prev => ({ ...prev, teacherId: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Todos os professores</option>
                      <option value="1">Prof. Maria Santos</option>
                      <option value="2">Prof. João Pedro</option>
                      <option value="3">Prof. Ana Silva</option>
                    </select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">Todos</option>
                    <option value="active">Apenas Ativos</option>
                    <option value="inactive">Apenas Inativos</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Preview do relatório selecionado */}
          {selectedReport && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Preview do Relatório</h3>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Tipo:</span>
                      <span>{reportTypes.find(r => r.id === selectedReport)?.title}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Período:</span>
                      <span>
                        {filters.startDate && filters.endDate 
                          ? `${new Date(filters.startDate).toLocaleDateString('pt-BR')} - ${new Date(filters.endDate).toLocaleDateString('pt-BR')}`
                          : 'Todo o período'
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Formato:</span>
                      <span>PDF, Excel</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Estimativa:</span>
                      <span>2-5 minutos para gerar</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Relatórios rápidos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Relatórios Rápidos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="flex flex-col items-start gap-2">
                  <PieChart className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Resumo Mensal</div>
                    <div className="text-sm text-muted-foreground">Estatísticas do mês atual</div>
                  </div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="flex flex-col items-start gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">Lista de Estudantes</div>
                    <div className="text-sm text-muted-foreground">Todos os estudantes ativos</div>
                  </div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="flex flex-col items-start gap-2">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                  <div>
                    <div className="font-medium">Pagamentos Pendentes</div>
                    <div className="text-sm text-muted-foreground">Inadimplência atual</div>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedReport ? 'Relatório configurado e pronto para gerar' : 'Selecione um tipo de relatório'}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleGenerateReport} 
              disabled={!selectedReport}
            >
              <Download className="h-4 w-4 mr-2" />
              Gerar Relatório
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}