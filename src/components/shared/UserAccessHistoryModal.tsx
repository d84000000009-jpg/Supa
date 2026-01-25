import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Clock,
  MapPin,
  Monitor,
  Smartphone,
  Tablet,
  Chrome,
  CheckCircle,
  XCircle,
  Search,
  Calendar,
  Activity
} from "lucide-react";
import { SystemUser } from "./UsersList";

interface AccessLog {
  id: number;
  date: string;
  time: string;
  ip: string;
  location: string;
  device: string;
  browser: string;
  status: "success" | "failed";
  action: string;
}

interface UserAccessHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: SystemUser | null;
}

const MOCK_ACCESS_LOGS: AccessLog[] = [
  {
    id: 1,
    date: "2025-01-25",
    time: "14:30:15",
    ip: "197.234.221.123",
    location: "Maputo, Moçambique",
    device: "Desktop",
    browser: "Chrome 120",
    status: "success",
    action: "Login"
  },
  {
    id: 2,
    date: "2025-01-25",
    time: "09:15:42",
    ip: "197.234.221.123",
    location: "Maputo, Moçambique",
    device: "Mobile",
    browser: "Safari iOS",
    status: "success",
    action: "Login"
  },
  {
    id: 3,
    date: "2025-01-24",
    time: "16:45:30",
    ip: "197.234.221.123",
    location: "Maputo, Moçambique",
    device: "Desktop",
    browser: "Chrome 120",
    status: "success",
    action: "Logout"
  },
  {
    id: 4,
    date: "2025-01-24",
    time: "08:20:18",
    ip: "197.234.221.123",
    location: "Maputo, Moçambique",
    device: "Desktop",
    browser: "Chrome 120",
    status: "success",
    action: "Login"
  },
  {
    id: 5,
    date: "2025-01-23",
    time: "23:15:05",
    ip: "41.220.12.89",
    location: "Beira, Moçambique",
    device: "Tablet",
    browser: "Firefox 121",
    status: "failed",
    action: "Tentativa de Login"
  },
  {
    id: 6,
    date: "2025-01-23",
    time: "15:30:22",
    ip: "197.234.221.123",
    location: "Maputo, Moçambique",
    device: "Desktop",
    browser: "Chrome 120",
    status: "success",
    action: "Login"
  },
  {
    id: 7,
    date: "2025-01-22",
    time: "11:10:45",
    ip: "197.234.221.123",
    location: "Maputo, Moçambique",
    device: "Mobile",
    browser: "Chrome Android",
    status: "success",
    action: "Login"
  },
  {
    id: 8,
    date: "2025-01-21",
    time: "14:55:30",
    ip: "197.234.221.123",
    location: "Maputo, Moçambique",
    device: "Desktop",
    browser: "Chrome 120",
    status: "success",
    action: "Login"
  }
];

export function UserAccessHistoryModal({
  isOpen,
  onClose,
  user
}: UserAccessHistoryModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "failed">("all");

  if (!user) return null;

  const filteredLogs = MOCK_ACCESS_LOGS.filter(log => {
    const matchesSearch = log.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.ip.includes(searchTerm) ||
                         log.device.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || log.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes("mobile")) return Smartphone;
    if (device.toLowerCase().includes("tablet")) return Tablet;
    return Monitor;
  };

  const stats = {
    totalAccess: MOCK_ACCESS_LOGS.length,
    successful: MOCK_ACCESS_LOGS.filter(l => l.status === "success").length,
    failed: MOCK_ACCESS_LOGS.filter(l => l.status === "failed").length,
    uniqueLocations: new Set(MOCK_ACCESS_LOGS.map(l => l.location)).size
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#004B87] flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Histórico de Acessos - {user.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 flex-1 overflow-y-auto py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-blue-700 font-medium">Total de Acessos</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">{stats.totalAccess}</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-xs text-green-700 font-medium">Bem-sucedidos</span>
              </div>
              <p className="text-2xl font-bold text-green-700">{stats.successful}</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border-2 border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-xs text-red-700 font-medium">Falhados</span>
              </div>
              <p className="text-2xl font-bold text-red-700">{stats.failed}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-purple-700 font-medium">Localizações</span>
              </div>
              <p className="text-2xl font-bold text-purple-700">{stats.uniqueLocations}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Buscar por localização, IP ou dispositivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-11 border-2"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 h-11 border-2 border-slate-200 rounded-lg focus:border-[#F5821F] focus:outline-none min-w-[180px] bg-white"
            >
              <option value="all">Todos os Status</option>
              <option value="success">✅ Bem-sucedidos</option>
              <option value="failed">❌ Falhados</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">Nenhum registro encontrado</p>
              </div>
            ) : (
              filteredLogs.map((log) => {
                const DeviceIcon = getDeviceIcon(log.device);

                return (
                  <div
                    key={log.id}
                    className="bg-white rounded-xl p-4 border-2 border-slate-200 hover:border-[#F5821F] transition-all hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          log.status === "success"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}>
                          {log.status === "success" ? (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          ) : (
                            <XCircle className="h-6 w-6 text-red-600" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-slate-800">{log.action}</h3>
                            <Badge
                              className={
                                log.status === "success"
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : "bg-red-100 text-red-700 border-red-200"
                              }
                            >
                              {log.status === "success" ? "Sucesso" : "Falhou"}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-slate-600">
                              <Calendar className="h-4 w-4 text-slate-400" />
                              <span>{new Date(log.date).toLocaleDateString("pt-PT")}</span>
                            </div>

                            <div className="flex items-center gap-2 text-slate-600">
                              <Clock className="h-4 w-4 text-slate-400" />
                              <span>{log.time}</span>
                            </div>

                            <div className="flex items-center gap-2 text-slate-600">
                              <MapPin className="h-4 w-4 text-slate-400" />
                              <span className="truncate">{log.location}</span>
                            </div>

                            <div className="flex items-center gap-2 text-slate-600">
                              <DeviceIcon className="h-4 w-4 text-slate-400" />
                              <span>{log.device}</span>
                            </div>
                          </div>

                          <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Chrome className="h-3 w-3" />
                              {log.browser}
                            </span>
                            <span className="font-mono">{log.ip}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {filteredLogs.length > 0 && (
            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                Mostrando <span className="font-semibold">{filteredLogs.length}</span> de{" "}
                <span className="font-semibold">{MOCK_ACCESS_LOGS.length}</span> registros
              </p>
              {(searchTerm || statusFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                  className="text-[#F5821F] hover:text-[#004B87]"
                >
                  Limpar Filtros
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-200">
          <Button variant="ghost" onClick={onClose} className="w-full">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
