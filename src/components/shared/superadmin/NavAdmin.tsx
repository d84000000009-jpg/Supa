import { Home, GraduationCap, Users, BookOpen, DollarSign, ChevronLeft, ChevronRight, Settings, LogOut, Shield } from 'lucide-react';
import { useState } from 'react';

// Componente de demonstração da Navbar Estilizada
export default function NavbarEstilizada() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('cursos');
  const displayName = "Admin ISAC";

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'students', label: 'Estudantes', icon: GraduationCap },
    { id: 'teachers', label: 'Docentes', icon: Users },
    { id: 'classes', label: 'Turmas', icon: BookOpen },
    { id: 'cursos', label: 'Cursos', icon: BookOpen },
    { id: 'payments', label: 'Pagamentos', icon: DollarSign },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* ========== SIDEBAR LATERAL ESTILIZADA ========== */}
      <aside
        className={`${
          isSidebarOpen ? 'w-72' : 'w-20'
        } bg-gradient-to-b from-[#004B87] via-[#003868] to-[#002850] text-white transition-all duration-300 ease-in-out flex flex-col shadow-2xl relative z-50`}
      >
        {/* Logo e Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
              <div className="relative group">
                {/* Efeito de brilho no logo */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#F5821F] to-[#FF9933] rounded-xl blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-lg p-1.5 group-hover:scale-105 transition-transform">
                  <img src="/image.png" alt="ISAC" className="h-full w-full object-contain" />
                </div>
              </div>
              {isSidebarOpen && (
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-[#F5821F] to-[#FF9933] bg-clip-text text-transparent">
                    ISAC
                  </h1>
                  <p className="text-xs text-slate-300">Portal Administrativo</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Profile - MELHORADO */}
        <div className="p-4 border-b border-white/10">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
            <div className="relative group">
              {/* Avatar com efeito hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F5821F] to-[#FF9933] rounded-full blur-sm opacity-0 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative h-11 w-11 bg-gradient-to-br from-[#F5821F] to-[#FF9933] rounded-full flex items-center justify-center font-bold text-white shadow-md flex-shrink-0 group-hover:scale-105 transition-transform">
                {displayName.charAt(0)}
              </div>
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{displayName}</p>
                <div className="flex items-center gap-1.5 text-xs">
                  <Shield className="h-3 w-3 text-[#F5821F]" />
                  <span className="text-slate-300">Super Admin</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Menu Navigation - MELHORADO */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full group relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#F5821F] to-[#FF9933] text-white shadow-lg shadow-orange-500/20 scale-[1.02]'
                      : 'text-slate-200 hover:bg-white/10 hover:translate-x-1'
                  } ${!isSidebarOpen && 'justify-center'}`}
                >
                  {/* Barra lateral de indicação do item ativo */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                  )}
                  
                  {/* Ícone com animação */}
                  <Icon className={`h-5 w-5 flex-shrink-0 transition-transform ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`} />
                  
                  {isSidebarOpen && (
                    <span className={`font-medium text-sm ${
                      isActive ? 'text-white' : 'text-slate-200'
                    }`}>
                      {item.label}
                    </span>
                  )}
                  
                  {/* Indicador de notificação (exemplo para alguns itens) */}
                  {!isSidebarOpen && item.id === 'payments' && (
                    <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-[#004B87] animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Bottom Actions - MELHORADO */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <button
            className={`w-full group flex items-center gap-3 px-4 py-3 rounded-xl text-slate-200 hover:bg-white/10 transition-all duration-200 hover:translate-x-1 ${
              !isSidebarOpen && 'justify-center'
            }`}
          >
            <Settings className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            {isSidebarOpen && <span className="text-sm font-medium">Configurações</span>}
          </button>
          
          <button
            className={`w-full group flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all duration-200 hover:translate-x-1 ${
              !isSidebarOpen && 'justify-center'
            }`}
          >
            <LogOut className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            {isSidebarOpen && <span className="text-sm font-medium">Sair</span>}
          </button>
        </div>

        {/* Toggle Button - MELHORADO */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-24 bg-gradient-to-r from-[#F5821F] to-[#FF9933] text-white rounded-full p-2 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:scale-110 transition-all duration-200 ring-2 ring-white/20 hover:ring-white/40"
        >
          {isSidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </aside>

      {/* Main Content (exemplo) */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              Navbar Estilizada
            </h2>
            <p className="text-slate-600 mb-6">
              Passe o mouse sobre os itens do menu para ver as animações e efeitos!
            </p>
            
            <div className="space-y-4 text-sm text-slate-700">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-1.5"></div>
                <div>
                  <strong>Gradiente suave:</strong> Sidebar com gradiente azul do ISAC (from-[#004B87] → to-[#002850])
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="h-2 w-2 bg-orange-500 rounded-full mt-1.5"></div>
                <div>
                  <strong>Item ativo destacado:</strong> Gradiente laranja com sombra e escala aumentada
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="h-2 w-2 bg-purple-500 rounded-full mt-1.5"></div>
                <div>
                  <strong>Efeitos hover:</strong> Ícones com rotação (Settings), translação (Logout), escala no avatar
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="h-2 w-2 bg-green-500 rounded-full mt-1.5"></div>
                <div>
                  <strong>Barra lateral de indicação:</strong> Linha branca no lado esquerdo do item ativo
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="h-2 w-2 bg-yellow-500 rounded-full mt-1.5"></div>
                <div>
                  <strong>Scrollbar customizada:</strong> Scrollbar fina e translúcida no menu
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}