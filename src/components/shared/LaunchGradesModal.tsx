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
  Search
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

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGradeChange = (studentId: number, field: keyof StudentGrade, value: string) => {
    setStudents(prev => prev.map(s =>
      s.id === studentId ? { ...s, [field]: value } : s
    ));
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
    toast.success("Notas salvas com sucesso!");
  };

  const handleExportGrades = () => {
    const csvContent = [
      ["Nome", "1ª Avaliação", "2ª Avaliação", "3ª Avaliação", "4ª Avaliação", "Resultado Final"],
      ...students.map(s => [
        s.name,
        s.evaluation1 || "0",
        s.evaluation2 || "0",
        s.evaluation3 || "0",
        s.evaluation4 || "0",
        s.finalResult || "0"
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `notas_${classInfo.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    toast.success("Pautas exportadas com sucesso!");
  };

  const getGradeColor = (grade: string): string => {
    const num = Number(grade);
    if (num >= 18) return "text-purple-600";
    if (num >= 14) return "text-green-600";
    if (num >= 10) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeStatus = (grade: string): { label: string; color: string } => {
    const num = Number(grade);
    if (num >= 18) return { label: "Excelente", color: "bg-purple-100 text-purple-700" };
    if (num >= 14) return { label: "Bom", color: "bg-green-100 text-green-700" };
    if (num >= 10) return { label: "Aprovado", color: "bg-yellow-100 text-yellow-700" };
    return { label: "Reprovado", color: "bg-red-100 text-red-700" };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#004B87] flex items-center gap-2">
            <Award className="h-6 w-6" />
            Lançamento de Notas - {classInfo.name}
          </DialogTitle>
          <p className="text-sm text-slate-600">Curso: {classInfo.course}</p>
        </DialogHeader>

        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Buscar estudante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={handleSaveGrades}
            className="bg-[#F5821F] hover:bg-[#E07318] text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar Notas
          </Button>
          <Button
            onClick={handleExportGrades}
            variant="outline"
            className="border-2"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="min-w-[1000px]">
            <div className="bg-gradient-to-r from-[#004B87] to-[#0066B3] text-white rounded-t-xl sticky top-0 z-10">
              <div className="grid grid-cols-12 gap-2 px-4 py-3 font-semibold text-sm">
                <div className="col-span-3">Estudante</div>
                <div className="col-span-1 text-center">1ª Aval.</div>
                <div className="col-span-1 text-center">2ª Aval.</div>
                <div className="col-span-1 text-center">3ª Aval.</div>
                <div className="col-span-1 text-center">4ª Aval.</div>
                <div className="col-span-2 text-center">Média</div>
                <div className="col-span-2 text-center">Resultado Final</div>
                <div className="col-span-1 text-center">Status</div>
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {filteredStudents.map((student, index) => {
                const average = calculateAverage(student);
                const status = getGradeStatus(student.finalResult || average.toString());

                return (
                  <div
                    key={student.id}
                    className={`grid grid-cols-12 gap-2 px-4 py-3 hover:bg-slate-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                    }`}
                  >
                    <div className="col-span-3 flex items-center gap-2">
                      <div className="h-10 w-10 bg-gradient-to-br from-[#004B87] to-[#0066B3] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {student.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-800">{student.name}</p>
                        <p className="text-xs text-slate-500">Nº {student.id}</p>
                      </div>
                    </div>

                    <div className="col-span-1">
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={student.evaluation1}
                        onChange={(e) => handleGradeChange(student.id, "evaluation1", e.target.value)}
                        className={`text-center h-10 font-bold ${getGradeColor(student.evaluation1)}`}
                      />
                    </div>

                    <div className="col-span-1">
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={student.evaluation2}
                        onChange={(e) => handleGradeChange(student.id, "evaluation2", e.target.value)}
                        className={`text-center h-10 font-bold ${getGradeColor(student.evaluation2)}`}
                      />
                    </div>

                    <div className="col-span-1">
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={student.evaluation3}
                        onChange={(e) => handleGradeChange(student.id, "evaluation3", e.target.value)}
                        className={`text-center h-10 font-bold ${getGradeColor(student.evaluation3)}`}
                      />
                    </div>

                    <div className="col-span-1">
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={student.evaluation4}
                        onChange={(e) => handleGradeChange(student.id, "evaluation4", e.target.value)}
                        className={`text-center h-10 font-bold ${getGradeColor(student.evaluation4)}`}
                      />
                    </div>

                    <div className="col-span-2 flex items-center justify-center">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                        <span className={`text-2xl font-bold ${getGradeColor(average.toString())}`}>
                          {average.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={student.finalResult}
                        onChange={(e) => handleGradeChange(student.id, "finalResult", e.target.value)}
                        className={`text-center h-10 text-lg font-bold ${getGradeColor(student.finalResult)}`}
                      />
                    </div>

                    <div className="col-span-1 flex items-center justify-center">
                      <Badge className={`${status.color} border-0 text-xs`}>
                        {status.label}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
          <div className="flex gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Aprovados: {students.filter(s => Number(s.finalResult) >= 10).length}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span>Reprovados: {students.filter(s => Number(s.finalResult) < 10).length}</span>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
