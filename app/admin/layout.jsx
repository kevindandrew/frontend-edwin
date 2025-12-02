"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  User,
  Users,
  Package,
  Wrench,
  ShoppingCart,
  TrendingUp,
  Menu,
  X,
  LogOut,
  UserCog,
  Box,
  FileText,
  FileSearch,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import Cookies from "js-cookie";
import NotificationsPopover from "@/components/admin/NotificationsPopover";
import { Suspense } from "react";
import Loading from "./loading";

const menuItems = [
  { name: "Inicio", href: "/admin", icon: Home },
  { name: "Mi Cuenta", href: "/admin/mi-cuenta", icon: User },
  { name: "Usuarios", href: "/admin/usuarios", icon: UserCog },
  { name: "Clientes", href: "/admin/clientes", icon: Users },
  { name: "Inventario", href: "/admin/inventario", icon: Package },
  { name: "Repuestos", href: "/admin/repuestos", icon: Box },
  { name: "Mantenimiento", href: "/admin/mantenimiento", icon: Wrench },
  { name: "Compras", href: "/admin/compras", icon: ShoppingCart },
  { name: "Fabricantes", href: "/admin/fabricantes", icon: Building2 },
  { name: "Ventas", href: "/admin/ventas", icon: TrendingUp },
  { name: "Reportes", href: "/admin/reportes", icon: FileText },
  { name: "Auditoría", href: "/admin/auditoria", icon: FileSearch },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    const userStr = Cookies.get("user");

    if (!token) {
      router.push("/login");
      return;
    }

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // Si es técnico (rol 2), redirigir a su panel
        if (user.id_rol === 2) {
          router.push("/tecnico");
        }
        // Si es gestor (rol 3), redirigir a su panel
        if (user.id_rol === 3) {
          router.push("/gestor");
        }
        // Si es consulta (rol 4), redirigir a su panel
        if (user.id_rol === 4) {
          router.push("/consulta");
        }
        // Si es compras (rol 5), redirigir a su panel
        if (user.id_rol === 5) {
          router.push("/compras");
        }
        // Aquí se podrían agregar más validaciones para otros roles
      } catch (e) {
        console.error("Error parsing user cookie", e);
      }
    }
  }, [router]);

  const isActive = (href) => {
    if (href === "/admin" && pathname === "/admin") return true;
    if (href !== "/admin" && pathname.startsWith(href)) return true;
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    Cookies.remove("token", { path: "/" });
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 bg-sidebar border-r border-sidebar-border fixed h-screen z-40 overflow-hidden`}
      >
        <div
          className={`flex flex-col h-full w-64 ${
            !sidebarOpen && "opacity-0"
          } transition-opacity duration-300`}
        >
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <h1 className="text-2xl font-bold text-sidebar-primary">Admin</h1>
            <p className="text-xs text-sidebar-foreground/60 mt-1">
              Sistema de Gestión
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link key={item.href} href={item.href}>
                    <button
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        active
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </button>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`${
          sidebarOpen ? "ml-64" : "ml-0"
        } flex-1 flex flex-col transition-all duration-300`}
      >
        {/* Top Bar */}
        <header className="bg-card border-b border-border p-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-foreground"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
            <div className="text-foreground font-semibold">
              Dashboard de Administración
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NotificationsPopover />
            <ThemeToggle />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6 bg-background">
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}
