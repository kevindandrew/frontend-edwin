"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Download, RefreshCw, TrendingUp, DollarSign } from "lucide-react";
import useEstadisticas from "@/hooks/useEstadisticas";
import {
  generarPDFCompras,
  generarPDFCompleto,
} from "@/app/admin/reportes/_components/generarPDFReportes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MESES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

export default function ComprasReportesPage() {
  const [añoSeleccionado, setAñoSeleccionado] = useState(
    new Date().getFullYear()
  );

  const { comprasPorMes, loading, fetchComprasPorMes } = useEstadisticas();

  useEffect(() => {
    fetchComprasPorMes(añoSeleccionado);
  }, []);

  const handleAñoChange = async (año) => {
    setAñoSeleccionado(parseInt(año));
    await fetchComprasPorMes(parseInt(año));
  };

  const handleRefresh = async () => {
    await fetchComprasPorMes(añoSeleccionado);
  };

  const totalComprasAnual =
    comprasPorMes?.reduce((acc, curr) => acc + curr.total_compras, 0) || 0;
  const cantidadComprasAnual =
    comprasPorMes?.reduce((acc, curr) => acc + curr.cantidad_compras, 0) || 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reportes de Compras</h1>
          <p className="text-muted-foreground mt-2">
            Análisis financiero y estadísticas de adquisiciones
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={añoSeleccionado.toString()}
            onValueChange={handleAñoChange}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Año" />
            </SelectTrigger>
            <SelectContent>
              {[2023, 2024, 2025].map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => generarPDFCompras(comprasPorMes, añoSeleccionado)}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar Reporte
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Gasto Total ({añoSeleccionado})
              </p>
              <h3 className="text-2xl font-bold">
                Bs. {totalComprasAnual.toFixed(2)}
              </h3>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Total Órdenes ({añoSeleccionado})
              </p>
              <h3 className="text-2xl font-bold">{cantidadComprasAnual}</h3>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">
          Evolución Mensual de Compras
        </h3>
        <div className="space-y-4">
          {MESES.map((mes, index) => {
            const data = comprasPorMes?.find((c) => c.mes === index + 1);
            const maxMonto = Math.max(
              ...(comprasPorMes?.map((c) => c.total_compras) || [1])
            );

            return (
              <div key={index} className="flex items-center gap-4">
                <span className="text-sm w-12 font-medium">{mes}</span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-8 relative overflow-hidden">
                    {data && (
                      <div
                        className="bg-blue-600 h-8 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                        style={{
                          width: `${(data.total_compras / maxMonto) * 100}%`,
                          minWidth: data.total_compras > 0 ? "2rem" : "0",
                        }}
                      >
                        <span className="text-xs text-white font-medium">
                          Bs. {data.total_compras.toFixed(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-sm w-24 text-right text-muted-foreground">
                    {data?.cantidad_compras || 0} órdenes
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
