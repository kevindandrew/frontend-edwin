"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, AlertCircle } from "lucide-react";

export default function PresupuestoPage() {
  // Mock data for budget visualization
  const presupuestoAnual = 150000;
  const gastadoActual = 45000;
  const porcentajeGastado = (gastadoActual / presupuestoAnual) * 100;

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
              Presupuesto Anual
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Bs. {presupuestoAnual.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Gestión 2024</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ejecutado</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Bs. {gastadoActual.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
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
              Bs. {(presupuestoAnual - gastadoActual).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Restante para la gestión
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ejecución por Categoría</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Repuestos y Accesorios</span>
              <span className="font-medium">Bs. 25,000 / Bs. 80,000</span>
            </div>
            <Progress value={31} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Equipos Nuevos</span>
              <span className="font-medium">Bs. 15,000 / Bs. 50,000</span>
            </div>
            <Progress value={30} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Servicios Externos</span>
              <span className="font-medium">Bs. 5,000 / Bs. 20,000</span>
            </div>
            <Progress value={25} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
