"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Monitor,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import useEstadisticas from "@/hooks/useEstadisticas";
import useMantenimientos from "@/hooks/useMantenimientos";
import { Spinner } from "@/components/ui/spinner";

export default function GestorDashboard() {
  const { dashboard, loading: statsLoading, fetchAllStats } = useEstadisticas();
  const {
    mantenimientos,
    loading: mantLoading,
    fetchMantenimientos,
  } = useMantenimientos();
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchAllStats();
    fetchMantenimientos();
  }, []);

  useEffect(() => {
    if (mantenimientos) {
      // Filtrar últimas actividades (mantenimientos recientes)
      const sorted = [...mantenimientos]
        .sort(
          (a, b) => new Date(b.fecha_programada) - new Date(a.fecha_programada)
        )
        .slice(0, 5);
      setRecentActivity(sorted);
    }
  }, [mantenimientos]);

  if (statsLoading || mantLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  const stats = [
    {
      title: "Total Equipos",
      value: dashboard?.total_equipos || 0,
      icon: Monitor,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Mantenimientos Pendientes",
      value: dashboard?.mantenimientos_pendientes || 0,
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/20",
    },
    {
      title: "Equipos en Reparación",
      value: dashboard?.equipos_en_reparacion || 0,
      icon: Wrench,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Stock Bajo",
      value: dashboard?.repuestos_stock_bajo || 0,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-100 dark:bg-red-900/20",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Panel de Gestión Biomédica</h1>
        <p className="text-muted-foreground mt-2">
          Resumen general del estado de equipos y mantenimientos.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Actividad Reciente de Mantenimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((mant) => (
                  <div
                    key={mant.id_mantenimiento}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-full ${
                          mant.fecha_realizacion
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {mant.fecha_realizacion ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {mant.equipo?.nombre_equipo || "Equipo Desconocido"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {mant.tipo_mantenimiento} -{" "}
                          {new Date(mant.fecha_programada).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {mant.tecnico?.nombre_completo || "Sin asignar"}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          mant.prioridad === "Alta"
                            ? "bg-red-100 text-red-700"
                            : mant.prioridad === "Media"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {mant.prioridad || "Normal"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No hay actividad reciente.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
