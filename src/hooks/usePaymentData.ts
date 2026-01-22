// src/hooks/usePaymentData.ts
import { useState } from 'react';
import { Payment, StudentPaymentInfo, PaymentSummary, PaymentStatus, PaymentMethod } from '../types';

// Interface estendida para estudantes (apenas visualização)
interface StudentReadOnlyPaymentInfo extends StudentPaymentInfo {
  canMakePayments: boolean;
  canEditPayments: boolean;
  contactInfo: {
    whatsapp: string;
    email: string;
    hours: string;
    address: string;
  };
  paymentMethods: {
    name: string;
    description: string;
    icon: string;
  }[];
}

export const usePaymentData = () => {
  // Dados mockados de pagamentos
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 1,
      studentId: 1,
      amount: 2500,
      dueDate: '2024-01-15',
      paidDate: '2024-01-10',
      method: 'transfer',
      status: 'paid',
      monthReference: '2024-01',
      description: 'Mensalidade Janeiro 2024',
      receiptNumber: 'REC-001',
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      studentId: 1,
      amount: 2500,
      dueDate: '2024-02-15',
      status: 'overdue',
      monthReference: '2024-02',
      description: 'Mensalidade Fevereiro 2024',
      createdAt: '2024-02-01'
    },
    {
      id: 3,
      studentId: 2,
      amount: 2500,
      dueDate: '2024-01-15',
      paidDate: '2024-01-12',
      method: 'cash',
      status: 'paid',
      monthReference: '2024-01',
      description: 'Mensalidade Janeiro 2024',
      receiptNumber: 'REC-002',
      createdAt: '2024-01-01'
    },
    {
      id: 4,
      studentId: 2,
      amount: 2500,
      dueDate: '2024-02-15',
      paidDate: '2024-02-10',
      method: 'mpesa',
      status: 'paid',
      monthReference: '2024-02',
      description: 'Mensalidade Fevereiro 2024',
      receiptNumber: 'REC-003',
      createdAt: '2024-02-01'
    },
    {
      id: 5,
      studentId: 2,
      amount: 5000,
      dueDate: '2024-03-15',
      paidDate: '2024-02-20',
      method: 'transfer',
      status: 'advance',
      monthReference: '2024-03',
      description: 'Pagamento antecipado Março/Abril 2024',
      receiptNumber: 'REC-004',
      createdAt: '2024-02-20'
    },
    {
      id: 6,
      studentId: 3,
      amount: 1200,
      dueDate: '2024-01-15',
      paidDate: '2024-01-20',
      method: 'cash',
      status: 'partial',
      monthReference: '2024-01',
      description: 'Pagamento parcial Janeiro 2024',
      receiptNumber: 'REC-005',
      createdAt: '2024-01-01'
    }
  ]);

  const addPayment = (newPayment: Omit<Payment, 'id' | 'createdAt'>) => {
    const id = Math.max(...payments.map(p => p.id), 0) + 1;
    const paymentWithId = { 
      ...newPayment, 
      id, 
      createdAt: new Date().toISOString()
    };
    setPayments(prev => [...prev, paymentWithId]);
    return paymentWithId;
  };

  const updatePayment = (id: number, updatedPayment: Partial<Payment>) => {
    setPayments(prev => prev.map(p => 
      p.id === id ? { ...p, ...updatedPayment, updatedAt: new Date().toISOString() } : p
    ));
  };

  const deletePayment = (id: number) => {
    setPayments(prev => prev.filter(p => p.id !== id));
  };

  const getPaymentsByStudent = (studentId: number) => {
    return payments.filter(p => p.studentId === studentId);
  };

  const getStudentPaymentInfo = (studentId: number, studentName: string, className: string): StudentPaymentInfo => {
    const studentPayments = getPaymentsByStudent(studentId);
    const monthlyFee = 2500; // Valor padrão da mensalidade
    
    const totalPaid = studentPayments
      .filter(p => p.status === 'paid' || p.status === 'partial')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const overduePayments = studentPayments.filter(p => p.status === 'overdue');
    const advancePayments = studentPayments.filter(p => p.status === 'advance');
    
    const totalDue = studentPayments
      .filter(p => p.status === 'pending' || p.status === 'overdue' || p.status === 'partial')
      .reduce((sum, p) => sum + (monthlyFee - (p.status === 'partial' ? p.amount : 0)), 0);
    
    const advanceAmount = advancePayments.reduce((sum, p) => sum + p.amount, 0);
    const currentBalance = totalPaid + advanceAmount - (studentPayments.length * monthlyFee);
    
    const lastPayment = studentPayments
      .filter(p => p.paidDate)
      .sort((a, b) => new Date(b.paidDate!).getTime() - new Date(a.paidDate!).getTime())[0];

    return {
      studentId,
      studentName,
      className,
      monthlyFee,
      currentBalance,
      totalPaid,
      totalDue,
      lastPaymentDate: lastPayment?.paidDate,
      paymentHistory: studentPayments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      overduePayments,
      advancePayments
    };
  };

  // ✅ NOVO: Método específico para estudantes (apenas visualização)
  const getStudentReadOnlyInfo = (studentId: number, studentName: string, className: string): StudentReadOnlyPaymentInfo => {
    const paymentInfo = getStudentPaymentInfo(studentId, studentName, className);
    
    return {
      ...paymentInfo,
      // Flags de controle
      canMakePayments: false,
      canEditPayments: false,
      // Informações de contato
      contactInfo: {
        whatsapp: '+258 84 000 0000',
        email: 'financeiro@m007oxford.com',
        hours: 'Segunda a Sexta, 8h às 17h',
        address: 'M007 Oxford - Recepção, Maputo'
      },
      // Formas de pagamento disponíveis
      paymentMethods: [
        {
          name: 'Dinheiro',
          description: 'Pagamento na recepção da escola',
          icon: 'cash'
        },
        {
          name: 'Transferência Bancária',
          description: 'BIM, BCI, Standard Bank, Millennium',
          icon: 'bank'
        },
        {
          name: 'M-Pesa',
          description: 'Pagamento via celular',
          icon: 'mobile'
        },
        {
          name: 'Cartão de Débito/Crédito',
          description: 'Na recepção da escola',
          icon: 'card'
        }
      ]
    };
  };

  const getPaymentSummary = (): PaymentSummary => {
    const totalRevenue = payments
      .filter(p => p.status === 'paid' || p.status === 'partial')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const totalPending = payments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const totalOverdue = payments
      .filter(p => p.status === 'overdue')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const totalAdvance = payments
      .filter(p => p.status === 'advance')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const studentsInDebt = new Set(
      payments.filter(p => p.status === 'overdue' || p.status === 'pending').map(p => p.studentId)
    ).size;
    
    const studentsWithAdvance = new Set(
      payments.filter(p => p.status === 'advance').map(p => p.studentId)
    ).size;
    
    const totalPayments = payments.length;
    const paidPayments = payments.filter(p => p.status === 'paid').length;
    const collectionRate = totalPayments > 0 ? (paidPayments / totalPayments) * 100 : 0;
    
    const monthsCount = new Set(payments.map(p => p.monthReference)).size;
    const averageMonthlyRevenue = monthsCount > 0 ? totalRevenue / monthsCount : 0;

    return {
      totalRevenue,
      totalPending,
      totalOverdue,
      totalAdvance,
      studentsInDebt,
      studentsWithAdvance,
      averageMonthlyRevenue,
      collectionRate
    };
  };

  const recordPayment = (
    studentId: number, 
    amount: number, 
    monthReference: string,
    method: PaymentMethod = 'cash',
    description?: string
  ) => {
    const status: PaymentStatus = amount >= 2500 ? 'paid' : 'partial';
    const payment = addPayment({
      studentId,
      amount,
      dueDate: `${monthReference}-15`,
      paidDate: new Date().toISOString().split('T')[0],
      method,
      status,
      monthReference,
      description: description || `Mensalidade ${monthReference}`,
      receiptNumber: `REC-${Date.now()}`
    });
    
    console.log('Pagamento registrado:', payment);
    return payment;
  };

  const markAsOverdue = (paymentId: number) => {
    updatePayment(paymentId, { status: 'overdue' });
  };

  const generateMonthlyPayments = (studentId: number, startMonth: string, months: number) => {
    const payments = [];
    const [year, month] = startMonth.split('-').map(Number);
    
    for (let i = 0; i < months; i++) {
      const currentMonth = new Date(year, month - 1 + i);
      const monthRef = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
      
      const payment = addPayment({
        studentId,
        amount: 2500,
        dueDate: `${monthRef}-15`,
        status: 'pending',
        monthReference: monthRef,
        description: `Mensalidade ${monthRef}`
      });
      
      payments.push(payment);
    }
    
    return payments;
  };

  return {
    payments,
    addPayment,
    updatePayment,
    deletePayment,
    getPaymentsByStudent,
    getStudentPaymentInfo, // Para admin
    getStudentReadOnlyInfo, // ✅ Para estudantes
    getPaymentSummary,
    recordPayment,
    markAsOverdue,
    generateMonthlyPayments
  };
};