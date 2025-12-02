"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Users, DollarSign, Clock } from "lucide-react";
import useCompras from "@/hooks/useCompras";
import useCatalogos from "@/hooks/useCatalogos";
import { Spinner } from "@/components/ui/spinner";

export default function ComprasDashboard() {
  const { compras, loading: comprasLoading, fetchCompras } = useCompras();
  const { fabricantes, loading: fabLoading } = useCatalogos();
  const [stats, setStats] = useState({
    pendientes: 0,
    activas: 0,
    totalFabricantes: 0,
    gastoMensual: 0,
  });

  useEffect(() => {
    fetchCompras();
  }, []);

  useEffect(() => {
    if (compras && fabricantes) {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const pendientes = compras.filter(
        (c) =>
          c.estado_compra === "Solicitada" || c.estado_compra === "Pendiente"
      ).length;

      const activas = compras.filter(
        (c) => c.estado_compra === "Aprobada"
      ).length;

      const gastoMensual = compras
        .filter((c) => {
          const fecha = new Date(c.fecha_solicitud);
          return (
            fecha.getMonth() === currentMonth &&
            fecha.getFullYear() === currentYear &&
            c.estado_compra !== "Cancelada"
          );
        })
        .reduce((acc, curr) => acc + parseFloat(curr.monto_total || 0), 0);

      setStats({
        pendientes,
        activas,
        totalFabricantes: fabricantes.length,
        gastoMensual,
      });
    }
  }, [compras, fabricantes]);

  if (comprasLoading || fabLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  const statCards = [
    {
      title: "Solicitudes Pendientes",
      value: stats.pendientes,
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/20",
    },
    {
      title: "Órdenes Aprobadas",
      value: stats.activas,
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Fabricantes Registrados",
      value: stats.totalFabricantes,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Gasto Mensual (Est.)",
      value: `Bs. ${stats.gastoMensual.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
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

      {/* Recent Activity Placeholder - Could be replaced with actual recent purchases list */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Solicitudes Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {compras.length > 0 ? (
              <div className="space-y-4">
                {compras.slice(0, 5).map((compra) => (
                  <div
                    key={compra.id_compra}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium">
                        Solicitud #{compra.id_compra}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {compra.fecha_solicitud}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        Bs. {parseFloat(compra.monto_total).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {compra.estado_compra}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No hay solicitudes recientes para mostrar.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
