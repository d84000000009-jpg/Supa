import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Award,
  Save,
  Download,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Search,
  X,
  FileSpreadsheet,
  Users
} from "lucide-react";

interface StudentGrade {
  id: number;
  name: string;
  evaluation1: string;
  evaluation2: string;
  evaluation3: string;
  evaluation4: string;
  finalResult: string;
}

interface LaunchGradesModalProps {
  isOpen: boolean;
  onClose: () => void;
  classInfo: {
    id: number;
    name: string;
    course: string;
  };
}

const MOCK_STUDENTS: StudentGrade[] = [
  { id: 1, name: "João Silva", evaluation1: "18", evaluation2: "17", evaluation3: "19", evaluation4: "18", finalResult: "18" },
  { id: 2, name: "Maria Santos", evaluation1: "16", evaluation2: "15", evaluation3: "17", evaluation4: "16", finalResult: "16" },
  { id: 3, name: "Pedro Costa", evaluation1: "14", evaluation2: "13", evaluation3: "15", evaluation4: "14", finalResult: "14" },
  { id: 4, name: "Ana Lopes", evaluation1: "19", evaluation2: "18", evaluation3: "20", evaluation4: "19", finalResult: "19" },
  { id: 5, name: "Carlos Mendes", evaluation1: "12", evaluation2: "11", evaluation3: "13", evaluation4: "12", finalResult: "12" },
  { id: 6, name: "Sofia Rodrigues", evaluation1: "17", evaluation2: "16", evaluation3: "18", evaluation4: "17", finalResult: "17" },
  { id: 7, name: "Bruno Alves", evaluation1: "15", evaluation2: "14", evaluation3: "16", evaluation4: "15", finalResult: "15" },
  { id: 8, name: "Inês Ferreira", evaluation1: "20", evaluation2: "19", evaluation3: "20", evaluation4: "20", finalResult: "20" },
];

export function LaunchGradesModal({
  isOpen,
  onClose,
  classInfo
}: LaunchGradesModalProps) {
  const [students, setStudents] = useState<StudentGrade[]>(MOCK_STUDENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGradeChange = (studentId: number, field: keyof StudentGrade, value: string) => {
    // Validação: aceitar apenas números de 0 a 20 com até 1 casa decimal
    if (value !== "" && (!/^\d*\.?\d{0,1}$/.test(value) || Number(value) > 20)) {
      return;
    }

    setStudents(prev => prev.map(s =>
      s.id === studentId ? { ...s, [field]: value } : s
    ));
    setHasUnsavedChanges(true);
  };

  const calculateAverage = (student: StudentGrade): number => {
    const grades = [
      Number(student.evaluation1) || 0,
      Number(student.evaluation2) || 0,
      Number(student.evaluation3) || 0,
      Number(student.evaluation4) || 0
    ];
    const sum = grades.reduce((a, b) => a + b, 0);
    return Math.round((sum / grades.length) * 10) / 10;
  };

  const handleSaveGrades = () => {
    toast.success("Notas salvas com sucesso!", {
      description: "As notas foram registradas no sistema."
    });
    setHasUnsavedChanges(false);
  };

  const handleExportGrades = () => {
    const csvContent = [
      ["Nome", "1ª Avaliação", "2ª Avaliação", "3ª Avaliação", "4ª Avaliação", "Média", "Resultado Final", "Status"],
      ...students.map(s => {
        const avg = calculateAverage(s);
        const finalGrade = Number(s.finalResult) || avg;
        const status = finalGrade >= 10 ? "Aprovado" : "Reprovado";
        return [
          s.name,
          s.evaluation1 || "0",
          s.evaluation2 || "0",
          s.evaluation3 || "0",
          s.evaluation4 || "0",
          avg.toFixed(1),
          s.finalResult || avg.toFixed(1),
          status
        ];
      })
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `notas_${classInfo.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    toast.success("Pautas exportadas com sucesso!", {
      description: "O arquivo CSV foi baixado."
    });
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      const confirmClose = window.confirm(
        "Você tem alterações não salvas. Deseja realmente sair sem salvar?"
      );
      if (!confirmClose) return;
    }
    setHasUnsavedChanges(false);
    onClose();
  };

  const getGradeColor = (grade: string): string => {
    const num = Number(grade);
    if (num >= 18) return "text-purple-600 font-bold";
    if (num >= 14) return "text-green-600 font-semibold";
    if (num >= 10) return "text-blue-600 font-medium";
    return "text-red-600 font-semibold";
  };

  const getGradeStatus = (grade: string): { label: string; color: string } => {
    const num = Number(grade);
    if (num >= 18) return { label: "Excelente", color: "bg-purple-100 text-purple-700 border border-purple-300" };
    if (num >= 14) return { label: "Bom", color: "bg-green-100 text-green-700 border border-green-300" };
    if (num >= 10) return { label: "Aprovado", color: "bg-blue-100 text-blue-700 border border-blue-300" };
    return { label: "Reprovado", color: "bg-red-100 text-red-700 border border-red-300" };
  };

  const stats = {
    total: students.length,
    approved: students.filter(s => Number(s.finalResult || calculateAverage(s)) >= 10).length,
    failed: students.filter(s => Number(s.finalResult || calculateAverage(s)) < 10).length,
    excellent: students.filter(s => Number(s.finalResult || calculateAverage(s)) >= 18).length,
    averageGrade: (students.reduce((sum, s) => sum + Number(s.finalResult || calculateAverage(s)), 0) / students.length).toFixed(1)
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent 
        className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col p-0"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#004B87] to-[#0066B3] text-white px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold flex items-center gap-3 mb-2">
                <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6" />
                </div>
                Lançamento de Notas
              </DialogTitle>
              <div className="flex items-center gap-4 text-sm text-white/90">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span className="font-medium">{classInfo.name}</span>
                </div>
                <span>•</span>
                <span>{classInfo.course}</span>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{students.length} estudantes</span>
                </div>
              </div>
            </div>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 h-10 w-10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="grid grid-cols-5 gap-3">
            <div className="bg-white rounded-lg p-3 border border-slate-200">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-slate-600" />
                <span className="text-xs text-slate-600 font-medium">Total</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
            </div>

            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-xs text-green-700 font-medium">Aprovados</span>
              </div>
              <p className="text-2xl font-bold text-green-700">{stats.approved}</p>
            </div>

            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-xs text-red-700 font-medium">Reprovados</span>
              </div>
              <p className="text-2xl font-bold text-red-700">{stats.failed}</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <div className="flex items-center gap-2 mb-1">
                <Award className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-purple-700 font-medium">Excelentes</span>
              </div>
              <p className="text-2xl font-bold text-purple-700">{stats.excellent}</p>
            </div>

            <div className="bg-gradient-to-br from-[#004B87]/10 to-[#F5821F]/10 rounded-lg p-3 border border-[#004B87]/20">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-[#004B87]" />
                <span className="text-xs text-[#004B87] font-medium">Média Geral</span>
              </div>
              <p className="text-2xl font-bold bg-gradient-to-r from-[#004B87] to-[#F5821F] bg-clip-text text-transparent">
                {stats.averageGrade}
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Buscar estudante por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 h-11 border-2 border-slate-200 rounded-lg focus:border-[#F5821F]"
              />
            </div>
            <Button
              onClick={handleSaveGrades}
              disabled={!hasUnsavedChanges}
              className="bg-gradient-to-r from-[#F5821F] to-[#FF9933] hover:from-[#E07318] hover:to-[#F58820] text-white h-11 px-6 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Notas
            </Button>
            <Button
              onClick={handleExportGrades}
              variant="outline"
              className="border-2 border-[#004B87] text-[#004B87] hover:bg-[#004B87] hover:text-white h-11 px-6"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-6">
          <div className="min-w-full">
            {/* Table Header */}
            <div className="sticky top-0 z-10 bg-slate-50 border-b-2 border-slate-200">
              <div className="grid grid-cols-12 gap-3 px-4 py-3">
                <div className="col-span-3 text-sm font-bold text-slate-700 uppercase tracking-wide">
                  Estudante
                </div>
                <div className="col-span-1 text-center text-sm font-bold text-slate-700 uppercase tracking-wide">
                  1ª Aval.
                </div>
                <div className="col-span-1 text-center text-sm font-bold text-slate-700 uppercase tracking-wide">
                  2ª Aval.
                </div>
                <div className="col-span-1 text-center text-sm font-bold text-slate-700 uppercase tracking-wide">
                  3ª Aval.
                </div>
                <div className="col-span-1 text-center text-sm font-bold text-slate-700 uppercase tracking-wide">
                  4ª Aval.
                </div>
                <div className="col-span-2 text-center text-sm font-bold text-slate-700 uppercase tracking-wide">
                  Média
                </div>
                <div className="col-span-2 text-center text-sm font-bold text-slate-700 uppercase tracking-wide">
                  Resultado
                </div>
                <div className="col-span-1 text-center text-sm font-bold text-slate-700 uppercase tracking-wide">
                  Status
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-slate-100">
              {filteredStudents.map((student, index) => {
                const average = calculateAverage(student);
                const finalGrade = student.finalResult || average.toString();
                const status = getGradeStatus(finalGrade);

                return (
                  <div
                    key={student.id}
                    className={`grid grid-cols-12 gap-3 px-4 py-3 hover:bg-slate-50/80 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                    }`}
                  >
                    {/* Student Info */}
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-[#004B87] to-[#0066B3] rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {student.name.charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-slate-800 truncate">{student.name}</p>
                        <p className="text-xs text-slate-500">Nº {student.id}</p>
                      </div>
                    </div>

                    {/* Evaluation 1 */}
                    <div className="col-span-1">
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="0"
                        value={student.evaluation1}
                        onChange={(e) => handleGradeChange(student.id, "evaluation1", e.target.value)}
                        className={`text-center h-10 border-2 focus:border-[#F5821F] ${getGradeColor(student.evaluation1)} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                      />
                    </div>

                    {/* Evaluation 2 */}
                    <div className="col-span-1">
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="0"
                        value={student.evaluation2}
                        onChange={(e) => handleGradeChange(student.id, "evaluation2", e.target.value)}
                        className={`text-center h-10 border-2 focus:border-[#F5821F] ${getGradeColor(student.evaluation2)} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                      />
                    </div>

                    {/* Evaluation 3 */}
                    <div className="col-span-1">
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="0"
                        value={student.evaluation3}
                        onChange={(e) => handleGradeChange(student.id, "evaluation3", e.target.value)}
                        className={`text-center h-10 border-2 focus:border-[#F5821F] ${getGradeColor(student.evaluation3)} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                      />
                    </div>

                    {/* Evaluation 4 */}
                    <div className="col-span-1">
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="0"
                        value={student.evaluation4}
                        onChange={(e) => handleGradeChange(student.id, "evaluation4", e.target.value)}
                        className={`text-center h-10 border-2 focus:border-[#F5821F] ${getGradeColor(student.evaluation4)} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                      />
                    </div>

                    {/* Average */}
                    <div className="col-span-2 flex items-center justify-center">
                      <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span className={`text-xl font-bold ${getGradeColor(average.toString())}`}>
                          {average.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* Final Result */}
                    <div className="col-span-2">
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="0"
                        value={student.finalResult}
                        onChange={(e) => handleGradeChange(student.id, "finalResult", e.target.value)}
                        className={`text-center h-10 text-lg border-2 focus:border-[#F5821F] ${getGradeColor(student.finalResult)} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                      />
                    </div>

                    {/* Status */}
                    <div className="col-span-1 flex items-center justify-center">
                      <Badge className={`${status.color} text-xs px-3 py-1 font-semibold`}>
                        {status.label}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-600">
              Mostrando <span className="font-semibold">{filteredStudents.length}</span> de{" "}
              <span className="font-semibold">{students.length}</span> estudantes
            </p>
            {hasUnsavedChanges && (
              <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Alterações não salvas</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}