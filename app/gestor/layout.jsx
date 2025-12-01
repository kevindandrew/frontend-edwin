"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Monitor,
  Wrench,
  FileText,
  BarChart,
  LogOut,
  Menu,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Cookies from "js-cookie";
import NotificationsPopover from "@/components/admin/NotificationsPopover";

export default function GestorLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar autenticación y rol
    const token = Cookies.get("token");
    const userStr = Cookies.get("user");

    if (!token || !userStr) {
      router.push("/login");
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      if (userData.id_rol !== 3) {
        // Si no es Gestor (rol 3), redirigir según rol
        if (userData.id_rol === 2) router.push("/tecnico");
        else if (userData.id_rol === 4) router.push("/consulta");
        else if (userData.id_rol === 5) router.push("/compras");
        else router.push("/admin"); // Asumimos admin u otro
        return;
      }
      setUser(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    router.push("/login");
  };

  const menuItems = [
    {
      title: "Dashboard",
      href: "/gestor",
      icon: LayoutDashboard,
    },
    {
      title: "Equipos",
      href: "/gestor/equipos",
      icon: Monitor,
    },
    {
      title: "Mantenimiento",
      href: "/gestor/mantenimiento",
      icon: Wrench,
    },
    {
      title: "Datos Técnicos",
      href: "/gestor/datos-tecnicos",
      icon: FileText,
    },
    {
      title: "Reportes",
      href: "/gestor/reportes",
      icon: BarChart,
    },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 fixed inset-y-0 z-50">
        <SidebarContent
          pathname={pathname}
          handleLogout={handleLogout}
          menuItems={menuItems}
        />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent
            pathname={pathname}
            handleLogout={handleLogout}
            menuItems={menuItems}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-4 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h2 className="text-lg font-semibold">
              {menuItems.find((item) => item.href === pathname)?.title ||
                "Panel de Gestión"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <NotificationsPopover />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.username} />
                    <AvatarFallback>
                      {user?.username?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.nombre_completo}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({ pathname, handleLogout, menuItems }) {
  return (
    <div className="flex flex-col h-full bg-card border-r">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <Monitor className="w-6 h-6" />
          <span>Gestor Biomédico</span>
        </div>
      </div>
      <div className="flex-1 py-6 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  isActive ? "bg-secondary" : ""
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.title}
              </Button>
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
