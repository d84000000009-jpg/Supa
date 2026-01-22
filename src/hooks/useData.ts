// src/hooks/useData.ts (Atualizado)
import { useState } from 'react';
import { Class, Student, Assignment, Announcement, User } from '../types';

export const useClassData = () => {
  const [classes, setClasses] = useState<Class[]>([
    { 
      id: 1, 
      name: "Business English - A2", 
      students: 15, 
      schedule: "Seg/Qua 14:00-15:30", 
      status: "active",
      capacity: 20,
      teacher: "Prof. Maria Santos",
      teacherId: 1,
      description: "Curso de inglês focado em comunicação empresarial para nível A2",
      duration: "1h30min",
      startDate: "2024-01-15",
      endDate: "2024-06-15",
      room: "Sala 105"
    },
    { 
      id: 2, 
      name: "Conversation - B1", 
      students: 12, 
      schedule: "Ter/Qui 16:00-17:30", 
      status: "active",
      capacity: 15,
      teacher: "Prof. Maria Santos",
      teacherId: 1,
      description: "Prática de conversação em inglês para nível B1",
      duration: "1h30min",
      startDate: "2024-01-10",
      endDate: "2024-06-10",
      room: "Sala 203"
    },
    { 
      id: 3, 
      name: "Advanced Grammar - C1", 
      students: 18, 
      schedule: "Sex 10:00-12:00", 
      status: "active",
      capacity: 20,
      teacher: "Prof. Maria Santos",
      teacherId: 1,
      description: "Gramática avançada para nível C1",
      duration: "2h",
      startDate: "2024-01-12",
      endDate: "2024-06-12",
      room: "Sala 301"
    }
  ]);

  const addClass = (newClass: Omit<Class, 'id'>) => {
    const id = Math.max(...classes.map(c => c.id), 0) + 1;
    const classWithId = { ...newClass, id };
    setClasses(prev => [...prev, classWithId]);
    
    // Log para debug
    console.log("Nova turma adicionada:", classWithId);
    
    return classWithId;
  };

  const updateClass = (id: number, updatedClass: Partial<Class>) => {
    setClasses(prev => prev.map(c => 
      c.id === id ? { ...c, ...updatedClass } : c
    ));
    
    console.log("Turma atualizada:", id, updatedClass);
  };

  const deleteClass = (id: number) => {
    setClasses(prev => prev.filter(c => c.id !== id));
    
    console.log("Turma deletada:", id);
  };

  const getClassById = (id: number) => {
    return classes.find(c => c.id === id);
  };

  return { 
    classes, 
    addClass, 
    updateClass, 
    deleteClass, 
    getClassById 
  };
};

export const useStudentData = () => {
  const [students, setStudents] = useState<Student[]>([
    { 
      id: 1, 
      name: "João Silva", 
      classId: 1, 
      className: "Business English - A2", 
      grade: 8.5, 
      status: "active", 
      email: "joao.silva@email.com",
      phone: "+258 84 123 4567",
      attendance: 95,
      enrollmentDate: "2024-01-15"
    },
    { 
      id: 2, 
      name: "Maria Oliveira", 
      classId: 2, 
      className: "Conversation - B1", 
      grade: 9.2, 
      status: "active", 
      email: "maria.oliveira@email.com",
      phone: "+258 87 234 5678",
      attendance: 98,
      enrollmentDate: "2024-01-10"
    },
    { 
      id: 3, 
      name: "Pedro Santos", 
      classId: 3, 
      className: "Advanced Grammar - C1", 
      grade: 7.8, 
      status: "active", 
      email: "pedro.santos@email.com",
      phone: "+258 82 345 6789",
      attendance: 87,
      enrollmentDate: "2024-01-20"
    },
    { 
      id: 4, 
      name: "Ana Costa", 
      classId: 1, 
      className: "Business English - A2", 
      grade: 8.9, 
      status: "inactive", 
      email: "ana.costa@email.com",
      phone: "+258 86 456 7890",
      attendance: 76,
      enrollmentDate: "2024-01-08"
    },
    { 
      id: 5, 
      name: "Carlos Mendes", 
      classId: 2, 
      className: "Conversation - B1", 
      grade: 7.5, 
      status: "active", 
      email: "carlos.mendes@email.com",
      phone: "+258 83 567 8901",
      attendance: 89,
      enrollmentDate: "2024-01-12"
    }
  ]);

  const addStudent = (newStudent: Omit<Student, 'id'>) => {
    const id = Math.max(...students.map(s => s.id), 0) + 1;
    const studentWithId = { ...newStudent, id };
    setStudents(prev => [...prev, studentWithId]);
    
    // Atualizar contador de estudantes na turma
    console.log("Novo estudante adicionado:", studentWithId);
    
    return studentWithId;
  };

  const updateStudent = (id: number, updatedStudent: Partial<Student>) => {
    setStudents(prev => prev.map(s => 
      s.id === id ? { ...s, ...updatedStudent } : s
    ));
    
    console.log("Estudante atualizado:", id, updatedStudent);
  };

  const deleteStudent = (id: number) => {
    const student = students.find(s => s.id === id);
    setStudents(prev => prev.filter(s => s.id !== id));
    
    console.log("Estudante removido:", student?.name);
  };

  const getStudentsByClass = (classId: number) => {
    return students.filter(s => s.classId === classId);
  };

  const getStudentById = (id: number) => {
    return students.find(s => s.id === id);
  };

  const getActiveStudents = () => {
    return students.filter(s => s.status === 'active');
  };

  const getInactiveStudents = () => {
    return students.filter(s => s.status === 'inactive');
  };

  const searchStudents = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return students.filter(student => 
      student.name.toLowerCase().includes(lowercaseQuery) ||
      student.email.toLowerCase().includes(lowercaseQuery) ||
      student.className.toLowerCase().includes(lowercaseQuery)
    );
  };

  return { 
    students, 
    addStudent, 
    updateStudent, 
    deleteStudent, 
    getStudentsByClass,
    getStudentById,
    getActiveStudents,
    getInactiveStudents,
    searchStudents
  };
};

export const useTeacherData = () => {
  const [teachers, setTeachers] = useState<User[]>([
    { 
      id: 1, 
      name: "Prof. Maria Santos", 
      email: "maria.santos@m007.com", 
      role: "teacher",
      phone: "+258 84 111 2222"
    },
    { 
      id: 2, 
      name: "Prof. João Pedro", 
      email: "joao.pedro@m007.com", 
      role: "teacher",
      phone: "+258 87 333 4444"
    },
    { 
      id: 3, 
      name: "Prof. Ana Silva", 
      email: "ana.silva@m007.com", 
      role: "teacher",
      phone: "+258 82 555 6666"
    }
  ]);

  const addTeacher = (newTeacher: Omit<User, 'id'>) => {
    const id = Math.max(...teachers.map(t => t.id), 0) + 1;
    const teacherWithId = { ...newTeacher, id };
    setTeachers(prev => [...prev, teacherWithId]);
    
    console.log("Novo professor adicionado:", teacherWithId);
    
    return teacherWithId;
  };

  const updateTeacher = (id: number, updatedTeacher: Partial<User>) => {
    setTeachers(prev => prev.map(t => 
      t.id === id ? { ...t, ...updatedTeacher } : t
    ));
    
    console.log("Professor atualizado:", id, updatedTeacher);
  };

  const deleteTeacher = (id: number) => {
    const teacher = teachers.find(t => t.id === id);
    setTeachers(prev => prev.filter(t => t.id !== id));
    
    console.log("Professor removido:", teacher?.name);
  };

  const getTeacherById = (id: number) => {
    return teachers.find(t => t.id === id);
  };

  return {
    teachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    getTeacherById
  };
};

export const useAssignmentData = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([
    { 
      id: 1, 
      title: "Essay Writing - Business Topic", 
      class: "Business English - A2", 
      classId: 1,
      dueDate: "2024-02-15", 
      submissions: 12, 
      total: 15,
      description: "Escreva um ensaio sobre temas empresariais",
      type: "essay",
      createdAt: "2024-02-01",
      authorId: 1
    },
    { 
      id: 2, 
      title: "Conversation Practice Video", 
      class: "Conversation - B1", 
      classId: 2,
      dueDate: "2024-02-18", 
      submissions: 8, 
      total: 12,
      description: "Grave um vídeo praticando conversação",
      type: "presentation",
      createdAt: "2024-02-03",
      authorId: 1
    },
    { 
      id: 3, 
      title: "Grammar Exercises Unit 5", 
      class: "Advanced Grammar - C1", 
      classId: 3,
      dueDate: "2024-02-20", 
      submissions: 15, 
      total: 18,
      description: "Complete os exercícios da unidade 5",
      type: "exercise",
      createdAt: "2024-02-05",
      authorId: 1
    }
  ]);

  const addAssignment = (newAssignment: Omit<Assignment, 'id'>) => {
    const id = Math.max(...assignments.map(a => a.id), 0) + 1;
    const assignmentWithId = { ...newAssignment, id };
    setAssignments(prev => [...prev, assignmentWithId]);
    
    console.log("Nova atividade criada:", assignmentWithId);
    
    return assignmentWithId;
  };

  const updateAssignment = (id: number, updatedAssignment: Partial<Assignment>) => {
    setAssignments(prev => prev.map(a => 
      a.id === id ? { ...a, ...updatedAssignment } : a
    ));
    
    console.log("Atividade atualizada:", id, updatedAssignment);
  };

  const deleteAssignment = (id: number) => {
    const assignment = assignments.find(a => a.id === id);
    setAssignments(prev => prev.filter(a => a.id !== id));
    
    console.log("Atividade removida:", assignment?.title);
  };

  return { 
    assignments, 
    addAssignment, 
    updateAssignment, 
    deleteAssignment 
  };
};

export const useAnnouncementData = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 1,
      title: "Prova marcada para próxima semana",
      content: "A prova do módulo 3 será na quarta-feira, dia 21/02",
      date: "2024-02-14",
      priority: "high",
      classId: 1,
      authorId: 1,
      targetAudience: "students",
      isActive: true
    },
    {
      id: 2,
      title: "Material disponível",
      content: "Novo material de listening disponível na plataforma",
      date: "2024-02-13",
      priority: "medium",
      classId: 2,
      authorId: 1,
      targetAudience: "students",
      isActive: true
    }
  ]);

  const addAnnouncement = (newAnnouncement: Omit<Announcement, 'id'>) => {
    const id = Math.max(...announcements.map(a => a.id), 0) + 1;
    const announcementWithId = { ...newAnnouncement, id };
    setAnnouncements(prev => [...prev, announcementWithId]);
    
    console.log("Novo aviso criado:", announcementWithId);
    
    return announcementWithId;
  };

  const updateAnnouncement = (id: number, updatedAnnouncement: Partial<Announcement>) => {
    setAnnouncements(prev => prev.map(a => 
      a.id === id ? { ...a, ...updatedAnnouncement } : a
    ));
    
    console.log("Aviso atualizado:", id, updatedAnnouncement);
  };

  const deleteAnnouncement = (id: number) => {
    const announcement = announcements.find(a => a.id === id);
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    
    console.log("Aviso removido:", announcement?.title);
  };

  return { 
    announcements, 
    addAnnouncement, 
    updateAnnouncement, 
    deleteAnnouncement 
  };
};

export const useUserData = () => {
  const [users] = useState<User[]>([
    { id: 1, name: "Prof. Maria Santos", email: "teacher@m007.com", role: "teacher" },
    { id: 2, name: "Admin João", email: "admin@m007.com", role: "admin" },
    { id: 3, name: "João Silva", email: "joao.silva@email.com", role: "student" },
    { id: 4, name: "Maria Oliveira", email: "maria.oliveira@email.com", role: "student" }
  ]);

  return { users };
};

// Hook para relatórios e estatísticas
export const useReportsData = () => {
  const generateReport = (reportType: string, filters: never) => {
    console.log(`Gerando relatório: ${reportType}`);
    console.log('Filtros aplicados:', filters);
    
    // Simular geração de relatório
    setTimeout(() => {
      console.log(`Relatório ${reportType} gerado com sucesso!`);
      // Aqui você implementaria a lógica real de geração
    }, 2000);
    
    return {
      success: true,
      message: `Relatório ${reportType} está sendo gerado...`,
      estimatedTime: '2-5 minutos'
    };
  };

  return {
    generateReport
  };
};