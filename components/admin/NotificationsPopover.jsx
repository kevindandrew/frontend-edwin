"use client";

import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, Calendar, Package } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import useMantenimientos from "@/hooks/useMantenimientos";
import useEstadisticas from "@/hooks/useEstadisticas";

export default function NotificationsPopover() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { mantenimientos, fetchMantenimientos } = useMantenimientos();
  const { dashboard, fetchAllStats } = useEstadisticas();

  useEffect(() => {
    fetchMantenimientos();
    fetchAllStats();
  }, []);

  useEffect(() => {
    const newNotifications = [];
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // 1. Alertas de Mantenimiento
    if (mantenimientos) {
      mantenimientos.forEach((m) => {
        if (!m.fecha_realizacion) {
          const fechaProgramada = new Date(m.fecha_programada);
          fechaProgramada.setHours(0, 0, 0, 0);

          if (fechaProgramada < hoy) {
            newNotifications.push({
              id: `mant-overdue-${m.id_mantenimiento}`,
              type: "error",
              title: "Mantenimiento Vencido",
              message: `El mantenimiento para ${m.equipo?.nombre_equipo} estaba programado para ${m.fecha_programada}.`,
              date: fechaProgramada,
              icon: AlertTriangle,
            });
          } else if (fechaProgramada.getTime() === hoy.getTime()) {
            newNotifications.push({
              id: `mant-today-${m.id_mantenimiento}`,
              type: "warning",
              title: "Mantenimiento para Hoy",
              message: `Hoy toca mantenimiento para ${m.equipo?.nombre_equipo}.`,
              date: fechaProgramada,
              icon: Calendar,
            });
          }
        }
      });
    }

    // 2. Alertas de Stock Bajo
    if (dashboard?.repuestos_stock_bajo > 0) {
      newNotifications.push({
        id: "stock-low",
        type: "warning",
        title: "Stock Bajo Detectado",
        message: `Hay ${dashboard.repuestos_stock_bajo} repuestos con stock bajo. Revisa el inventario.`,
        date: new Date(),
        icon: Package,
      });
    }

    // Ordenar por fecha (más recientes primero)
    newNotifications.sort((a, b) => b.date - a.date);
    setNotifications(newNotifications);
  }, [mantenimientos, dashboard]);

  const unreadCount = notifications.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-background" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h4 className="font-semibold">Notificaciones</h4>
          <span className="text-xs text-muted-foreground">
            {unreadCount} nuevas
          </span>
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <div className="grid gap-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 px-4 py-3 hover:bg-muted/50 ${
                    notification.type === "error"
                      ? "bg-red-50 dark:bg-red-900/10"
                      : ""
                  }`}
                >
                  <div
                    className={`mt-1 rounded-full p-1 ${
                      notification.type === "error"
                        ? "text-red-600 bg-red-100 dark:bg-red-900/20"
                        : "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
                    }`}
                  >
                    <notification.icon className="h-4 w-4" />
                  </div>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {notification.date.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No tienes notificaciones nuevas
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
