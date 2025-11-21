"use client";

import { TrendingUp, Package, DollarSign, ArrowDownRight } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { StatCard } from "@/components/dashboard/StatCard";
import { VentasComprasChart } from "@/components/dashboard/VentasComprasChart";
import { EquiposCategoriaChart } from "@/components/dashboard/EquiposCategoriaChart";
import { ActividadReciente } from "@/components/dashboard/ActividadReciente";
import { AuthErrorMessage } from "@/components/dashboard/AuthErrorMessage";

export default function AdminHome() {
  const {
    loading,
    authError,
    dashboardData,
    ventasMesActual,
    chartData,
    equiposPorCategoria,
    actividadReciente,
    formatearFecha,
    getOperacionTexto,
  } = useDashboardData();

  // Si hay error de autenticación, mostrar mensaje
  if (authError) {
    return <AuthErrorMessage />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Bienvenido al Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Aquí puedes ver un resumen de tu negocio
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          title={`Ventas ${ventasMesActual.mes}`}
          value={`Bs. ${ventasMesActual.total.toFixed(2)}`}
          subtitle={`${ventasMesActual.cantidad} ventas realizadas`}
          change={`${ventasMesActual.porcentaje} desde el mes pasado`}
          loading={loading}
        />
        <StatCard
          icon={Package}
          title="Total de Equipos"
          value={dashboardData?.total_equipos || 0}
          change={`${
            dashboardData?.equipos_por_estado?.find(
              (e) => e.estado === "Disponible"
            )?.total || 0
          } disponibles`}
          loading={loading}
        />
        <StatCard
          icon={TrendingUp}
          title="Ingresos del Mes"
          value={`Bs. ${dashboardData?.ingresos_mes?.toFixed(2) || "0.00"}`}
          loading={loading}
        />
        <StatCard
          icon={ArrowDownRight}
          title="Egresos del Mes"
          value={`Bs. ${dashboardData?.egresos_mes?.toFixed(2) || "0.00"}`}
          loading={loading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <VentasComprasChart data={chartData} year={new Date().getFullYear()} />
        <EquiposCategoriaChart data={equiposPorCategoria} />
      </div>

      {/* Recent Activity */}
      <ActividadReciente
        actividades={actividadReciente}
        loading={loading}
        formatearFecha={formatearFecha}
        getOperacionTexto={getOperacionTexto}
      />
    </div>
  );
}
