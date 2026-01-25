// src/components/shared/RegistrationList.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText,
  Plus,
  Search,
  Grid3x3,
  LayoutList,
  Eye,
  Edit,
  Trash2,
  Calendar,
  BookOpen,
  GraduationCap,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  Pause,
  Trophy,
  User
} from "lucide-react";
import { Permission } from "../../types";

// Interface para Matrícula
export interface Registration {
  id: number;
  studentId: number;
  studentName: string;
  studentCode: string;
  courseId: string;
  courseName: string;
  classId?: number;
  className?: string;
  period: string; // "2025/1", "2025/2"
  enrollmentDate: string;
  status: 'active' | 'suspended' | 'cancelled' | 'completed';
  paymentStatus: 'paid' | 'pending' | 'overdue';
  enrollmentFee: number;
  monthlyFee: number;
  modules?: string[];
  observations?: string;
  registrationType?: 'new' | 'renewal' | 'transfer';
}

interface RegistrationListProps {
  registrations: Registration[];
  permissions: Permission;
  currentUserRole: 'teacher' | 'admin';
  onViewRegistration?: (registration: Registration) => void;
  onEditRegistration?: (registration: Registration) => void;
  onDeleteRegistration?: (registrationId: number) => void;
  onAddRegistration?: () => void;
  onRenewRegistration?: (registration: Registration) => void;
}

export function RegistrationList({ 
  registrations, 
  permissions, 
  currentUserRole,
  onViewRegistration,
  onEditRegistration,
  onDeleteRegistration,
  onAddRegistration,
  onRenewRegistration
}: RegistrationListProps) {

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended" | "cancelled" | "completed">("all");
  const [paymentFilter, setPaymentFilter] = useState<"all" | "paid" | "pending" | "overdue">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filtros
  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = reg.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || reg.status === statusFilter;
    const matchesPayment = paymentFilter === "all" || reg.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Estatísticas
  const stats = {
    total: registrations.length,
    active: registrations.filter(r => r.status === 'active').length,
    suspended: registrations.filter(r => r.status === 'suspended').length,
    completed: registrations.filter(r => r.status === 'completed').length,
    overdue: registrations.filter(r => r.paymentStatus === 'overdue').length
  };

  // Helper functions
  const getStatusInfo = (status: Registration['status']) => {
    const statusMap = {
      active: { label: 'Matriculado', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50', icon: CheckCircle },
      suspended: { label: 'Trancado', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50', icon: Pause },
      cancelled: { label: 'Cancelado', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50', icon: XCircle },
      completed: { label: 'Concluído', color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50', icon: Trophy }
    };
    return statusMap[status];
  };

  const getPaymentStatusInfo = (status: Registration['paymentStatus']) => {
    const statusMap = {
      paid: { label: 'Pago', color: 'text-green-600', bg: 'bg-green-100' },
      pending: { label: 'Pendente', color: 'text-yellow-600', bg: 'bg-yellow-100' },
      overdue: { label: 'Atrasado', color: 'text-red-600', bg: 'bg-red-100' }
    };
    return statusMap[status];
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-slate-50 to-purple-50/30 rounded-2xl p-8 border border-slate-200/60">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#004B87] mb-2">
              Gestão de Matrículas
            </h2>
            <div className="flex items-center gap-2 text-[#004B87]/70">
              <FileText className="h-5 w-5" />
              <p className="text-sm">
                {stats.total} matrícula{stats.total !== 1 ? 's' : ''} registrada{stats.total !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {permissions.canAdd && onAddRegistration && (
            <Button 
              onClick={onAddRegistration}
              className="bg-gradient-to-r from-[#F5821F] to-[#FF9933] hover:from-[#E07318] hover:to-[#F58820] text-white shadow-md h-12 px-6"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nova Matrícula
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          <div className="bg-white rounded-xl p-4 border-2 border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-slate-600" />
              <span className="text-xs text-slate-600 font-medium">Total</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
          </div>

          <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-700 font-medium">Ativos</span>
            </div>
            <p className="text-2xl font-bold text-green-700">{stats.active}</p>
          </div>

          <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <Pause className="h-4 w-4 text-yellow-600" />
              <span className="text-xs text-yellow-700 font-medium">Trancados</span>
            </div>
            <p className="text-2xl font-bold text-yellow-700">{stats.suspended}</p>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-blue-700 font-medium">Concluídos</span>
            </div>
            <p className="text-2xl font-bold text-blue-700">{stats.completed}</p>
          </div>

          <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-red-600" />
              <span className="text-xs text-red-700 font-medium">Atrasados</span>
            </div>
            <p className="text-2xl font-bold text-red-700">{stats.overdue}</p>
          </div>
        </div>
      </div>

      {/* Barra de Pesquisa e Filtros */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Buscar por estudante, código ou curso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 border-2 border-slate-200 rounded-xl focus:border-[#F5821F] text-base"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 h-12 border-2 border-slate-200 rounded-xl text-sm focus:border-[#F5821F] focus:outline-none focus:ring-2 focus:ring-[#F5821F]/20 min-w-[160px] bg-white"
        >
          <option value="all">Todos os Status</option>
          <option value="active">✅ Matriculados</option>
          <option value="suspended">⏸ Trancados</option>
          <option value="cancelled">❌ Cancelados</option>
          <option value="completed">🏆 Concluídos</option>
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value as any)}
          className="px-4 h-12 border-2 border-slate-200 rounded-xl text-sm focus:border-[#F5821F] focus:outline-none focus:ring-2 focus:ring-[#F5821F]/20 min-w-[160px] bg-white"
        >
          <option value="all">Todos Pagamentos</option>
          <option value="paid">💰 Pagos</option>
          <option value="pending">⏳ Pendentes</option>
          <option value="overdue">⚠️ Atrasados</option>
        </select>

        {/* Toggle Grid/Lista */}
        <div className="flex border-2 border-slate-200 rounded-xl overflow-hidden bg-white">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-4 h-12 flex items-center gap-2 transition-colors ${
              viewMode === "grid" 
                ? "bg-[#F5821F] text-white" 
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Grid3x3 className="h-4 w-4" />
            <span className="text-sm font-medium">Grelha</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 h-12 flex items-center gap-2 transition-colors border-l-2 border-slate-200 ${
              viewMode === "list" 
                ? "bg-[#F5821F] text-white" 
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <LayoutList className="h-4 w-4" />
            <span className="text-sm font-medium">Lista</span>
          </button>
        </div>
      </div>

      {/* Estado Vazio */}
      {filteredRegistrations.length === 0 ? (
        <Card className="shadow-lg border-0">
          <CardContent className="pt-12 pb-12">
            <div className="flex flex-col items-center justify-center">
              <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Nenhuma matrícula encontrada</h3>
              <p className="text-sm text-slate-500 text-center mb-6 max-w-sm">
                {searchTerm ? "Tente ajustar os filtros de busca" : "Não há matrículas cadastradas"}
              </p>
              {permissions.canAdd && onAddRegistration && !searchTerm && (
                <Button 
                  onClick={onAddRegistration}
                  variant="outline"
                  className="border-2 border-[#F5821F] text-[#F5821F] hover:bg-[#F5821F] hover:text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Primeira Matrícula
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* VISUALIZAÇÃO EM GRELHA */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRegistrations.map((registration) => {
                const statusInfo = getStatusInfo(registration.status);
                const paymentInfo = getPaymentStatusInfo(registration.paymentStatus);
                const StatusIcon = statusInfo.icon;

                return (
                  <Card 
                    key={registration.id} 
                    className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden bg-white"
                  >
                    <div className={`h-2 ${statusInfo.color}`}></div>
                    
                    <CardContent className="p-5">
                      {/* Header com Estudante */}
                      <div className="flex items-start gap-3 mb-4 pb-4 border-b border-slate-100">
                        <div className="h-12 w-12 bg-gradient-to-br from-[#004B87] to-[#0066B3] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                          <span className="text-white font-bold text-lg">
                            {registration.studentName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm text-[#004B87] truncate" title={registration.studentName}>
                            {registration.studentName}
                          </h3>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">
                            {registration.studentCode}
                          </p>
                          <Badge className={`text-[10px] mt-1.5 ${paymentInfo.bg} ${paymentInfo.color} border-0`}>
                            {paymentInfo.label}
                          </Badge>
                        </div>
                      </div>

                      {/* Informações da Matrícula */}
                      <div className="space-y-2.5 mb-4">
                        <div className="flex items-center gap-2 text-xs">
                          <div className="h-7 w-7 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <BookOpen className="h-3.5 w-3.5 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-700 truncate" title={registration.courseName}>
                              {registration.courseName}
                            </p>
                          </div>
                        </div>

                        {registration.className && (
                          <div className="flex items-center gap-2 text-xs">
                            <div className="h-7 w-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <GraduationCap className="h-3.5 w-3.5 text-blue-600" />
                            </div>
                            <span className="text-slate-600 truncate" title={registration.className}>
                              {registration.className}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-xs">
                          <div className="h-7 w-7 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-3.5 w-3.5 text-[#F5821F]" />
                          </div>
                          <div className="flex-1">
                            <span className="text-slate-600">Período: </span>
                            <span className="font-semibold text-slate-800">{registration.period}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <div className="h-7 w-7 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <DollarSign className="h-3.5 w-3.5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <span className="text-slate-600">Mensalidade: </span>
                            <span className="font-semibold text-green-700">
                              {formatCurrency(registration.monthlyFee)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg ${statusInfo.bgColor} mb-4`}>
                        <StatusIcon className={`h-4 w-4 ${statusInfo.textColor}`} />
                        <span className={`text-xs font-semibold ${statusInfo.textColor}`}>
                          {statusInfo.label}
                        </span>
                      </div>

                      {/* Ações */}
                      <div className="flex gap-2 pt-3 border-t border-slate-100">
                        {permissions.canViewDetails && onViewRegistration && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 h-9 text-xs border-2 border-[#004B87] text-[#004B87] hover:bg-[#004B87] hover:text-white transition-all"
                            onClick={() => onViewRegistration(registration)}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1.5" />
                            Ver
                          </Button>
                        )}

                        {permissions.canEdit && onEditRegistration && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 h-9 text-xs border-2 border-[#F5821F] text-[#F5821F] hover:bg-[#F5821F] hover:text-white transition-all"
                            onClick={() => onEditRegistration(registration)}
                          >
                            <Edit className="h-3.5 w-3.5 mr-1.5" />
                            Editar
                          </Button>
                        )}

                        {permissions.canDelete && onDeleteRegistration && (
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="h-9 w-9 border-2 border-red-200 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                            onClick={() => onDeleteRegistration(registration.id)}
                            title="Cancelar Matrícula"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* VISUALIZAÇÃO EM LISTA */}
          {viewMode === "list" && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
              {/* Header da Tabela */}
              <div className="bg-gradient-to-r from-[#004B87] to-[#0066B3] text-white px-6 py-4">
                <div className="grid grid-cols-12 gap-4 items-center font-semibold text-sm">
                  <div className="col-span-3">Estudante</div>
                  <div className="col-span-2">Curso</div>
                  <div className="col-span-2">Período</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Pagamento</div>
                  <div className="col-span-1 text-right">Ações</div>
                </div>
              </div>

              {/* Linhas da Tabela */}
              <div className="divide-y divide-slate-100">
                {filteredRegistrations.map((registration) => {
                  const statusInfo = getStatusInfo(registration.status);
                  const paymentInfo = getPaymentStatusInfo(registration.paymentStatus);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <div 
                      key={registration.id}
                      className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-slate-50 transition-colors"
                    >
                      {/* Estudante */}
                      <div className="col-span-3 flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-[#004B87] to-[#0066B3] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">
                            {registration.studentName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-slate-800 truncate" title={registration.studentName}>
                            {registration.studentName}
                          </h3>
                          <p className="text-xs text-slate-500 font-mono">
                            {registration.studentCode}
                          </p>
                        </div>
                      </div>

                      {/* Curso */}
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-slate-700 truncate" title={registration.courseName}>
                          {registration.courseName}
                        </p>
                        {registration.className && (
                          <p className="text-xs text-slate-500 truncate">{registration.className}</p>
                        )}
                      </div>

                      {/* Período */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="text-sm font-semibold text-slate-700">
                            {registration.period}
                          </span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="col-span-2">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusInfo.bgColor}`}>
                          <StatusIcon className={`h-3.5 w-3.5 ${statusInfo.textColor}`} />
                          <span className={`text-xs font-semibold ${statusInfo.textColor}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>

                      {/* Pagamento */}
                      <div className="col-span-2">
                        <Badge className={`${paymentInfo.bg} ${paymentInfo.color} border-0 text-xs`}>
                          {paymentInfo.label}
                        </Badge>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatCurrency(registration.monthlyFee)}/mês
                        </p>
                      </div>

                      {/* Ações */}
                      <div className="col-span-1 flex justify-end gap-2">
                        {permissions.canViewDetails && onViewRegistration && (
                          <Button 
                            size="icon"
                            className="h-9 w-9 bg-gradient-to-r from-[#F5821F] to-[#FF9933] hover:from-[#E07318] hover:to-[#F58820] text-white rounded-lg shadow-md"
                            onClick={() => onViewRegistration(registration)}
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}

                        {permissions.canEdit && onEditRegistration && (
                          <Button 
                            size="icon"
                            className="h-9 w-9 bg-[#004B87] hover:bg-[#003868] text-white rounded-lg shadow-md"
                            onClick={() => onEditRegistration(registration)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {permissions.canDelete && onDeleteRegistration && (
                          <Button 
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-red-500 hover:bg-red-50 rounded-lg"
                            onClick={() => onDeleteRegistration(registration.id)}
                            title="Cancelar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Rodapé */}
      {filteredRegistrations.length > 0 && (
        <div className="flex justify-between items-center pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-600">
            Mostrando <span className="font-semibold">{filteredRegistrations.length}</span> de{" "}
            <span className="font-semibold">{registrations.length}</span> matrículas
          </p>
          {(searchTerm || statusFilter !== 'all' || paymentFilter !== 'all') && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setPaymentFilter("all");
              }}
              className="text-[#F5821F] hover:text-[#004B87]"
            >
              Limpar Filtros
            </Button>
          )}
        </div>
      )}
    </div>
  );
}