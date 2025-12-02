"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import useCompras from "@/hooks/useCompras";
import useEstadisticas from "@/hooks/useEstadisticas";
import { Spinner } from "@/components/ui/spinner";

export default function PresupuestoPage() {
  const { compras, loading: comprasLoading, fetchCompras } = useCompras();
  const { comprasPorMes, fetchComprasPorMes } = useEstadisticas();

  // Presupuesto anual fijo por ahora (podría venir de una configuración)
  const PRESUPUESTO_ANUAL = 200000;

  const [gastadoActual, setGastadoActual] = useState(0);

  useEffect(() => {
    fetchCompras();
    fetchComprasPorMes(new Date().getFullYear());
  }, []);

  useEffect(() => {
    if (compras) {
      const currentYear = new Date().getFullYear();
      const totalGastado = compras
        .filter((c) => {
          const fecha = new Date(c.fecha_solicitud);
          return (
            fecha.getFullYear() === currentYear &&
            c.estado_compra !== "Cancelada"
          );
        })
        .reduce((acc, curr) => acc + parseFloat(curr.monto_total || 0), 0);

      setGastadoActual(totalGastado);
    }
  }, [compras]);

  const porcentajeGastado = Math.min(
    (gastadoActual / PRESUPUESTO_ANUAL) * 100,
    100
  );

  if (comprasLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Control Presupuestario</h1>
        <p className="text-muted-foreground mt-2">
          Monitoreo de ejecución presupuestaria y gastos.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Presupuesto Anual (Est.)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Bs. {PRESUPUESTO_ANUAL.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Gestión {new Date().getFullYear()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ejecutado</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                porcentajeGastado > 90 ? "text-red-600" : "text-green-600"
              }`}
            >
              Bs.{" "}
              {gastadoActual.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </div>
            <div className="mt-2">
              <Progress value={porcentajeGastado} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {porcentajeGastado.toFixed(1)}% del total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponible</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Bs.{" "}
              {(PRESUPUESTO_ANUAL - gastadoActual).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Restante para la gestión
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ejecución Mensual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {comprasPorMes && comprasPorMes.length > 0 ? (
              comprasPorMes.map((mesData) => (
                <div key={mesData.mes} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Mes {mesData.mes}</span>
                    <span className="font-medium">
                      Bs. {mesData.total_compras.toFixed(2)}
                    </span>
                  </div>
                  <Progress
                    value={
                      (mesData.total_compras / (PRESUPUESTO_ANUAL / 12)) * 100
                    }
                    className="h-2"
                  />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No hay datos de ejecución mensual.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
