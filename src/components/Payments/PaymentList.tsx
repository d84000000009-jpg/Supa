// src/components/shared/PaymentList.tsx - COM TOGGLE GRID/LISTA
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  DollarSign,
  Receipt,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Download,
  Grid3x3,
  List
} from "lucide-react";

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  className: string;
  status: string;
}

interface PaymentListProps {
  students: Student[];
  onOpenPaymentModal: (studentId: number) => void;
  formatCurrency: (amount: number) => string;
  getStudentPaymentInfo: (studentId: number, name: string, className: string) => {
    studentId: number;
    studentName: string;
    className: string;
    monthlyFee: number;
    totalPaid: number;
    currentBalance: number;
    overduePayments: any[];
    lastPaymentDate: string | null;
  };
}

export function PaymentList({
  students,
  onOpenPaymentModal,
  formatCurrency,
  getStudentPaymentInfo
}: PaymentListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid"); // NOVO: Toggle de visualização

  // Calcular estatísticas
  const getPaymentStats = () => {
    let withDebt = 0;
    let withCredit = 0;
    let overdue = 0;
    let upToDate = 0;

    students.forEach(student => {
      const paymentInfo = getStudentPaymentInfo(student.id, student.name, student.className);
     
      if (paymentInfo.overduePayments.length > 0) {
        overdue++;
      } else if (paymentInfo.currentBalance < 0) {
        withDebt++;
      } else if (paymentInfo.currentBalance > 0) {
        withCredit++;
      } else {
        upToDate++;
      }
    });

    return { withDebt, withCredit, overdue, upToDate, total: students.length };
  };

  const stats = getPaymentStats();

  // Filtrar estudantes
  const getFilteredStudents = () => {
    let filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter === 'overdue') {
      filtered = filtered.filter(student => {
        const paymentInfo = getStudentPaymentInfo(student.id, student.name, student.className);
        return paymentInfo.overduePayments.length > 0;
      });
    } else if (statusFilter === 'debt') {
      filtered = filtered.filter(student => {
        const paymentInfo = getStudentPaymentInfo(student.id, student.name, student.className);
        return paymentInfo.currentBalance < 0 && paymentInfo.overduePayments.length === 0;
      });
    } else if (statusFilter === 'credit') {
      filtered = filtered.filter(student => {
        const paymentInfo = getStudentPaymentInfo(student.id, student.name, student.className);
        return paymentInfo.currentBalance > 0;
      });
    } else if (statusFilter === 'uptodate') {
      filtered = filtered.filter(student => {
        const paymentInfo = getStudentPaymentInfo(student.id, student.name, student.className);
        return paymentInfo.currentBalance === 0 && paymentInfo.overduePayments.length === 0;
      });
    }

    return filtered;
  };

  const filteredStudents = getFilteredStudents();

  const getPaymentStatusBadge = (paymentInfo: any) => {
    if (paymentInfo.overduePayments.length > 0) {
      return <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" /> Em Atraso</Badge>;
    } else if (paymentInfo.currentBalance < 0) {
      return <Badge variant="destructive" className="gap-1"><DollarSign className="h-3 w-3" /> Com Dívida</Badge>;
    } else if (paymentInfo.currentBalance > 0) {
      return <Badge variant="default" className="gap-1 bg-blue-600"><TrendingUp className="h-3 w-3" /> Com Crédito</Badge>;
    } else {
      return <Badge variant="default" className="gap-1 bg-green-600"><CheckCircle className="h-3 w-3" /> Em Dia</Badge>;
    }
  };

  const handleExportPayments = () => {
    const csvContent = [
      ["ID", "Nome", "Turma", "Mensalidade", "Total Pago", "Saldo", "Status"],
      ...filteredStudents.map(s => {
        const info = getStudentPaymentInfo(s.id, s.name, s.className);
        return [
          s.id,
          s.name,
          s.className,
          info.monthlyFee,
          info.totalPaid,
          info.currentBalance,
          info.overduePayments.length > 0 ? "Em Atraso" : info.currentBalance < 0 ? "Com Dívida" : info.currentBalance > 0 ? "Com Crédito" : "Em Dia"
        ];
      })
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `pagamentos_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl p-8 border border-slate-200/60">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-[#004B87] mb-2 flex items-center gap-3">
              <DollarSign className="h-8 w-8" />
              Controle de Pagamentos
            </h2>
            <p className="text-sm text-[#004B87]/70">
              {stats.total} estudante{stats.total !== 1 ? 's' : ''} cadastrado{stats.total !== 1 ? 's' : ''}
            </p>
          </div>

          <Button
            onClick={handleExportPayments}
            variant="outline"
            className="border-2 border-slate-300 hover:border-slate-400"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div 
            className={`bg-white rounded-xl p-4 border-2 cursor-pointer transition-all hover:shadow-lg ${
              statusFilter === 'all' ? 'border-[#004B87] shadow-lg' : 'border-slate-100'
            }`}
            onClick={() => setStatusFilter('all')}
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-slate-600" />
              <span className="text-xs text-slate-600 font-medium">Total</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
          </div>

          <div 
            className={`bg-red-50 rounded-xl p-4 border-2 cursor-pointer transition-all hover:shadow-lg ${
              statusFilter === 'overdue' ? 'border-red-500 shadow-lg' : 'border-red-200'
            }`}
            onClick={() => setStatusFilter('overdue')}
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-xs text-red-700 font-medium">Em Atraso</span>
            </div>
            <p className="text-2xl font-bold text-red-700">{stats.overdue}</p>
          </div>

          <div 
            className={`bg-orange-50 rounded-xl p-4 border-2 cursor-pointer transition-all hover:shadow-lg ${
              statusFilter === 'debt' ? 'border-[#F5821F] shadow-lg' : 'border-orange-200'
            }`}
            onClick={() => setStatusFilter('debt')}
          >
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-[#F5821F]" />
              <span className="text-xs text-[#F5821F] font-medium">Com Dívida</span>
            </div>
            <p className="text-2xl font-bold text-[#F5821F]">{stats.withDebt}</p>
          </div>

          <div 
            className={`bg-blue-50 rounded-xl p-4 border-2 cursor-pointer transition-all hover:shadow-lg ${
              statusFilter === 'credit' ? 'border-blue-500 shadow-lg' : 'border-blue-200'
            }`}
            onClick={() => setStatusFilter('credit')}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-blue-700 font-medium">Com Crédito</span>
            </div>
            <p className="text-2xl font-bold text-blue-700">{stats.withCredit}</p>
          </div>

          <div 
            className={`bg-green-50 rounded-xl p-4 border-2 cursor-pointer transition-all hover:shadow-lg ${
              statusFilter === 'uptodate' ? 'border-green-500 shadow-lg' : 'border-green-200'
            }`}
            onClick={() => setStatusFilter('uptodate')}
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-700 font-medium">Em Dia</span>
            </div>
            <p className="text-2xl font-bold text-green-700">{stats.upToDate}</p>
          </div>
        </div>
      </div>

      {/* Search Bar + View Toggle */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Buscar estudante por nome, turma ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 border-2 border-slate-200 rounded-xl focus:border-[#F5821F] text-base"
          />
        </div>

        {/* NOVO: Toggle de Visualização */}
        <div className="flex bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-2 px-4 h-12 transition-all font-medium text-sm ${
              viewMode === "grid"
                ? "bg-gradient-to-r from-[#F5821F] to-[#FF9933] text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Grid3x3 className="h-4 w-4" />
            Grelha
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 px-4 h-12 transition-all font-medium text-sm border-l-2 border-slate-200 ${
              viewMode === "list"
                ? "bg-gradient-to-r from-[#F5821F] to-[#FF9933] text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <List className="h-4 w-4" />
            Lista
          </button>
        </div>
      </div>

      {/* Students Display - CONDICIONAL */}
      {filteredStudents.length === 0 ? (
        <Card className="shadow-lg border-0">
          <CardContent className="pt-12 pb-12">
            <div className="flex flex-col items-center justify-center">
              <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Nenhum estudante encontrado</h3>
              <p className="text-sm text-slate-500 text-center">
                Tente ajustar os filtros ou termos de busca
              </p>
            </div>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        // ============ VISUALIZAÇÃO EM GRID (CARDS) ============
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredStudents.map((student) => {
            const paymentInfo = getStudentPaymentInfo(student.id, student.name, student.className);
           
            return (
              <Card 
                key={student.id}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden bg-white"
              >
                <div className="h-2 bg-gradient-to-r from-[#004B87] to-[#0066B3]"></div>
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <div className="h-11 w-11 bg-gradient-to-br from-[#004B87] to-[#0066B3] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
                          paymentInfo.overduePayments.length > 0 
                            ? "bg-red-500" 
                            : paymentInfo.currentBalance < 0
                            ? "bg-orange-500"
                            : paymentInfo.currentBalance > 0
                            ? "bg-blue-500"
                            : "bg-green-500"
                        }`}></div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-[#004B87] truncate leading-tight">
                          {student.name}
                        </h3>
                        <p className="text-[10px] text-slate-500 truncate">{student.className}</p>
                        <div className="mt-1">
                          {getPaymentStatusBadge(paymentInfo)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3 bg-slate-50/50 rounded-lg p-2.5 border border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 flex items-center gap-1">
                        <Receipt className="h-3 w-3" />
                        Mensalidade
                      </span>
                      <span className="font-bold text-[#F5821F]">
                        {formatCurrency(paymentInfo.monthlyFee)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Total Pago
                      </span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(paymentInfo.totalPaid)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
                      <span className="text-slate-600 font-semibold">Saldo</span>
                      <span className={`font-bold ${
                        paymentInfo.currentBalance > 0
                          ? 'text-blue-600'
                          : paymentInfo.currentBalance < 0
                          ? 'text-red-600'
                          : 'text-slate-600'
                      }`}>
                        {paymentInfo.currentBalance > 0 ? '+' : paymentInfo.currentBalance < 0 ? '-' : ''}
                        {formatCurrency(Math.abs(paymentInfo.currentBalance))}
                      </span>
                    </div>
                  </div>

                  {paymentInfo.overduePayments.length > 0 && (
                    <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                        <p className="text-[10px] text-red-700 font-semibold">
                          {paymentInfo.overduePayments.length} pagamento{paymentInfo.overduePayments.length > 1 ? 's' : ''} em atraso
                        </p>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => onOpenPaymentModal(student.id)}
                    className="w-full bg-gradient-to-r from-[#F5821F] to-[#FF9933] hover:from-[#E07318] hover:to-[#F58820] text-white shadow-md h-9 text-xs font-semibold"
                  >
                    <Receipt className="h-4 w-4 mr-1.5" />
                    Gerenciar Pagamentos
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        // ============ VISUALIZAÇÃO EM LISTA (TABELA) ============
        <Card className="shadow-lg border-0 overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
              <div className="grid grid-cols-12 gap-4 p-4">
                <div className="col-span-3">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Estudante</span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Status</span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Mensalidade</span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Total Pago</span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Saldo</span>
                </div>
                <div className="col-span-1 text-center">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Ações</span>
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {filteredStudents.map((student, index) => {
                const paymentInfo = getStudentPaymentInfo(student.id, student.name, student.className);
               
                return (
                  <div
                    key={student.id}
                    className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                    }`}
                  >
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="h-11 w-11 bg-gradient-to-br from-[#004B87] to-[#0066B3] rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-slate-800 truncate">{student.name}</p>
                        <p className="text-xs text-slate-500 truncate">{student.className}</p>
                      </div>
                    </div>

                    <div className="col-span-2 flex justify-center">
                      {getPaymentStatusBadge(paymentInfo)}
                    </div>

                    <div className="col-span-2 text-center">
                      <p className="font-bold text-sm text-[#F5821F]">
                        {formatCurrency(paymentInfo.monthlyFee)}
                      </p>
                    </div>

                    <div className="col-span-2 text-center">
                      <p className="font-bold text-sm text-green-600">
                        {formatCurrency(paymentInfo.totalPaid)}
                      </p>
                    </div>

                    <div className="col-span-2 text-center">
                      <p className={`font-bold text-sm ${
                        paymentInfo.currentBalance > 0
                          ? 'text-blue-600'
                          : paymentInfo.currentBalance < 0
                          ? 'text-red-600'
                          : 'text-slate-600'
                      }`}>
                        {paymentInfo.currentBalance > 0 ? '+' : paymentInfo.currentBalance < 0 ? '-' : ''}
                        {formatCurrency(Math.abs(paymentInfo.currentBalance))}
                      </p>
                    </div>

                    <div className="col-span-1 flex justify-center">
                      <Button
                        onClick={() => onOpenPaymentModal(student.id)}
                        size="sm"
                        className="bg-gradient-to-r from-[#F5821F] to-[#FF9933] hover:from-[#E07318] hover:to-[#F58820] text-white shadow-md h-9 w-9 p-0"
                        title="Gerenciar pagamentos"
                      >
                        <Receipt className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer Info */}
      {filteredStudents.length > 0 && (
        <div className="flex justify-between items-center pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-600">
            Mostrando <span className="font-semibold text-[#004B87]">{filteredStudents.length}</span> de{" "}
            <span className="font-semibold text-[#004B87]">{students.length}</span> estudantes
          </p>
          {(searchTerm || statusFilter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
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