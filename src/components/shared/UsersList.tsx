import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  Shield,
  User,
  GraduationCap,
  Calendar,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { Permission } from "@/types";

export interface SystemUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'teacher' | 'student';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
}

interface UsersListProps {
  users: SystemUser[];
  permissions: Permission;
  onViewUser?: (user: SystemUser) => void;
  onEditUser?: (user: SystemUser) => void;
  onDeleteUser?: (userId: number) => void;
}

export function UsersList({
  users,
  permissions,
  onViewUser,
  onEditUser,
  onDeleteUser
}: UsersListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "teacher" | "student">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    teachers: users.filter(u => u.role === 'teacher').length,
    students: users.filter(u => u.role === 'student').length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length
  };

  const getRoleInfo = (role: SystemUser['role']) => {
    const roleMap = {
      admin: {
        label: 'Administrador',
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: Shield,
        bgColor: 'bg-red-50'
      },
      teacher: {
        label: 'Docente',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: Users,
        bgColor: 'bg-blue-50'
      },
      student: {
        label: 'Estudante',
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: GraduationCap,
        bgColor: 'bg-green-50'
      }
    };
    return roleMap[role];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl p-8 border border-slate-200/60">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-[#004B87] mb-2 flex items-center gap-3">
              <Users className="h-8 w-8" />
              Gestão de Usuários
            </h2>
            <p className="text-sm text-[#004B87]/70">
              {stats.total} usuário{stats.total !== 1 ? 's' : ''} no sistema
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl p-4 border-2 border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-slate-600" />
              <span className="text-xs text-slate-600 font-medium">Total</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
          </div>

          <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-red-600" />
              <span className="text-xs text-red-700 font-medium">Admins</span>
            </div>
            <p className="text-2xl font-bold text-red-700">{stats.admins}</p>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-blue-700 font-medium">Docentes</span>
            </div>
            <p className="text-2xl font-bold text-blue-700">{stats.teachers}</p>
          </div>

          <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-700 font-medium">Estudantes</span>
            </div>
            <p className="text-2xl font-bold text-green-700">{stats.students}</p>
          </div>

          <div className="bg-emerald-50 rounded-xl p-4 border-2 border-emerald-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span className="text-xs text-emerald-700 font-medium">Ativos</span>
            </div>
            <p className="text-2xl font-bold text-emerald-700">{stats.active}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-4 w-4 text-gray-600" />
              <span className="text-xs text-gray-700 font-medium">Inativos</span>
            </div>
            <p className="text-2xl font-bold text-gray-700">{stats.inactive}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 border-2 border-slate-200 rounded-xl focus:border-[#F5821F] text-base"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as any)}
          className="px-4 h-12 border-2 border-slate-200 rounded-xl text-sm focus:border-[#F5821F] focus:outline-none focus:ring-2 focus:ring-[#F5821F]/20 min-w-[160px] bg-white"
        >
          <option value="all">Todos os Perfis</option>
          <option value="admin">🛡️ Administradores</option>
          <option value="teacher">👨‍🏫 Docentes</option>
          <option value="student">🎓 Estudantes</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 h-12 border-2 border-slate-200 rounded-xl text-sm focus:border-[#F5821F] focus:outline-none focus:ring-2 focus:ring-[#F5821F]/20 min-w-[160px] bg-white"
        >
          <option value="all">Todos os Status</option>
          <option value="active">✅ Ativos</option>
          <option value="inactive">❌ Inativos</option>
        </select>
      </div>

      {filteredUsers.length === 0 ? (
        <Card className="shadow-lg border-0">
          <CardContent className="pt-12 pb-12">
            <div className="flex flex-col items-center justify-center">
              <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Nenhum usuário encontrado</h3>
              <p className="text-sm text-slate-500 text-center">
                Tente ajustar os filtros de busca
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
          <div className="bg-gradient-to-r from-[#004B87] to-[#0066B3] text-white px-6 py-4">
            <div className="grid grid-cols-12 gap-4 items-center font-semibold text-sm">
              <div className="col-span-3">Usuário</div>
              <div className="col-span-2">Perfil</div>
              <div className="col-span-2">Contato</div>
              <div className="col-span-2">Cadastro</div>
              <div className="col-span-2">Último Acesso</div>
              <div className="col-span-1 text-right">Ações</div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredUsers.map((user) => {
              const roleInfo = getRoleInfo(user.role);
              const RoleIcon = roleInfo.icon;

              return (
                <div
                  key={user.id}
                  className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="col-span-3 flex items-center gap-3">
                    <div className={`h-12 w-12 bg-gradient-to-br from-[#004B87] to-[#0066B3] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                      user.status === 'inactive' ? 'opacity-50' : ''
                    }`}>
                      <span className="text-white font-bold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-slate-800 truncate flex items-center gap-2">
                        {user.name}
                        {user.status === 'inactive' && (
                          <Badge className="bg-gray-100 text-gray-600 border-0 text-[10px]">
                            Inativo
                          </Badge>
                        )}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <Badge className={`${roleInfo.color} border text-xs font-semibold`}>
                      <RoleIcon className="h-3 w-3 mr-1" />
                      {roleInfo.label}
                    </Badge>
                  </div>

                  <div className="col-span-2">
                    <div className="space-y-1">
                      {user.email && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <Mail className="h-3 w-3 text-slate-400" />
                          <span className="truncate">{user.email.split('@')[0]}</span>
                        </div>
                      )}
                      {user.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <Phone className="h-3 w-3 text-slate-400" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      <span>{formatDate(user.createdAt)}</span>
                    </div>
                  </div>

                  <div className="col-span-2">
                    {user.lastLogin ? (
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Clock className="h-3 w-3 text-green-500" />
                        <span>{formatDate(user.lastLogin)}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Nunca acessou</span>
                    )}
                  </div>

                  <div className="col-span-1 flex justify-end gap-2">
                    {permissions.canViewDetails && onViewUser && (
                      <Button
                        size="icon"
                        className="h-9 w-9 bg-gradient-to-r from-[#F5821F] to-[#FF9933] hover:from-[#E07318] hover:to-[#F58820] text-white rounded-lg shadow-md"
                        onClick={() => onViewUser(user)}
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}

                    {permissions.canEdit && onEditUser && (
                      <Button
                        size="icon"
                        className="h-9 w-9 bg-[#004B87] hover:bg-[#003868] text-white rounded-lg shadow-md"
                        onClick={() => onEditUser(user)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}

                    {permissions.canDelete && onDeleteUser && user.role !== 'admin' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-red-500 hover:bg-red-50 rounded-lg"
                        onClick={() => onDeleteUser(user.id)}
                        title="Remover"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filteredUsers.length > 0 && (
        <div className="flex justify-between items-center pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-600">
            Mostrando <span className="font-semibold">{filteredUsers.length}</span> de{" "}
            <span className="font-semibold">{users.length}</span> usuários
          </p>
          {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setRoleFilter("all");
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
  );
}
