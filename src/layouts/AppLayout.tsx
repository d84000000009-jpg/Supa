import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/shared/reusable/Navbar";
import { useAuthStore } from "@/store/authStore";

export function AppLayout() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar
        displayName={user?.name || "Usuário"}
        role={user?.profile}
        onLogout={logout}
      />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
