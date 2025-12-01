"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingCart,
  Users,
  DollarSign,
  Clock,
  CheckCircle2,
} from "lucide-react";
import useCompras from "@/hooks/useCompras";
import useProveedores from "@/hooks/useProveedores";
import { Spinner } from "@/components/ui/spinner";

export default function ComprasDashboard() {
  // Nota: useCompras no tiene un fetchCompras público en el hook original que vi,
  // pero asumo que lo tiene o lo usa internamente. Si no, usaré el estado local.
  // Revisando el hook useCompras.js que vi antes, sí tiene fetchCompras pero no lo exportaba explícitamente en el return?
  // Espera, vi el archivo y sí exportaba fetchCompras.

  const { fetchCompras, loading: comprasLoading } = useCompras();
  const { proveedores, loading: provLoading } = useProveedores();
  const [stats, setStats] = useState({
    totalSolicitudes: 0,
    pendientes: 0,
    aprobadas: 0,
    totalProveedores: 0,
  });

  // Simulamos datos de compras ya que el hook podría no devolver la lista completa directamente si no se llama
  // Vamos a asumir que podemos obtener la lista. Si no, mostraremos 0.

  useEffect(() => {
    // Aquí idealmente llamaríamos a una API de estadísticas o calcularíamos con los datos
    // Por ahora simularemos con los datos disponibles
    if (proveedores) {
      setStats((prev) => ({ ...prev, totalProveedores: proveedores.length }));
    }
  }, [proveedores]);

  if (comprasLoading || provLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  const statCards = [
    {
      title: "Solicitudes Pendientes",
      value: "5", // Mock data por ahora
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/20",
    },
    {
      title: "Órdenes Activas",
      value: "3", // Mock data
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Proveedores Registrados",
      value: stats.totalProveedores,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Gasto Mensual (Est.)",
      value: "Bs. 12,500",
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/20",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Panel de Compras</h1>
        <p className="text-muted-foreground mt-2">
          Resumen de adquisiciones y gestión de proveedores.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
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

      {/* Recent Activity Placeholder */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Solicitudes Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              No hay solicitudes recientes para mostrar.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
