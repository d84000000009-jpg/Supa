import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Eye, Search, Award, Clock, MapPin, Filter, SlidersHorizontal } from "lucide-react";

interface ClassItem {
  id: number;
  name: string;
  code: string;
  students: number;
  credits: number;
  weeklyHours: string;
  semester: string;
  schedule: string;
  room: string;
  turma: string;
  color: "blue" | "orange" | "green";
  status: "Ativo" | "Inativo";
}

interface ClassListProps {
  classes?: ClassItem[];
  onViewStudents?: (classItem: ClassItem) => void;
  onViewDetails?: (classItem: ClassItem) => void;
}

const defaultClasses: ClassItem[] = [
  {
    id: 1,
    name: "Programação Web",
    code: "PROG-101",
    students: 32,
    credits: 4,
    weeklyHours: "16h",
    semester: "1º",
    schedule: "Seg/Qua 14:00",
    room: "Lab 105",
    turma: "Turma A",
    color: "blue",
    status: "Ativo"
  },
  {
    id: 2,
    name: "Inglês Avançado",
    code: "ENG-202",
    students: 28,
    credits: 3,
    weeklyHours: "12h",
    semester: "1º",
    schedule: "Ter/Qui 15:30",
    room: "Sala 203",
    turma: "Turma B",
    color: "orange",
    status: "Ativo"
  },
  {
    id: 3,
    name: "Cálculo Diferencial",
    code: "MAT-301",
    students: 30,
    credits: 5,
    weeklyHours: "18h",
    semester: "2º",
    schedule: "Seg/Qua/Sex 10:00",
    room: "Auditório 01",
    turma: "Turma C",
    color: "green",
    status: "Ativo"
  }
];

const colorConfig = {
  blue: {
    gradient: "from-[#004B87] to-[#0066B3]",
    light: "bg-blue-50",
    text: "text-[#004B87]",
    badge: "bg-blue-100 text-blue-700",
  },
  orange: {
    gradient: "from-[#F5821F] to-[#FF9933]",
    light: "bg-orange-50",
    text: "text-[#F5821F]",
    badge: "bg-orange-100 text-orange-700",
  },
  green: {
    gradient: "from-emerald-600 to-emerald-500",
    light: "bg-emerald-50",
    text: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
  }
};

export function ClassList({ classes = defaultClasses, onViewStudents, onViewDetails }: ClassListProps) {
  const totalStudents = classes.reduce((sum, c) => sum + c.students, 0);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-br from-slate-50 to-white border-slate-200">
        <CardContent className="p-6">
          {/* Título e Subtítulo */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-[#004B87] flex items-center gap-2 mb-1">
                <BookOpen className="h-6 w-6 text-[#F5821F]" />
                Meus Módulos
              </h3>
              <p className="text-sm text-slate-600 flex items-center gap-1">
                <Users className="h-4 w-4" />
                Disciplinas do semestre atual
              </p>
            </div>
          </div>

          {/* Stats Inline */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-blue-100 shadow-sm">
              <div className="h-10 w-10 bg-gradient-to-br from-[#004B87] to-[#0066B3] rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium">Módulos</p>
                <p className="text-xl font-bold text-[#004B87]">{classes.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-orange-100 shadow-sm">
              <div className="h-10 w-10 bg-gradient-to-br from-[#F5821F] to-[#FF9933] rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium">Estudantes</p>
                <p className="text-xl font-bold text-[#F5821F]">{totalStudents}</p>
              </div>
            </div>
          </div>

          {/* Busca e Filtros */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar módulo..."
                className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#F5821F] focus:border-transparent transition-all"
              />
            </div>
            <Button 
              variant="outline" 
              className="px-6 rounded-xl border-[#F5821F] text-[#F5821F] hover:bg-[#F5821F] hover:text-white transition-all"
            >
              <Filter className="h-4 w-4 mr-2" />
              Mais Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cards dos Módulos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((classItem) => {
          const colors = colorConfig[classItem.color];
          
          return (
            <Card 
              key={classItem.id} 
              className="group hover:shadow-xl transition-all duration-300 border-slate-200 overflow-hidden hover:-translate-y-1"
            >
              {/* Barra colorida superior */}
              <div className={`h-1.5 bg-gradient-to-r ${colors.gradient}`}></div>
              
              <CardHeader className="pb-3 pt-4 px-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`h-10 w-10 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center shadow-md`}>
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${colors.text}`}>{classItem.turma}</p>
                      <p className="text-xs text-slate-500 font-mono">{classItem.code}</p>
                    </div>
                  </div>
                  <Badge className={`${colors.badge} text-xs px-3 py-1 rounded-full font-semibold`}>
                    {classItem.status}
                  </Badge>
                </div>
                
                <CardTitle className="text-lg font-bold text-slate-800 leading-tight">
                  {classItem.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="px-4 pb-4 space-y-3">
                {/* Info Badges */}
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 rounded-lg text-xs">
                    <Award className="h-3.5 w-3.5 text-slate-600" />
                    <span className="font-medium text-slate-700">{classItem.credits} créd</span>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 rounded-lg text-xs">
                    <Clock className="h-3.5 w-3.5 text-slate-600" />
                    <span className="font-medium text-slate-700">{classItem.weeklyHours}</span>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 rounded-lg text-xs">
                    <Users className="h-3.5 w-3.5 text-slate-600" />
                    <span className="font-medium text-slate-700">{classItem.students} alunos</span>
                  </div>
                </div>

                {/* Horário e Sala */}
                <div className={`${colors.light} rounded-xl p-3 border ${colors.badge.split(' ')[0].replace('bg-', 'border-')}`}>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5">
                      <Clock className={`h-4 w-4 ${colors.text}`} />
                      <span className="font-medium text-slate-700">{classItem.schedule}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${colors.text} font-semibold`}>
                      <MapPin className="h-4 w-4" />
                      <span>{classItem.room}</span>
                    </div>
                  </div>
                </div>

                {/* Botões */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm"
                    className={`flex-1 bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white font-semibold shadow-md`}
                    onClick={() => onViewStudents?.(classItem)}
                  >
                    <Users className="h-4 w-4 mr-1.5" />
                    Estudantes
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline" 
                    className="flex-1 font-semibold border-slate-300 hover:bg-slate-50"
                    onClick={() => onViewDetails?.(classItem)}
                  >
                    <Eye className="h-4 w-4 mr-1.5" />
                    Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}