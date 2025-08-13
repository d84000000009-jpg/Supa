// src/components/shared/PaymentManagementModal.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  DollarSign,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Receipt,
  CreditCard,
  Calendar,
  History,
  Plus,
  Minus
} from "lucide-react";
import { StudentPaymentInfo, Payment, PaymentMethod, PaymentStatus } from "../../types";

interface PaymentManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentPaymentInfo: StudentPaymentInfo;
  onRecordPayment: (amount: number, method: PaymentMethod, monthReference: string, description?: string) => void;
  onUpdatePayment: (paymentId: number, updates: Partial<Payment>) => void;
}

export function PaymentManagementModal({ 
  isOpen, 
  onClose, 
  studentPaymentInfo,
  onRecordPayment,
  onUpdatePayment
}: PaymentManagementModalProps) {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [monthReference, setMonthReference] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Set default month to current month
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      setMonthReference(currentMonth);
      setPaymentAmount(studentPaymentInfo.monthlyFee.toString());
    }
  }, [isOpen, studentPaymentInfo.monthlyFee]);

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-orange-100 text-orange-800';
      case 'advance': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: PaymentStatus) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'pending': return 'Pendente';
      case 'overdue': return 'Em Atraso';
      case 'partial': return 'Parcial';
      case 'advance': return 'Antecipado';
      default: return status;
    }
  };

  const getMethodText = (method?: PaymentMethod) => {
    switch (method) {
      case 'cash': return 'Dinheiro';
      case 'transfer': return 'Transferência';
      case 'card': return 'Cartão';
      case 'mpesa': return 'M-Pesa';
      case 'other': return 'Outro';
      default: return 'N/A';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(amount);
  };

  const handleRecordPayment = () => {
    const amount = parseFloat(paymentAmount);
    if (amount > 0 && monthReference) {
      onRecordPayment(amount, paymentMethod, monthReference, description || undefined);
      setPaymentAmount(studentPaymentInfo.monthlyFee.toString());
      setDescription('');
    }
  };

  const handleUpdatePaymentStatus = (paymentId: number, newStatus: PaymentStatus) => {
    onUpdatePayment(paymentId, { 
      status: newStatus,
      paidDate: newStatus === 'paid' ? new Date().toISOString().split('T')[0] : undefined
    });
  };

  const balanceColor = studentPaymentInfo.currentBalance >= 0 ? 'text-green-600' : 'text-red-600';
  const balanceIcon = studentPaymentInfo.currentBalance >= 0 ? TrendingUp : TrendingDown;
  const BalanceIcon = balanceIcon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Gerenciar Pagamentos - {studentPaymentInfo.studentName}
              </DialogTitle>
              <DialogDescription>
                Turma: {studentPaymentInfo.className} | Mensalidade: {formatCurrency(studentPaymentInfo.monthlyFee)}
              </DialogDescription>
            </div>
  
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo Financeiro */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${balanceColor} flex items-center justify-center gap-1`}>
                  <BalanceIcon className="h-5 w-5" />
                  {formatCurrency(Math.abs(studentPaymentInfo.currentBalance))}
                </div>
                <div className="text-sm text-muted-foreground">
                  {studentPaymentInfo.currentBalance >= 0 ? 'Crédito' : 'Dívida'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(studentPaymentInfo.totalPaid)}
                </div>
                <div className="text-sm text-muted-foreground">Total Pago</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(studentPaymentInfo.totalDue)}
                </div>
                <div className="text-sm text-muted-foreground">Em Aberto</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {studentPaymentInfo.overduePayments.length}
                </div>
                <div className="text-sm text-muted-foreground">Meses em Atraso</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="record" className="space-y-4">
            <TabsList>
              <TabsTrigger value="record">Registrar Pagamento</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
              <TabsTrigger value="overdue">Em Atraso</TabsTrigger>
              <TabsTrigger value="advance">Antecipados</TabsTrigger>
            </TabsList>

            {/* Registrar Pagamento */}
            <TabsContent value="record" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Registrar Novo Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Valor do Pagamento</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Mês de Referência</Label>
                      <Input
                        type="month"
                        value={monthReference}
                        onChange={(e) => setMonthReference(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Método de Pagamento</Label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="cash">Dinheiro</option>
                        <option value="transfer">Transferência Bancária</option>
                        <option value="card">Cartão</option>
                        <option value="mpesa">M-Pesa</option>
                        <option value="other">Outro</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Ações Rápidas</Label>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPaymentAmount(studentPaymentInfo.monthlyFee.toString())}
                        >
                          Mensalidade Completa
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPaymentAmount((studentPaymentInfo.monthlyFee / 2).toString())}
                        >
                          Meio Pagamento
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Observações (Opcional)</Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Ex: Pagamento em atraso referente ao mês anterior..."
                      rows={2}
                    />
                  </div>

                  <Button onClick={handleRecordPayment} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Registrar Pagamento de {formatCurrency(parseFloat(paymentAmount) || 0)}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Histórico de Pagamentos */}
            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Histórico de Pagamentos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {studentPaymentInfo.paymentHistory.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <div className="font-medium">
                              {payment.monthReference} - {formatCurrency(payment.amount)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {payment.description}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {payment.paidDate ? `Pago em: ${new Date(payment.paidDate).toLocaleDateString('pt-BR')}` : 
                               `Vencimento: ${new Date(payment.dueDate).toLocaleDateString('pt-BR')}`}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(payment.status)}>
                            {getStatusText(payment.status)}
                          </Badge>
                          {payment.method && (
                            <span className="text-xs text-muted-foreground">
                              {getMethodText(payment.method)}
                            </span>
                          )}
                          {payment.receiptNumber && (
                            <Button variant="ghost" size="sm">
                              <Receipt className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pagamentos em Atraso */}
            <TabsContent value="overdue" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Pagamentos em Atraso ({studentPaymentInfo.overduePayments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {studentPaymentInfo.overduePayments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 border-l-4 border-red-500 bg-red-50 rounded-lg">
                        <div>
                          <div className="font-medium text-red-800">
                            {payment.monthReference} - {formatCurrency(payment.amount)}
                          </div>
                          <div className="text-sm text-red-600">
                            Venceu em: {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="text-xs text-red-500">
                            {Math.floor((new Date().getTime() - new Date(payment.dueDate).getTime()) / (1000 * 60 * 60 * 24))} dias em atraso
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdatePaymentStatus(payment.id, 'paid')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Marcar como Pago
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {studentPaymentInfo.overduePayments.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                        <p>Nenhum pagamento em atraso!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pagamentos Antecipados */}
            <TabsContent value="advance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Pagamentos Antecipados ({studentPaymentInfo.advancePayments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {studentPaymentInfo.advancePayments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
                        <div>
                          <div className="font-medium text-blue-800">
                            {payment.monthReference} - {formatCurrency(payment.amount)}
                          </div>
                          <div className="text-sm text-blue-600">
                            Pago em: {payment.paidDate && new Date(payment.paidDate).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="text-xs text-blue-500">
                            Pagamento antecipado
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Badge className="bg-blue-100 text-blue-800">
                            Antecipado
                          </Badge>
                        </div>
                      </div>
                    ))}
                    
                    {studentPaymentInfo.advancePayments.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Clock className="h-12 w-12 mx-auto mb-2 text-blue-500" />
                        <p>Nenhum pagamento antecipado.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}