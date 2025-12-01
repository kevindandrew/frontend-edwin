"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import useMantenimientos from "@/hooks/useMantenimientos";
import Cookies from "js-cookie";
import { Spinner } from "@/components/ui/spinner";

export default function TecnicoDashboard() {
  const { fetchMantenimientos, mantenimientos, loading } = useMantenimientos();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    pendientes: 0,
    enProceso: 0,
    completados: 0,
    total: 0,
  });

  useEffect(() => {
    const userStr = Cookies.get("user");
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      fetchMantenimientos();
    }
  }, []);

  useEffect(() => {
    if (mantenimientos.length > 0 && user) {
      // Filtrar mantenimientos asignados al técnico actual
      // Asumimos que el mantenimiento tiene un campo 'id_tecnico' o 'tecnico_asignado'
      // Si no, filtraremos por ahora todos (para demo) o ajustaremos según la API real
      const misMantenimientos = mantenimientos.filter(
        (m) => m.id_tecnico === user.id_usuario || !m.id_tecnico // Fallback: mostrar todos si no hay id_tecnico (para desarrollo)
      );

      setStats({
        pendientes: misMantenimientos.filter((m) => m.estado === "Pendiente")
          .length,
        enProceso: misMantenimientos.filter((m) => m.estado === "En Proceso")
          .length,
        completados: misMantenimientos.filter((m) => m.estado === "Completado")
          .length,
        total: misMantenimientos.length,
      });
    }
  }, [mantenimientos, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Hola, {user?.nombre_completo?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Bienvenido a tu panel de control técnico. Aquí tienes un resumen de
          tus actividades.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Asignados
            </CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Mantenimientos totales
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendientes}</div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
            <Wrench className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.enProceso}</div>
            <p className="text-xs text-muted-foreground">
              Trabajando actualmente
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completados}</div>
            <p className="text-xs text-muted-foreground">
              Finalizados este mes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Próximos Mantenimientos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {mantenimientos
                .filter(
                  (m) =>
                    (m.id_tecnico === user?.id_usuario || !m.id_tecnico) &&
                    m.estado !== "Completado"
                )
                .slice(0, 5)
                .map((mantenimiento) => (
                  <div
                    key={mantenimiento.id_mantenimiento}
                    className="flex items-center"
                  >
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {mantenimiento.equipo?.nombre_equipo ||
                          "Equipo Desconocido"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {mantenimiento.tipo_mantenimiento} -{" "}
                        {new Date(
                          mantenimiento.fecha_programada
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          mantenimiento.prioridad === "Alta"
                            ? "bg-red-100 text-red-800"
                            : mantenimiento.prioridad === "Media"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {mantenimiento.prioridad || "Normal"}
                      </span>
                    </div>
                  </div>
                ))}
              {mantenimientos.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No hay mantenimientos próximos.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Placeholder for recent activity */}
              <p className="text-sm text-muted-foreground">
                El registro de actividad se implementará próximamente.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
