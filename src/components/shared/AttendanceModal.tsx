// src/components/shared/AttendanceModal.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  CheckSquare,
  Save,
  X,
  Users,
  Calendar,
  Clock,
  UserCheck,
  UserX
} from "lucide-react";
import { Student, Class } from "../../types";

interface AttendanceRecord {
  studentId: number;
  studentName: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (attendanceData: { classId: number; date: string; records: AttendanceRecord[] }) => void;
  availableClasses: Class[];
  getStudentsByClass: (classId: number) => Student[];
}

export function AttendanceModal({ 
  isOpen, 
  onClose, 
  onSave,
  availableClasses,
  getStudentsByClass
}: AttendanceModalProps) {
  const [selectedClassId, setSelectedClassId] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  const selectedClass = availableClasses.find(c => c.id === selectedClassId);
  const students = selectedClassId ? getStudentsByClass(selectedClassId) : [];

  const handleClassChange = (classId: number) => {
    setSelectedClassId(classId);
    if (classId) {
      const classStudents = getStudentsByClass(classId);
      const records = classStudents.map(student => ({
        studentId: student.id,
        studentName: student.name,
        status: 'present' as const,
        notes: ''
      }));
      setAttendanceRecords(records);
    } else {
      setAttendanceRecords([]);
    }
  };

  const updateAttendance = (studentId: number, status: 'present' | 'absent' | 'late') => {
    setAttendanceRecords(prev => 
      prev.map(record => 
        record.studentId === studentId 
          ? { ...record, status }
          : record
      )
    );
  };

  const updateNotes = (studentId: number, notes: string) => {
    setAttendanceRecords(prev => 
      prev.map(record => 
        record.studentId === studentId 
          ? { ...record, notes }
          : record
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-500';
      case 'absent': return 'bg-red-500';
      case 'late': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present': return 'Presente';
      case 'absent': return 'Ausente';
      case 'late': return 'Atrasado';
      default: return 'Indefinido';
    }
  };

  const handleSave = () => {
    if (selectedClassId && attendanceRecords.length > 0) {
      onSave({
        classId: selectedClassId,
        date,
        records: attendanceRecords
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedClassId(0);
    setDate(new Date().toISOString().split('T')[0]);
    setAttendanceRecords([]);
    onClose();
  };

  const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
  const absentCount = attendanceRecords.filter(r => r.status === 'absent').length;
  const lateCount = attendanceRecords.filter(r => r.status === 'late').length;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                Marcar Presença
              </DialogTitle>
              <DialogDescription>
                Registre a frequência dos estudantes na aula
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Seleção de Turma e Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Turma *</label>
              <select
                value={selectedClassId}
                onChange={(e) => handleClassChange(Number(e.target.value))}
                className="w-full p-2 border rounded-md"
              >
                <option value={0}>Selecione uma turma</option>
                {availableClasses.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.name} - {classItem.schedule}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Data da Aula *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 pl-10 border rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Resumo da Turma */}
          {selectedClass && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {selectedClass.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{students.length}</div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{presentCount}</div>
                    <div className="text-sm text-muted-foreground">Presentes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{absentCount}</div>
                    <div className="text-sm text-muted-foreground">Ausentes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{lateCount}</div>
                    <div className="text-sm text-muted-foreground">Atrasados</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de Estudantes */}
          {attendanceRecords.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Lista de Presença</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setAttendanceRecords(prev => 
                      prev.map(record => ({ ...record, status: 'present' as const }))
                    )}
                  >
                    <UserCheck className="h-4 w-4 mr-1" />
                    Marcar Todos Presentes
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setAttendanceRecords(prev => 
                      prev.map(record => ({ ...record, status: 'absent' as const }))
                    )}
                  >
                    <UserX className="h-4 w-4 mr-1" />
                    Marcar Todos Ausentes
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {attendanceRecords.map((record) => (
                  <Card key={record.studentId} className="shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{record.studentName}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <div className={`h-2 w-2 rounded-full ${getStatusColor(record.status)}`} />
                              <span className="text-sm text-muted-foreground">
                                {getStatusText(record.status)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant={record.status === 'present' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateAttendance(record.studentId, 'present')}
                          >
                            Presente
                          </Button>
                          <Button
                            variant={record.status === 'late' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateAttendance(record.studentId, 'late')}
                          >
                            Atrasado
                          </Button>
                          <Button
                            variant={record.status === 'absent' ? 'destructive' : 'outline'}
                            size="sm"
                            onClick={() => updateAttendance(record.studentId, 'absent')}
                          >
                            Ausente
                          </Button>
                        </div>
                      </div>

                      {/* Campo de observações */}
                      <div className="mt-3">
                        <input
                          type="text"
                          placeholder="Observações (opcional)"
                          value={record.notes || ''}
                          onChange={(e) => updateNotes(record.studentId, e.target.value)}
                          className="w-full p-2 text-sm border rounded-md bg-muted/20"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Resumo Final */}
          {attendanceRecords.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resumo da Presença</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold">
                      {((presentCount / attendanceRecords.length) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Taxa de Presença</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">{presentCount}</div>
                    <div className="text-sm text-muted-foreground">Presentes</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-yellow-600">{lateCount}</div>
                    <div className="text-sm text-muted-foreground">Atrasados</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-600">{absentCount}</div>
                    <div className="text-sm text-muted-foreground">Ausentes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!selectedClassId || attendanceRecords.length === 0}
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar Presença
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}