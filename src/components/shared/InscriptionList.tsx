// InscriptionList.tsx - ESTILO MODERNO COM TOGGLE GRID/LISTA
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  UserPlus, Search, RefreshCw, BookOpen, Eye, Edit2, UserX,
  CheckCircle2, XCircle, Calendar, Mail, Key, MoreHorizontal, Settings,
  Grid3x3, List, Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InscriptionStudentModal } from "./InscriptionStudentModal";
import { InscriptionSettingsModal } from "./InscriptionSettingsModal";

interface InscribedStudent {
  id: number;
  name: string;
  email: string;
  bi_number: string;
  username: string;
  enrollment_number: string;
  gender: 'M' | 'F';
  phone?: string;
  status: 'ativo' | 'inativo';
  created_at: string;
}

interface InscriptionListProps {
  onProceedToRegistration?: (studentId: number) => void;
}

export function InscriptionList({ onProceedToRegistration }: InscriptionListProps) {
  const [students, setStudents] = useState<InscribedStudent[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<InscribedStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ativo' | 'inativo'>('all');
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid"); // NOVO: Toggle
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api-login/api';

  const fetchInscribedStudents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/students.php?with_credentials=true`);
      const result = await response.json();

      if (result.success && result.data) {
        const inscribed = result.data.filter((s: any) => s.username);
        setStudents(inscribed);
        setFilteredStudents(inscribed);
      }
    } catch (error) {
      console.error('Erro ao buscar estudantes inscritos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInscribedStudents();
  }, []);

  useEffect(() => {
    let filtered = students;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.username.toLowerCase().includes(term) ||
        s.bi_number.toLowerCase().includes(term) ||
        s.enrollment_number.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    setFilteredStudents(filtered);
  }, [searchTerm, statusFilter, students]);

  const handleInscriptionSuccess = (studentId: number, credentials: { username: string; password: string }) => {
    fetchInscribedStudents();
  };

  const handleProceedToRegistration = (studentId: number) => {
    if (onProceedToRegistration) {
      onProceedToRegistration(studentId);
    }
    setIsModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-MZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const stats = {
    total: students.length,
    active: students.filter(s => s.status === 'ativo').length,
    inactive: students.filter(s => s.status === 'inativo').length
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl p-8 border border-slate-200/60">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-[#004B87] mb-2 flex items-center gap-3">
              <div className="h-12 w-12 bg-gradient-to-br from-[#F5821F] to-[#FF9933] rounded-xl flex items-center justify-center shadow-lg">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
              Gestão de Inscrições
            </h2>
            <p className="text-slate-600 flex items-center gap-2 ml-1">
              <Users className="h-4 w-4" />
              Estudantes inscritos no sistema com credenciais de acesso
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsSettingsOpen(true)}
              className="border-2 border-slate-300 hover:border-slate-400"
              title="Configurações de Inscrição"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-[#F5821F] to-[#FF9933] hover:from-[#E07318] hover:to-[#F58820] text-white"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Nova Inscrição
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div 
            className={`bg-white rounded-xl p-4 border-2 cursor-pointer transition-all hover:shadow-lg ${
              statusFilter === 'all' ? 'border-[#004B87] shadow-lg' : 'border-slate-100'
            }`}
            onClick={() => setStatusFilter('all')}
          >
            <div className="flex items-center gap-2 mb-2">
              <UserPlus className="h-4 w-4 text-slate-600" />
              <span className="text-xs text-slate-600 font-medium">Total Inscritos</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
          </div>

          <div 
            className={`bg-green-50 rounded-xl p-4 border-2 cursor-pointer transition-all hover:shadow-lg ${
              statusFilter === 'ativo' ? 'border-green-500 shadow-lg' : 'border-green-200'
            }`}
            onClick={() => setStatusFilter('ativo')}
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-700 font-medium">Activos</span>
            </div>
            <p className="text-2xl font-bold text-green-700">{stats.active}</p>
          </div>

          <div 
            className={`bg-slate-50 rounded-xl p-4 border-2 cursor-pointer transition-all hover:shadow-lg ${
              statusFilter === 'inativo' ? 'border-slate-500 shadow-lg' : 'border-slate-200'
            }`}
            onClick={() => setStatusFilter('inativo')}
          >
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-4 w-4 text-slate-600" />
              <span className="text-xs text-slate-700 font-medium">Inactivos</span>
            </div>
            <p className="text-2xl font-bold text-slate-700">{stats.inactive}</p>
          </div>
        </div>
      </div>

      {/* Search Bar + View Toggle */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Pesquisar por nome, email, username, BI ou nº matrícula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 border-2 border-slate-200 rounded-xl focus:border-[#F5821F] text-base"
          />
        </div>

        <Button
          variant="outline"
          onClick={fetchInscribedStudents}
          className="h-12 px-4 rounded-xl border-2"
          disabled={isLoading}
        >
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
        </Button>

        {/* Toggle de Visualização */}
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

      {/* Students Display */}
      {isLoading ? (
        <Card className="shadow-lg border-0">
          <CardContent className="pt-12 pb-12">
            <div className="flex flex-col items-center justify-center">
              <RefreshCw className="h-12 w-12 text-[#F5821F] animate-spin mb-4" />
              <p className="text-slate-500">Carregando estudantes inscritos...</p>
            </div>
          </CardContent>
        </Card>
      ) : filteredStudents.length === 0 ? (
        <Card className="shadow-lg border-0">
          <CardContent className="pt-12 pb-12">
            <div className="flex flex-col items-center justify-center">
              <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Nenhum estudante encontrado</h3>
              <p className="text-sm text-slate-500 text-center mb-6">
                {searchTerm || statusFilter !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Nenhum estudante inscrito ainda'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-[#F5821F] to-[#FF9933] hover:from-[#E07318] hover:to-[#F58820] text-white"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Fazer Primeira Inscrição
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        // ============ VISUALIZAÇÃO EM GRID (CARDS) ============
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredStudents.map((student) => (
            <Card 
              key={student.id}
              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden bg-white"
            >
              <div className="h-2 bg-gradient-to-r from-[#004B87] to-[#0066B3]"></div>
              
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <div className={cn(
                        "h-11 w-11 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg",
                        student.gender === 'M' ? "bg-gradient-to-br from-blue-500 to-blue-600" : "bg-gradient-to-br from-pink-500 to-pink-600"
                      )}>
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
                        student.status === 'ativo' ? "bg-green-500" : "bg-slate-400"
                      }`}></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-[#004B87] truncate leading-tight">
                        {student.name}
                      </h3>
                      <p className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {student.email}
                      </p>
                      <div className="mt-1">
                        <Badge 
                          variant={student.status === 'ativo' ? 'default' : 'secondary'}
                          className={cn(
                            "gap-1 text-[10px]",
                            student.status === 'ativo' ? 'bg-green-600' : 'bg-slate-400'
                          )}
                        >
                          {student.status === 'ativo' ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          {student.status === 'ativo' ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-3 bg-slate-50/50 rounded-lg p-2.5 border border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 flex items-center gap-1">
                      <Key className="h-3 w-3" />
                      Username
                    </span>
                    <code className="bg-white px-2 py-0.5 rounded font-mono text-[10px] text-[#004B87] border border-slate-200">
                      {student.username}
                    </code>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">Nº Matrícula</span>
                    <span className="font-mono font-semibold text-slate-800">{student.enrollment_number}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
                    <span className="text-slate-600 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Inscrição
                    </span>
                    <span className="font-semibold text-slate-700">{formatDate(student.created_at)}</span>
                  </div>
                </div>

                <div className="flex gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-9 text-xs border-2 border-slate-300 hover:border-[#004B87] hover:bg-blue-50"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    Ver
                  </Button>

                  {onProceedToRegistration && student.status === 'ativo' && (
                    <Button
                      size="sm"
                      onClick={() => onProceedToRegistration(student.id)}
                      className="flex-1 bg-gradient-to-r from-[#F5821F] to-[#FF9933] hover:from-[#E07318] hover:to-[#F58820] text-white h-9 text-xs"
                    >
                      <BookOpen className="h-3.5 w-3.5 mr-1" />
                      Matricular
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
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
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Username</span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Nº Matrícula</span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Data Inscrição</span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Status</span>
                </div>
                <div className="col-span-1 text-center">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Ações</span>
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {filteredStudents.map((student, index) => (
                <div
                  key={student.id}
                  className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                  }`}
                >
                  <div className="col-span-3 flex items-center gap-3">
                    <div className={cn(
                      "h-11 w-11 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0",
                      student.gender === 'M' ? "bg-gradient-to-br from-blue-500 to-blue-600" : "bg-gradient-to-br from-pink-500 to-pink-600"
                    )}>
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-slate-800 truncate">{student.name}</p>
                      <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {student.email}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2 flex justify-center">
                    <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono text-[#004B87]">
                      {student.username}
                    </code>
                  </div>

                  <div className="col-span-2 text-center">
                    <span className="font-mono text-sm">{student.enrollment_number}</span>
                  </div>

                  <div className="col-span-2 text-center">
                    <span className="text-sm text-slate-600 flex items-center justify-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(student.created_at)}
                    </span>
                  </div>

                  <div className="col-span-2 flex justify-center">
                    <Badge 
                      variant={student.status === 'ativo' ? 'default' : 'secondary'}
                      className={cn(
                        "gap-1",
                        student.status === 'ativo' ? 'bg-green-600' : 'bg-slate-400'
                      )}
                    >
                      {student.status === 'ativo' ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      {student.status === 'ativo' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>

                  <div className="col-span-1 flex justify-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 w-9 p-0 border-2 border-slate-300"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {onProceedToRegistration && student.status === 'ativo' && (
                      <Button
                        size="sm"
                        onClick={() => onProceedToRegistration(student.id)}
                        className="bg-gradient-to-r from-[#F5821F] to-[#FF9933] hover:from-[#E07318] hover:to-[#F58820] text-white h-9 w-9 p-0"
                      >
                        <BookOpen className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
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

      {/* Modals */}
      <InscriptionStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleInscriptionSuccess}
        onProceedToRegistration={handleProceedToRegistration}
      />

      <InscriptionSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}