import { useState, useEffect,useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  UserPlus, Mail, Phone, Calendar, MapPin,
  User, AlertCircle, Sparkles, ChevronRight, CheckCircle2,
  Key, Copy, RefreshCw, Eye, EyeOff, BookOpen, X, ShieldAlert, Hash,
  Printer, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { generateUsername } from "./registration-student-modal/utils/generateUsername";
import { generatePassword } from "./registration-student-modal/utils/generatePassword";
import studentService from "@/services/studentService";
import { useSettingsData } from "@/hooks/useSettingsData";
import { InscriptionPaymentTab, PaymentMethod, PaymentStatus } from "./inscription-modal/InscriptionPaymentTab";
import { DollarSign } from "lucide-react";


// ============================================
// ERROR TOAST COMPONENT - Notificação profissional
// ============================================
interface ErrorToastProps {
  message: string;
  onClose: () => void;
}

function ErrorToast({ message, onClose }: ErrorToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-top-2 fade-in duration-300">
      <div className="bg-white border-l-4 border-red-500 rounded-xl shadow-2xl p-4 max-w-md flex items-start gap-3">
        <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
          <ShieldAlert className="h-5 w-5 text-red-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-slate-800 text-sm">Atenção</h4>
          <p className="text-sm text-slate-600 mt-1">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

// ============================================
// INTERFACES
// ============================================
interface InscriptionFormData {
  name: string;
  email: string;
  phone?: string;
  bi_number: string;
  address?: string;
  gender: 'M' | 'F' | '';
  birth_date?: string;
  emergency_contact_1?: string;
  emergency_contact_2?: string;
  notes?: string;
  enrollment_year: number;
  enrollment_number: string; // API field (mantido para compatibilidade)
  username: string;
  password: string;
  status: 'ativo' | 'inativo';
}

interface InscriptionStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (studentId: number, credentials: { username: string; password: string }) => void;
  onProceedToRegistration?: (studentId: number) => void;
}

// ============================================
// MAIN COMPONENT
// ============================================
export function InscriptionStudentModal({
  isOpen,
  onClose,
  onSuccess,
  onProceedToRegistration,
}: InscriptionStudentModalProps) {





  const dayRef = useRef<HTMLInputElement | null>(null);
const monthRef = useRef<HTMLInputElement | null>(null);
const yearRef = useRef<HTMLInputElement | null>(null);

const pad2 = (v: string) => v.padStart(2, "0");

const clampInt = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const getAge = (yyyy: number, mm: number, dd: number) => {
  const today = new Date();
  const birth = new Date(yyyy, mm - 1, dd);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const parseBirthDateFromText = (text: string) => {
  const digits = text.replace(/\D/g, "");
  // aceita DDMMYYYY
  if (digits.length === 8) {
    const dd = digits.slice(0, 2);
    const mm = digits.slice(2, 4);
    const yyyy = digits.slice(4, 8);
    return { dd, mm, yyyy };
  }
  // aceita DD/MM/YYYY (ou qualquer separador)
  const parts = text.split(/\D+/).filter(Boolean);
  if (parts.length >= 3) {
    const [dd, mm, yyyy] = parts;
    return { dd: (dd || "").slice(0, 2), mm: (mm || "").slice(0, 2), yyyy: (yyyy || "").slice(0, 4) };
  }
  return null;
};

const normalizeBirthParts = (day: string, month: string, year: string) => {
  const currentYear = new Date().getFullYear();

  const dNum = Number(day);
  const d = Number.isFinite(dNum) && dNum >= 1 && dNum <= 31 ? dNum : 0;

  const mNum = Number(month);
  const m = Number.isFinite(mNum) && mNum >= 1 && mNum <= 12 ? mNum : 0;

  const yNum = Number(year);
  const y = Number.isFinite(yNum) && yNum >= 1900 && yNum <= currentYear ? yNum : 0;

  return {
    day: d ? pad2(String(d)) : "",
    month: m ? pad2(String(m)) : "",
    year: y ? String(y) : "",
  };
};




  const [activeTab, setActiveTab] = useState<'personal' | 'contacts' | 'payment' | 'credentials'>('personal');

  // Carregar configurações de inscrição
  const { settings } = useSettingsData();
  const inscriptionIsPaid = settings.inscriptionIsPaid;
  const inscriptionFee = settings.inscriptionFee;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [savedCredentials, setSavedCredentials] = useState<{ username: string; password: string; studentId: number } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<'username' | 'password' | null>(null);

  // Error Toast State
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bi_number: '',
    address: '',
    gender: '' as 'M' | 'F' | '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    emergency_contact_1: '',
    emergency_contact_2: '',
    notes: '',
    username: '',
    password: '',
    student_number: '', // Renomeado conceitualmente (enrollment_number na API)
    // Campos de pagamento (se inscrição for paga)
    paymentMethod: 'cash' as PaymentMethod,
    paymentStatus: 'pending' as PaymentStatus, // pending, paid, exempt
    paymentReference: ''
  });

  // Estado de loading para marcar como pago
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);

  // Handler para marcar como pago (apenas UI - backend será chamado no save)
  const handleMarkAsPaid = () => {
    // Validar referência se não for cash
    if (formData.paymentMethod !== 'cash' && !formData.paymentReference.trim()) {
      showError("Por favor, insira a referência do pagamento antes de marcar como pago.");
      return;
    }
    setFormData(prev => ({ ...prev, paymentStatus: 'paid' }));
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Gerar número de estudante automaticamente
  const generateStudentNumber = (): string => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `EST${year}${random}`;
  };

  // Auto-gerar credenciais quando o nome é digitado
  useEffect(() => {
    if (formData.name.trim().length >= 3) {
      const newUsername = generateUsername(formData.name);
      const newPassword = generatePassword(10);
      const newStudentNumber = generateStudentNumber();

      setFormData(prev => ({
        ...prev,
        username: prev.username || newUsername,
        password: prev.password || newPassword,
        student_number: prev.student_number || newStudentNumber
      }));
    }
  }, [formData.name]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const regenerateUsername = () => {
    if (formData.name.trim().length >= 3) {
      setFormData(prev => ({ ...prev, username: generateUsername(formData.name) }));
    }
  };

  const regeneratePassword = () => {
    setFormData(prev => ({ ...prev, password: generatePassword(10) }));
  };

  const regenerateStudentNumber = () => {
    setFormData(prev => ({ ...prev, student_number: generateStudentNumber() }));
  };

  const copyToClipboard = async (text: string, field: 'username' | 'password') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  // Show error toast with professional message
  const showError = (message: string) => {
    setErrorToast(message);
  };

const validateForm = () => {
  const newErrors: Record<string, string> = {};

  // Campos obrigatórios
  if (!formData.name.trim()) {
    newErrors.name = "Nome é obrigatório";
    showError("Por favor, preencha o nome completo do estudante.");
  }

  if (!formData.email.trim()) {
    newErrors.email = "Email é obrigatório";
    showError("Por favor, forneça um endereço de email válido.");
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = "Formato de email inválido";
    showError("O email fornecido não está num formato válido. Exemplo: nome@dominio.com");
  }

  // Validação do BI
  if (!formData.bi_number.trim()) {
    newErrors.bi_number = "Número do BI é obrigatório";
    showError("Por favor, insira o número do Bilhete de Identidade.");
  } else if (!/^\d{12}[A-Z]$/i.test(formData.bi_number.trim())) {
    newErrors.bi_number = "Formato inválido";
    showError("O BI deve ter 12 números seguidos de 1 letra. Exemplo: 110100123456P");
  }

  if (!formData.gender) {
    newErrors.gender = "Selecione o sexo";
    showError("Por favor, selecione o sexo do estudante.");
  }

  // Pagamento (se inscrição for paga)
  if (inscriptionIsPaid && inscriptionFee > 0) {
    if (formData.paymentStatus !== 'paid') {
      newErrors.payment = "Pagamento não confirmado";
      showError(`Clique em 'Marcar como Pago' para confirmar o pagamento da taxa de inscrição (${formatCurrency(inscriptionFee)}).`);
    }
    if (formData.paymentMethod !== 'cash' && !formData.paymentReference.trim()) {
      newErrors.paymentReference = "Referência é obrigatória";
      showError("Por favor, insira a referência ou comprovativo do pagamento.");
    }
  }

  // Credenciais
  if (!formData.username.trim()) {
    newErrors.username = "Username é obrigatório";
    showError("Por favor, defina um username para acesso ao portal.");
  } else if (formData.username.length < 5) {
    newErrors.username = "Mínimo 5 caracteres";
    showError("O username deve ter pelo menos 5 caracteres para maior segurança.");
  }

  if (!formData.password.trim()) {
    newErrors.password = "Password é obrigatória";
    showError("Por favor, defina uma password para o estudante.");
  } else if (formData.password.length < 6) {
    newErrors.password = "Mínimo 6 caracteres";
    showError("Por favor, escolha uma password mais forte com pelo menos 6 caracteres.");
  }

  // Data de nascimento (se preenchida)
  if (formData.birthDay || formData.birthMonth || formData.birthYear) {
    const day = parseInt(formData.birthDay, 10);
    const month = parseInt(formData.birthMonth, 10);
    const year = parseInt(formData.birthYear, 10);

    if (!formData.birthDay || !day || day < 1 || day > 31) {
      newErrors.birthDate = "Dia inválido";
    }
    if (!formData.birthMonth || !month || month < 1 || month > 12) {
      newErrors.birthDate = "Mês inválido";
    }
    if (!formData.birthYear || !year || year < 1900 || year > new Date().getFullYear()) {
      newErrors.birthDate = "Ano inválido";
    }

    // validação real (31/02 etc)
    if (!newErrors.birthDate && formData.birthDay && formData.birthMonth && formData.birthYear) {
      const test = new Date(year, month - 1, day);
      const ok =
        test.getFullYear() === year &&
        test.getMonth() === month - 1 &&
        test.getDate() === day;

      if (!ok) {
        newErrors.birthDate = "Data inválida";
      }
    }

    if (newErrors.birthDate) {
      showError("A data de nascimento inserida não é válida.");
    }
  }

  // ✅ aqui é o ponto-chave
  setErrors(newErrors);
  return Object.keys(newErrors).length > 0 ? newErrors : null;
};


 const handleSave = async () => {
  const validationErrors = validateForm();

  if (validationErrors) {
    // Aba "Dados Pessoais"
    if (
      validationErrors.name ||
      validationErrors.email ||
      validationErrors.bi_number ||
      validationErrors.gender ||
      validationErrors.birthDate
    ) {
      setActiveTab("personal");
    }
    // Aba "Pagamento" (se inscrição for paga)
    else if (
      inscriptionIsPaid && (
        validationErrors.payment ||
        validationErrors.paymentReference
      )
    ) {
      setActiveTab("payment");
    }
    // Aba "Credenciais"
    else if (
      validationErrors.username ||
      validationErrors.password ||
      validationErrors.student_number
    ) {
      setActiveTab("credentials");
    }

    return;
  }


    setIsSubmitting(true);

    try {
      // Montar data de nascimento
      let birth_date = undefined;
      if (formData.birthDay && formData.birthMonth && formData.birthYear) {
        const day = formData.birthDay.padStart(2, '0');
        const month = formData.birthMonth.padStart(2, '0');
        birth_date = `${formData.birthYear}-${month}-${day}`;
      }

      // Dados para API - COM credenciais (inscrição)
      const studentData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        bi_number: formData.bi_number.toUpperCase(),
        address: formData.address || undefined,
        gender: formData.gender as 'M' | 'F',
        birth_date,
        emergency_contact_1: formData.emergency_contact_1 || undefined,
        emergency_contact_2: formData.emergency_contact_2 || undefined,
        notes: formData.notes || undefined,
        enrollment_number: formData.student_number,
        enrollment_year: new Date().getFullYear(),
        username: formData.username,
        password: formData.password,
        status: 'ativo' as const,
        // Taxa de inscrição congelada (valor no momento da inscrição)
        inscription_fee_amount: inscriptionIsPaid ? inscriptionFee : 0,
        // Se paymentStatus=paid, envia o valor total como amount_paid
        amount_paid: (inscriptionIsPaid && formData.paymentStatus === 'paid') ? inscriptionFee : 0,
        payment_method: formData.paymentMethod,
        payment_reference: formData.paymentReference || undefined
      };

      // Chamada à API usando studentService (já inclui token de autenticação)
      console.log('📤 Enviando dados para API:', studentData);
      const result = await studentService.create(studentData as any);
      console.log('📥 Resposta completa da API:', JSON.stringify(result, null, 2));

      // Verificar se a API retornou erro explícito
      if (result.success === false) {
        console.error('❌ API retornou erro explícito:', result);
        throw new Error(result.message || 'Erro ao criar estudante');
      }

      // Verificar se temos o ID do estudante
      if (!result.id) {
        console.error('❌ API retornou sucesso mas sem ID:', result);
        console.error('Isso pode indicar um problema na resposta da API.');
        throw new Error('Estudante criado mas ID não retornado. Por favor, verifique na lista de estudantes.');
      }

      // Sucesso - result contém o estudante criado
      const studentId = Number(result.id);
      console.log('✅ Estudante criado com sucesso! ID:', studentId);
      setSavedCredentials({
        username: formData.username,
        password: formData.password,
        studentId: studentId
      });
      console.log('✅ Mostrando modal de sucesso...');
      setShowSuccess(true);
      onSuccess(studentId, { username: formData.username, password: formData.password });

    } catch (error: any) {
      console.error("Erro ao inscrever estudante:", error);
      const errorMessage = error.message || error.toString();

      // Tratar erros específicos com mensagens profissionais
      if (errorMessage.toLowerCase().includes('username')) {
        setErrors({ username: 'Username já em uso' });
        setActiveTab('credentials');
        showError('Este username já está a ser utilizado por outro estudante. Por favor, escolha um username diferente.');
      } else if (errorMessage.toLowerCase().includes('email')) {
        setErrors({ email: 'Email já cadastrado' });
        setActiveTab('personal');
        showError('Este endereço de email já está registado no sistema. Verifique se o estudante já possui cadastro.');
      } else if (errorMessage.toLowerCase().includes('bi') || errorMessage.toLowerCase().includes('bi_number')) {
        setErrors({ bi_number: 'BI já cadastrado' });
        setActiveTab('personal');
        showError('Este número de BI já está registado no sistema. Verifique se o estudante já possui cadastro.');
      } else if (errorMessage.toLowerCase().includes('enrollment') || errorMessage.toLowerCase().includes('student_number')) {
        setErrors({ student_number: 'Número já existe' });
        setActiveTab('credentials');
        showError('Este número de estudante já existe. Clique no botão de regenerar para gerar um novo.');
      } else {
        showError(errorMessage || 'Ocorreu um erro ao processar a inscrição. Por favor, tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '', email: '', phone: '', bi_number: '', address: '', gender: '',
      birthDay: '', birthMonth: '', birthYear: '',
      emergency_contact_1: '', emergency_contact_2: '', notes: '',
      username: '', password: '', student_number: '',
      paymentMethod: 'cash', paymentStatus: 'pending', paymentReference: ''
    });
    setErrors({});
    setErrorToast(null);
    setActiveTab('personal');
    setShowSuccess(false);
    setSavedCredentials(null);
    onClose();
  };

  const handleProceedToRegistration = () => {
    if (savedCredentials && onProceedToRegistration) {
      const studentId = savedCredentials.studentId;
      // Fechar este modal primeiro
      setFormData({
        name: '', email: '', phone: '', bi_number: '', address: '', gender: '',
        birthDay: '', birthMonth: '', birthYear: '',
        emergency_contact_1: '', emergency_contact_2: '', notes: '',
        username: '', password: '', student_number: '',
        paymentMethod: 'cash', paymentStatus: 'pending', paymentReference: ''
      });
      setErrors({});
      setErrorToast(null);
      setActiveTab('personal');
      setShowSuccess(false);
      setSavedCredentials(null);
      onClose();
      // Depois abrir o modal de matrícula com o studentId
      setTimeout(() => {
        onProceedToRegistration(studentId);
      }, 100);
    }
  };

  const validateAndNext = () => {
    // Tabs dinâmicos: inclui 'payment' apenas se inscrição for paga
    const tabs: ('personal' | 'contacts' | 'payment' | 'credentials')[] = inscriptionIsPaid
      ? ['personal', 'contacts', 'payment', 'credentials']
      : ['personal', 'contacts', 'credentials'];

    const nextIndex = tabs.indexOf(activeTab) + 1;
    if (nextIndex < tabs.length) setActiveTab(tabs[nextIndex]);
  };

  // Formatter de moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-MZ", {
      style: "currency",
      currency: "MZN",
    }).format(value);
  };

  // Handler para imprimir recibo de inscrição
  const handlePrintReceipt = () => {
    if (!savedCredentials) return;

    const currentYear = new Date().getFullYear();
    const currentDate = new Date().toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    const currentTime = new Date().toLocaleTimeString('pt-PT', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const receiptContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Recibo de Inscrição - ${formData.name}</title>
        <style>
          @page { size: A4; margin: 15mm; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            padding: 30px;
            max-width: 800px;
            margin: 0 auto;
            color: #333;
            line-height: 1.5;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #004B87;
          }
          .header h1 {
            color: #004B87;
            margin: 0 0 5px 0;
            font-size: 24px;
            font-weight: bold;
          }
          .header .subtitle {
            color: #F5821F;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .header .meta {
            color: #666;
            font-size: 12px;
          }
          .receipt-number {
            background: #004B87;
            color: white;
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            margin-top: 10px;
          }
          .section {
            margin: 25px 0;
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            border-left: 4px solid #004B87;
          }
          .section h2 {
            color: #004B87;
            font-size: 14px;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          .info-item {
            padding: 10px;
            background: white;
            border-radius: 8px;
          }
          .info-item .label {
            font-size: 10px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .info-item .value {
            font-size: 14px;
            color: #333;
            font-weight: 600;
            margin-top: 3px;
          }
          .credentials-section {
            background: linear-gradient(135deg, #004B87 0%, #0066B3 100%);
            color: white;
            border-radius: 10px;
            padding: 25px;
            margin: 25px 0;
          }
          .credentials-section h2 {
            color: #F5821F;
            margin-bottom: 15px;
            font-size: 14px;
            text-transform: uppercase;
          }
          .credentials-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          .credential-box {
            background: rgba(255,255,255,0.1);
            padding: 15px;
            border-radius: 8px;
          }
          .credential-box .label {
            font-size: 10px;
            color: rgba(255,255,255,0.7);
            text-transform: uppercase;
          }
          .credential-box .value {
            font-size: 18px;
            font-weight: bold;
            font-family: 'Courier New', monospace;
            margin-top: 5px;
            color: #F5821F;
          }
          .warning-box {
            background: #FFF3E0;
            border: 2px dashed #F5821F;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            margin-top: 15px;
          }
          .warning-box p {
            color: #E65100;
            font-size: 12px;
            font-weight: 600;
          }
          .payment-section {
            background: #E8F5E9;
            border-left: 4px solid #4CAF50;
          }
          .total-box {
            background: #004B87;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 15px;
          }
          .total-box .label {
            font-size: 14px;
          }
          .total-box .value {
            font-size: 24px;
            font-weight: bold;
            color: #F5821F;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            padding-top: 20px;
            border-top: 2px solid #eee;
          }
          .footer p {
            color: #666;
            font-size: 11px;
            margin: 5px 0;
          }
          .signature-area {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
          }
          .signature-box {
            width: 45%;
            text-align: center;
          }
          .signature-line {
            border-top: 1px solid #333;
            margin-top: 50px;
            padding-top: 10px;
            font-size: 12px;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ISAC - Instituto Superior de Artes e Cultura</h1>
          <p class="subtitle">RECIBO DE INSCRIÇÃO</p>
          <p class="meta">${currentDate} às ${currentTime}</p>
          <span class="receipt-number">Nº INS-${currentYear}-${savedCredentials.studentId.toString().padStart(5, '0')}</span>
        </div>

        <div class="section">
          <h2>📋 Dados do Estudante</h2>
          <div class="info-grid">
            <div class="info-item">
              <div class="label">Nome Completo</div>
              <div class="value">${formData.name}</div>
            </div>
            <div class="info-item">
              <div class="label">Código do Estudante</div>
              <div class="value" style="color: #004B87; font-family: monospace;">${formData.student_number}</div>
            </div>
            <div class="info-item">
              <div class="label">Email</div>
              <div class="value">${formData.email}</div>
            </div>
            <div class="info-item">
              <div class="label">Telefone</div>
              <div class="value">${formData.phone || 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="label">Nº BI</div>
              <div class="value">${formData.bi_number}</div>
            </div>
            <div class="info-item">
              <div class="label">Ano de Inscrição</div>
              <div class="value">${currentYear}</div>
            </div>
          </div>
        </div>

        <div class="credentials-section">
          <h2>🔐 Credenciais de Acesso ao Portal</h2>
          <div class="credentials-grid">
            <div class="credential-box">
              <div class="label">Username</div>
              <div class="value">${savedCredentials.username}</div>
            </div>
            <div class="credential-box">
              <div class="label">Password</div>
              <div class="value">${savedCredentials.password}</div>
            </div>
          </div>
          <div class="warning-box">
            <p>⚠️ IMPORTANTE: Guarde estas credenciais em local seguro. Não poderão ser recuperadas!</p>
          </div>
        </div>

        <div class="section payment-section">
          <h2>💰 Informação de Pagamento</h2>
          <div class="info-grid">
            <div class="info-item">
              <div class="label">Tipo</div>
              <div class="value">Taxa de Inscrição</div>
            </div>
            <div class="info-item">
              <div class="label">Estado</div>
              <div class="value" style="color: ${formData.paymentStatus === 'paid' ? '#4CAF50' : '#F5821F'};">
                ${formData.paymentStatus === 'paid' ? '✅ PAGO' : '⏳ Pendente'}
              </div>
            </div>
            ${formData.paymentStatus === 'paid' ? `
            <div class="info-item">
              <div class="label">Método de Pagamento</div>
              <div class="value">${formData.paymentMethod === 'cash' ? 'Numerário' : formData.paymentMethod === 'transfer' ? 'Transferência' : formData.paymentMethod === 'mpesa' ? 'M-Pesa' : formData.paymentMethod}</div>
            </div>
            <div class="info-item">
              <div class="label">Referência</div>
              <div class="value">${formData.paymentReference || 'N/A'}</div>
            </div>
            ` : ''}
          </div>
          <div class="total-box">
            <span class="label">VALOR DA INSCRIÇÃO:</span>
            <span class="value">${formatCurrency(inscriptionFee)}</span>
          </div>
        </div>

        <div class="signature-area">
          <div class="signature-box">
            <div class="signature-line">Assinatura do Funcionário</div>
          </div>
          <div class="signature-box">
            <div class="signature-line">Assinatura do Estudante</div>
          </div>
        </div>

        <div class="footer">
          <p><strong>ISAC - Instituto Superior de Artes e Cultura</strong></p>
          <p>Este documento comprova a inscrição do estudante no sistema académico.</p>
          <p>Documento gerado automaticamente em ${new Date().toLocaleString('pt-PT')}</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  // ============================================
  // MODAL DE SUCESSO - PROFISSIONAL
  // ============================================
  if (showSuccess && savedCredentials) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl bg-white">
          <div className="flex">
            {/* Lado esquerdo - Confirmação */}
            <div className="flex-1 p-8">
              {/* Header com ícone de sucesso */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-black text-slate-800">
                    Inscrição Concluída!
                  </DialogTitle>
                  <p className="text-slate-500 text-sm">
                    O estudante foi inscrito com sucesso no sistema.
                  </p>
                </div>
              </div>

              {/* Resumo do estudante */}
              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Nome:</span>
                    <p className="font-semibold text-slate-800">{formData.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Nº Estudante:</span>
                    <p className="font-mono font-bold text-[#004B87]">{formData.student_number}</p>
                  </div>
                </div>
              </div>

              {/* Credenciais */}
              <div className="bg-gradient-to-br from-[#004B87]/5 to-[#F5821F]/5 border border-[#004B87]/20 rounded-xl p-4 mb-6">
                <h3 className="text-xs font-bold text-[#004B87] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Key className="h-3 w-3" />
                  Credenciais de Acesso ao Portal
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Username</span>
                      <p className="font-mono font-bold text-[#004B87]">{savedCredentials.username}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(savedCredentials.username, 'username')}
                      className="h-8 w-8 p-0"
                    >
                      {copiedField === 'username' ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Password</span>
                      <p className="font-mono font-bold text-[#F5821F]">{savedCredentials.password}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(savedCredentials.password, 'password')}
                      className="h-8 w-8 p-0"
                    >
                      {copiedField === 'password' ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <p className="text-[10px] text-amber-700 mt-3 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Anote estas credenciais! Não poderão ser recuperadas.
                </p>
              </div>
            </div>

            {/* Lado direito - Próximo passo */}
            <div className="w-72 bg-gradient-to-br from-[#004B87] to-[#003A6B] p-6 flex flex-col text-white">
              <div className="flex-1">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-[#F5821F]" />
                </div>

                <h3 className="text-lg font-bold mb-2">Próximo Passo</h3>
                <p className="text-blue-100 text-sm mb-6">
                  Deseja matricular este estudante num curso agora?
                </p>

                <div className="space-y-3">
                  {/* Botão Sim - Fazer Matrícula */}
                  {onProceedToRegistration && (
                    <Button
                      onClick={handleProceedToRegistration}
                      className="w-full h-12 bg-[#F5821F] hover:bg-[#E07318] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30"
                    >
                      <BookOpen className="h-4 w-4" />
                      Sim, Fazer Matrícula
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}

                  {/* Botão Imprimir Recibo */}
                  <Button
                    variant="outline"
                    onClick={handlePrintReceipt}
                    className="w-full h-10 bg-white/10 hover:bg-white/20 border-white/30 text-white rounded-xl font-medium flex items-center justify-center gap-2"
                  >
                    <Printer className="h-4 w-4" />
                    Imprimir Recibo
                  </Button>

                  {/* Botão Não */}
                  <Button
                    variant="ghost"
                    onClick={handleClose}
                    className="w-full h-10 text-blue-200 hover:text-white hover:bg-white/10 rounded-xl font-medium"
                  >
                    Não, Voltar à Lista
                  </Button>
                </div>
              </div>

              {/* Info footer */}
              <div className="mt-auto pt-4 border-t border-white/10">
                <p className="text-[10px] text-blue-200">
                  A matrícula pode ser feita posteriormente na página de matrículas.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ============================================
  // MODAL PRINCIPAL DE INSCRIÇÃO
  // ============================================
  return (
    <>
      {/* Error Toast */}
      {errorToast && (
        <ErrorToast
          message={errorToast}
          onClose={() => setErrorToast(null)}
        />
      )}

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden border-none shadow-2xl bg-white">
          <div className="flex h-[700px]">

            {/* SIDEBAR */}
            <div className="w-72 bg-[#004B87] p-8 flex flex-col text-white">
              <div className="flex items-center gap-3 mb-12">
                <div className="h-10 w-10 bg-[#F5821F] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <UserPlus className="text-white h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-bold text-lg leading-none">Inscrição</h2>
                  <span className="text-[10px] text-blue-200 uppercase tracking-widest">
                    Novo Estudante
                  </span>
                </div>
              </div>

              <nav className="space-y-4 flex-1">
                {[
                  { id: 'personal', label: 'Dados Pessoais', icon: User, desc: 'Informações Básicas' },
                  { id: 'contacts', label: 'Contatos', icon: Phone, desc: 'Emergência e Observações' },
                  // Mostrar tab de pagamento apenas se inscrição for paga
                  ...(inscriptionIsPaid ? [{ id: 'payment', label: 'Pagamento', icon: DollarSign, desc: `Taxa: ${formatCurrency(inscriptionFee)}` }] : []),
                  { id: 'credentials', label: 'Credenciais', icon: Key, desc: 'Acesso ao Portal' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'personal' | 'contacts' | 'payment' | 'credentials')}
                    className={cn(
                      "w-full flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 text-left group",
                      activeTab === tab.id
                        ? "bg-white/10 text-white ring-1 ring-[#F5821F]/30 shadow-xl"
                        : "text-blue-200/60 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-lg transition-colors",
                      activeTab === tab.id ? "bg-[#F5821F] text-white" : "bg-[#003A6B] text-blue-300 group-hover:bg-[#003A6B]/80"
                    )}>
                      <tab.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{tab.label}</p>
                      <p className="text-[11px] opacity-60">{tab.desc}</p>
                    </div>
                  </button>
                ))}
              </nav>

              <div className="mt-auto p-4 bg-[#F5821F]/10 border border-[#F5821F]/20 rounded-2xl">
                <div className="flex items-center gap-2 mb-2 text-[#F5821F]">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase">Info</span>
                </div>
                <p className="text-[11px] text-blue-100 leading-relaxed">
                  A inscrição gera o número de estudante e credenciais de acesso. A matrícula num curso é feita posteriormente.
                </p>
              </div>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 flex flex-col">
              <header className="px-10 py-8 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <DialogTitle className="text-2xl font-black text-slate-800 tracking-tight">
                    Inscrição de Estudante
                  </DialogTitle>
                  <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                    <span>Cadastro + Credenciais</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-[#F5821F] font-medium">
                      {activeTab === 'personal' ? 'DADOS PESSOAIS' : activeTab === 'contacts' ? 'CONTATOS' : activeTab === 'payment' ? 'PAGAMENTO' : 'CREDENCIAIS'}
                    </span>
                  </div>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar bg-slate-50/30">

                {/* TAB: PERSONAL */}
                {activeTab === 'personal' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                    <section className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-[#F5821F]/10 text-[#F5821F] rounded-lg">
                          <User className="h-5 w-5" />
                        </div>
                        <Label className="font-bold text-slate-700 leading-none">Identificação</Label>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-600 font-semibold ml-1">
                            Nome Completo <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            placeholder="Nome completo do estudante"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={cn("h-12 rounded-xl", errors.name && "border-red-500 bg-red-50")}
                          />
                          {errors.name && (
                            <p className="text-xs text-red-600 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.name}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-slate-600 font-semibold ml-1">
                              Número do BI <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              placeholder="110100123456P"
                              value={formData.bi_number}
                              onChange={(e) => {
                                const value = e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, '').slice(0, 13);
                                handleInputChange('bi_number', value);
                              }}
                              maxLength={13}
                              className={cn("h-12 rounded-xl font-mono", errors.bi_number && "border-red-500 bg-red-50")}
                            />
                            {errors.bi_number && (
                              <p className="text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.bi_number}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label className="text-slate-600 font-semibold ml-1">
                              Sexo <span className="text-red-500">*</span>
                            </Label>
                            <select
                              value={formData.gender}
                              onChange={(e) => handleInputChange('gender', e.target.value)}
                              className={cn(
                                "w-full h-12 px-4 border-2 rounded-xl outline-none focus:ring-2 focus:ring-[#F5821F]/20",
                                errors.gender ? "border-red-500 bg-red-50" : "border-slate-200"
                              )}
                            >
                              <option value="">Selecione</option>
                              <option value="M">Masculino</option>
                              <option value="F">Feminino</option>
                            </select>
                            {errors.gender && (
                              <p className="text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.gender}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-slate-600 font-semibold ml-1">
                              Email <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                              <Mail className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                type="email"
                                placeholder="email@exemplo.com"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className={cn("h-12 pl-11 rounded-xl", errors.email && "border-red-500 bg-red-50")}
                              />
                            </div>
                            {errors.email && (
                              <p className="text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.email}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label className="text-slate-600 font-semibold ml-1">Telefone</Label>
                            <div className="relative">
                              <Phone className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                placeholder="+258 84 123 4567"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className="h-12 pl-11 rounded-xl"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
  <Label className="text-slate-600 font-semibold ml-1">Data de Nascimento</Label>

  <div className="relative">
    <Calendar className="absolute left-4 top-3 h-4 w-4 text-slate-400 z-10" />

    <div
      className={cn(
        "flex items-center gap-1 border-2 rounded-xl h-12 pl-11 pr-3 bg-white transition-all",
        "focus-within:ring-2 focus-within:ring-[#F5821F]/20 focus-within:border-[#F5821F]",
        errors.birthDate ? "border-red-500 bg-red-50" : "border-slate-200"
      )}
      onPaste={(e) => {
        const text = e.clipboardData.getData("text");
        const parsed = parseBirthDateFromText(text);
        if (!parsed) return;

        e.preventDefault();

        const normalized = normalizeBirthParts(parsed.dd, parsed.mm, parsed.yyyy);
        handleInputChange("birthDay", normalized.day);
        handleInputChange("birthMonth", normalized.month);
        handleInputChange("birthYear", normalized.year);

        // se completou o ano, foca no ano
        if (normalized.year.length === 4) yearRef.current?.focus();
      }}
    >
      <input
        ref={dayRef}
        inputMode="numeric"
        autoComplete="bday-day"
        value={formData.birthDay}
        onChange={(e) => {
          const raw = e.target.value.replace(/\D/g, "").slice(0, 2);
          handleInputChange("birthDay", raw);

          if (raw.length === 2) monthRef.current?.focus();
        }}
        onBlur={() => {
          if (!formData.birthDay) return;
          const normalized = normalizeBirthParts(formData.birthDay, formData.birthMonth, formData.birthYear);
          handleInputChange("birthDay", normalized.day);
        }}
        onKeyDown={(e) => {
          if (e.key === "Backspace" && !formData.birthDay) {
            // nada a fazer (é o primeiro)
          }
        }}
        placeholder="DD"
        maxLength={2}
        className="w-10 text-center outline-none bg-transparent font-semibold text-slate-800 placeholder:text-slate-300"
      />

      <span className="text-slate-300 font-bold select-none">/</span>

      <input
        ref={monthRef}
        inputMode="numeric"
        autoComplete="bday-month"
        value={formData.birthMonth}
        onChange={(e) => {
          const raw = e.target.value.replace(/\D/g, "").slice(0, 2);
          handleInputChange("birthMonth", raw);

          if (raw.length === 2) yearRef.current?.focus();
        }}
        onBlur={() => {
          if (!formData.birthMonth) return;
          const normalized = normalizeBirthParts(formData.birthDay, formData.birthMonth, formData.birthYear);
          handleInputChange("birthMonth", normalized.month);
        }}
        onKeyDown={(e) => {
          if (e.key === "Backspace" && !formData.birthMonth) {
            dayRef.current?.focus();
          }
        }}
        placeholder="MM"
        maxLength={2}
        className="w-10 text-center outline-none bg-transparent font-semibold text-slate-800 placeholder:text-slate-300"
      />

      <span className="text-slate-300 font-bold select-none">/</span>

      <input
        ref={yearRef}
        inputMode="numeric"
        autoComplete="bday-year"
        value={formData.birthYear}
        onChange={(e) => {
          const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
          handleInputChange("birthYear", raw);
        }}
        onBlur={() => {
          if (!formData.birthYear) return;
          const normalized = normalizeBirthParts(formData.birthDay, formData.birthMonth, formData.birthYear);
          handleInputChange("birthYear", normalized.year);
        }}
        onKeyDown={(e) => {
          if (e.key === "Backspace" && !formData.birthYear) {
            monthRef.current?.focus();
          }
        }}
        placeholder="AAAA"
        maxLength={4}
        className="w-16 text-center outline-none bg-transparent font-semibold text-slate-800 placeholder:text-slate-300"
      />

      {/* Badge de idade (opcional, bem profissional) */}
      {formData.birthDay && formData.birthMonth && formData.birthYear?.length === 4 && (() => {
        const d = parseInt(formData.birthDay, 10);
        const m = parseInt(formData.birthMonth, 10);
        const y = parseInt(formData.birthYear, 10);
        if (!d || !m || !y) return null;
        const age = getAge(y, m, d);
        if (age < 0 || age > 120) return null;
        return (
          <span className="ml-auto text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
            {age} anos
          </span>
        );
      })()}
    </div>
  </div>

  {errors.birthDate && (
    <p className="text-xs text-red-600 flex items-center gap-1">
      <AlertCircle className="h-3 w-3" />
      {errors.birthDate}
    </p>
  )}

  {/* Helper text (opcional) */}
  <p className="text-[11px] text-slate-400 ml-1">
    Dica: podes colar assim “24/08/2001” ou “24082001”.
  </p>
</div>


                          <div className="space-y-2">
                            <Label className="text-slate-600 font-semibold ml-1">Endereço</Label>
                            <div className="relative">
                              <MapPin className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                placeholder="Endereço completo"
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                className="h-12 pl-11 rounded-xl"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                )}

                {/* TAB: CONTACTS */}
                {activeTab === 'contacts' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
                    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-100 text-red-700 rounded-lg">
                          <Phone className="h-5 w-5" />
                        </div>
                        <Label className="font-bold text-slate-700 leading-none">
                          Contatos de Emergência <span className="text-slate-500">(Opcional)</span>
                        </Label>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-600 font-semibold ml-1">Contato 1</Label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              placeholder="+258 84 000 0000"
                              value={formData.emergency_contact_1}
                              onChange={(e) => handleInputChange('emergency_contact_1', e.target.value)}
                              className={cn("h-12 pl-11 rounded-xl", errors.emergency_contact_1 && "border-red-500")}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-600 font-semibold ml-1">Contato 2</Label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              placeholder="+258 85 000 0000"
                              value={formData.emergency_contact_2}
                              onChange={(e) => handleInputChange('emergency_contact_2', e.target.value)}
                              className={cn("h-12 pl-11 rounded-xl", errors.emergency_contact_2 && "border-red-500")}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-600 font-semibold ml-1">Observações</Label>
                        <Textarea
                          placeholder="Informações adicionais sobre o estudante..."
                          value={formData.notes}
                          onChange={(e) => handleInputChange('notes', e.target.value)}
                          rows={4}
                          className="rounded-2xl resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: PAYMENT (condicional - só aparece se inscrição for paga) */}
                {activeTab === 'payment' && inscriptionIsPaid && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                    <InscriptionPaymentTab
                      inscriptionFee={inscriptionFee}
                      paymentMethod={formData.paymentMethod}
                      paymentStatus={formData.paymentStatus}
                      paymentReference={formData.paymentReference}
                      isMarkingPaid={isMarkingPaid}
                      onChangeField={(field, value) => handleInputChange(field, value)}
                      onMarkAsPaid={handleMarkAsPaid}
                      formatCurrency={formatCurrency}
                    />
                  </div>
                )}

                {/* TAB: CREDENTIALS */}
                {activeTab === 'credentials' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
                    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-[#004B87]/10 text-[#004B87] rounded-lg">
                          <Key className="h-5 w-5" />
                        </div>
                        <div>
                          <Label className="font-bold text-slate-700 leading-none">Credenciais de Acesso</Label>
                          <p className="text-xs text-slate-500 mt-1">Geradas automaticamente. Pode editar se necessário.</p>
                        </div>
                      </div>

                      {/* Student Number - RENOMEADO */}
                      <div className="space-y-2">
                        <Label className="text-slate-600 font-semibold ml-1 flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          Número de Estudante
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            value={formData.student_number}
                            onChange={(e) => handleInputChange('student_number', e.target.value)}
                            className="h-12 rounded-xl font-mono flex-1"
                            placeholder="EST20260001"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={regenerateStudentNumber}
                            className="h-12 px-4 rounded-xl"
                            title="Gerar novo número"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-slate-400 ml-1">
                          Este é o identificador único do estudante no sistema.
                        </p>
                      </div>

                      {/* Username */}
                      <div className="space-y-2">
                        <Label className="text-slate-600 font-semibold ml-1">
                          Username <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            value={formData.username}
                            onChange={(e) => handleInputChange('username', e.target.value)}
                            className={cn("h-12 rounded-xl font-mono flex-1", errors.username && "border-red-500 bg-red-50")}
                            placeholder="username"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={regenerateUsername}
                            className="h-12 px-4 rounded-xl"
                            title="Gerar novo username"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                        {errors.username && (
                          <p className="text-xs text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.username}
                          </p>
                        )}
                      </div>

                      {/* Password */}
                      <div className="space-y-2">
                        <Label className="text-slate-600 font-semibold ml-1">
                          Password <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={formData.password}
                              onChange={(e) => handleInputChange('password', e.target.value)}
                              className={cn("h-12 rounded-xl font-mono pr-12", errors.password && "border-red-500 bg-red-50")}
                              placeholder="password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={regeneratePassword}
                            className="h-12 px-4 rounded-xl"
                            title="Gerar nova password"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                        {errors.password && (
                          <p className="text-xs text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.password}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Resumo */}
                    <div className="bg-gradient-to-br from-[#004B87]/5 to-[#F5821F]/5 border-2 border-[#004B87]/20 rounded-2xl p-6">
                      <h3 className="text-sm font-bold text-[#004B87] mb-4 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[#F5821F]" />
                        Resumo da Inscrição
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Nome:</span>
                          <span className="text-sm font-semibold text-[#004B87]">{formData.name || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Email:</span>
                          <span className="text-sm font-semibold">{formData.email || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">BI:</span>
                          <span className="text-sm font-mono font-semibold">{formData.bi_number || '-'}</span>
                        </div>
                        <hr className="border-slate-200" />
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Nº Estudante:</span>
                          <span className="text-sm font-mono font-bold text-slate-700">{formData.student_number || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Username:</span>
                          <span className="text-sm font-mono font-bold text-[#004B87]">{formData.username || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Password:</span>
                          <span className="text-sm font-mono font-bold text-[#F5821F]">
                            {showPassword ? formData.password : '••••••••••'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* FOOTER */}
              <footer className="px-10 py-6 border-t border-slate-100 bg-white flex justify-between items-center">
                <Button variant="ghost" onClick={handleClose} className="text-slate-400 hover:text-slate-600 font-bold uppercase text-[11px] tracking-widest">
                  Cancelar
                </Button>

                <div className="flex gap-3">
                  {activeTab !== 'credentials' ? (
                    <Button
                      onClick={validateAndNext}
                      className="bg-[#004B87] text-white hover:bg-[#003A6B] px-8 h-12 rounded-xl flex gap-2 font-bold transition-all active:scale-95 shadow-lg shadow-blue-200"
                    >
                      Próximo Passo <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSave}
                      disabled={isSubmitting}
                      className="bg-[#F5821F] text-white hover:bg-[#E07318] px-10 h-12 rounded-xl flex gap-2 font-bold transition-all active:scale-95 shadow-xl shadow-orange-500/30 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Inscrevendo...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Inscrever Estudante
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </footer>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
