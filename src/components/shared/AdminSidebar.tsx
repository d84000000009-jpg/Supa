// src/components/shared/AdminSidebar.tsx
import { useState, useRef, useEffect } from "react";
import {
  Users,
  BookOpen,
  DollarSign,
  Settings,
  GraduationCap,
  Shield,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Home,
  FileText,
  LucideIcon,
  Bell,
  ClipboardList,
  ChevronDown,
  PenLine,
} from "lucide-react";

export type AdminView =
  | "dashboard"
  | "students"
  | "teachers"
  | "classes"
  | "courses"
  | "payments"
  | "registrations"
  | "inscriptions"
  | "users"
  | "grades";

export interface MenuItem {
  id: AdminView;
  label: string;
  icon: LucideIcon;
  badge?: number;
  hasDropdown?: boolean;
  dropdownItems?: {
    id: AdminView;
    label: string;
    icon: LucideIcon;
  }[];
}

interface AdminSidebarProps {
  activeView: AdminView;
  setActiveView: (view: AdminView) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  onOpenSettings: () => void;
}

export const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "students", label: "Estudantes", icon: GraduationCap },
  {
    id: "registrations",
    label: "Matrículas",
    icon: ClipboardList,
    badge: 5,
    hasDropdown: true,
    dropdownItems: [
      { id: "inscriptions", label: "Inscrição", icon: PenLine },
      { id: "registrations", label: "Matrícula", icon: FileText },
    ],
  },
  { id: "teachers", label: "Docentes", icon: Users },
  { id: "classes", label: "Turmas", icon: BookOpen },
  { id: "courses", label: "Cursos", icon: BookOpen },
  { id: "payments", label: "Pagamentos", icon: DollarSign, badge: 12 },
  { id: "users", label: "Usuários", icon: Shield },
  { id: "grades", label: "Notas", icon: BarChart3 },
];

export function AdminSidebar({
  activeView,
  setActiveView,
  isSidebarOpen,
  setIsSidebarOpen,
  onOpenSettings,
}: AdminSidebarProps) {
  const [openDropdown, setOpenDropdown] = useState<AdminView | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDropdownActive = (item: MenuItem) => {
    if (!item.dropdownItems) return false;
    return item.dropdownItems.some((sub) => sub.id === activeView);
  };

  useEffect(() => {
    const activeItem = menuItems.find(
      (item) => item.hasDropdown && isDropdownActive(item)
    );
    if (activeItem) {
      setOpenDropdown(activeItem.id);
    }
  }, [activeView]);

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.7; }
        }

        .sidebar-bg {
          background: linear-gradient(180deg, #004B87 0%, #002648 100%);
        }
        .menu-item {
          position: relative;
          transition: all 0.2s ease;
        }
        .menu-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(4px);
        }
        .menu-item.active {
          background: linear-gradient(90deg, #F5821F 0%, #FF9933 100%);
          box-shadow: 0 4px 12px rgba(245, 130, 31, 0.3);
        }
        .menu-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 60%;
          background: white;
          border-radius: 0 4px 4px 0;
        }
        .badge {
          animation: pulse 2s ease-in-out infinite;
        }
        .dropdown-menu {
          animation: slideDown 0.2s ease-out;
        }
        .sub-item {
          transition: all 0.15s ease;
        }
        .sub-item:hover {
          background: rgba(255, 255, 255, 0.08);
          padding-left: 1rem;
        }
        .sub-item.active {
          background: rgba(245, 130, 31, 0.2);
          border-left: 3px solid #F5821F;
        }
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        }
        .footer-btn {
          transition: all 0.2s ease;
        }
        .footer-btn:hover {
          background: rgba(255, 255, 255, 0.12);
        }
        .toggle-btn {
          transition: all 0.2s ease;
        }
        .toggle-btn:hover {
          transform: scale(1.1);
        }
      `}</style>

      <aside
        className={`${
          isSidebarOpen ? "w-72" : "w-20"
        } sidebar-bg transition-all duration-300 flex flex-col relative shadow-xl`}
      >
        {/* HEADER - Logo */}
        <div className="px-6 pt-7 pb-6">
          <div className={`flex items-center ${!isSidebarOpen ? "justify-center" : "gap-4"}`}>
            <div className="relative">
              <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-lg p-2">
                <img
                  src="/image.png"
                  alt="ISAC"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-[#002648]"></div>
            </div>

            {isSidebarOpen && (
              <div className="flex-1">
                <h1 className="text-xl font-bold text-white">ISAC Admin</h1>
                <p className="text-xs text-slate-300">Sistema de Gestão</p>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 mb-4">
          <div className="divider"></div>
        </div>

        {/* MENU */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            const hasDropdown = item.hasDropdown && item.dropdownItems;
            const isDropActive = isDropdownActive(item);
            const isThisOpen = openDropdown === item.id;

            if (hasDropdown) {
              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => setOpenDropdown(isThisOpen ? null : item.id)}
                    className={`
                      menu-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white
                      ${(isDropActive || isThisOpen) && "active"}
                      ${!isSidebarOpen && "justify-center"}
                    `}
                  >
                    <div className="relative">
                      <Icon className="h-5 w-5" />
                      {item.badge && !isSidebarOpen && (
                        <span className="badge absolute -top-2 -right-2 h-5 w-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-[#002648]">
                          {item.badge > 9 ? "9+" : item.badge}
                        </span>
                      )}
                    </div>

                    {isSidebarOpen && (
                      <>
                        <span className="flex-1 text-left font-medium">{item.label}</span>
                        {item.badge && (
                          <span className="badge px-2 py-0.5 bg-red-500 rounded-full text-xs font-bold">
                            {item.badge}
                          </span>
                        )}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${isThisOpen ? "rotate-180" : ""}`}
                        />
                      </>
                    )}
                  </button>

                  {isThisOpen && isSidebarOpen && (
                    <div className="dropdown-menu ml-4 space-y-0.5">
                      {item.dropdownItems!.map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive = activeView === sub.id;

                        return (
                          <button
                            key={sub.id}
                            onClick={() => setActiveView(sub.id)}
                            className={`
                              sub-item w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-200
                              ${isSubActive && "active text-white"}
                            `}
                          >
                            <SubIcon className="h-4 w-4" />
                            <span className="text-sm font-medium">{sub.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {isThisOpen && !isSidebarOpen && (
                    <div className="absolute left-full top-0 ml-3 w-52 bg-[#003d72] rounded-xl shadow-2xl overflow-hidden z-50 border border-white/10">
                      <div className="p-2">
                        {item.dropdownItems!.map((sub) => {
                          const SubIcon = sub.icon;
                          const isSubActive = activeView === sub.id;

                          return (
                            <button
                              key={sub.id}
                              onClick={() => setActiveView(sub.id)}
                              className={`
                                sub-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 mb-1
                                ${isSubActive && "active text-white"}
                              `}
                            >
                              <SubIcon className="h-4 w-4" />
                              <span className="text-sm font-medium">{sub.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`
                  menu-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white
                  ${isActive && "active"}
                  ${!isSidebarOpen && "justify-center"}
                `}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.badge && !isSidebarOpen && (
                    <span className="badge absolute -top-2 -right-2 h-5 w-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-[#002648]">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </div>

                {isSidebarOpen && (
                  <>
                    <span className="flex-1 text-left font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="badge px-2 py-0.5 bg-red-500 rounded-full text-xs font-bold">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        <div className="px-6 mb-4">
          <div className="divider"></div>
        </div>

        {/* FOOTER - Configurações à esquerda + versão à direita */}
        <div className="px-4 pb-5">
          <div className="flex items-center justify-between">
            {/* Botão Configurações (só ícone) */}
            <button
              onClick={onOpenSettings}
              className="footer-btn p-3 rounded-xl text-slate-200 hover:bg-white/10 transition-colors"
              title="Configurações"
            >
              <Settings className="h-5 w-5" />
            </button>

            {/* Área da versão (só aparece quando sidebar aberta) */}
            {isSidebarOpen && (
              <div className="bg-white/10 px-4 py-3 rounded-xl backdrop-blur-sm text-right">
                <div className="flex items-center justify-end gap-2 mb-1">
                  <p className="text-xs font-bold text-white">Sistema ISAC</p>
                  <span className="px-2 py-0.5 bg-green-500 text-white text-[9px] font-bold rounded-full">
                    ONLINE
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">v1.0.0 • 2025</p>
              </div>
            )}
          </div>
        </div>

        {/* Botão toggle lateral */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="toggle-btn absolute -right-4 top-32 bg-gradient-to-r from-[#F5821F] to-[#FF9933] text-white rounded-full p-2.5 shadow-lg border-3 border-[#002648]"
        >
          {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </aside>
    </>
  );
}

export default AdminSidebar;