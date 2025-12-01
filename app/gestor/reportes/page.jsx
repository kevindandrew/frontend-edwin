"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, BarChart2, DollarSign } from "lucide-react";
import {
  generarReporteEquiposCriticos,
  generarReporteProyeccionMantenimiento,
} from "@/app/admin/reportes/_components/generarPDFReportes";
import useEquipos from "@/hooks/useEquipos";
import useMantenimientos from "@/hooks/useMantenimientos";
import { Spinner } from "@/components/ui/spinner";

export default function GestorReportesPage() {
  const { equipos, loading: loadingEquipos } = useEquipos();
  const { mantenimientos, loading: loadingMant } = useMantenimientos();
  const [generating, setGenerating] = useState(false);

  const handleGenerateReport = async (type) => {
    setGenerating(true);
    try {
      if (type === "equipos_criticos") {
        await generarReporteEquiposCriticos(equipos);
      } else if (type === "proyeccion") {
        await generarReporteProyeccionMantenimiento(mantenimientos);
      }
      // Aquí se podrían agregar más tipos de reportes específicos para el gestor
    } catch (error) {
      console.error("Error generando reporte:", error);
    } finally {
      setGenerating(false);
    }
  };

  const reports = [
    {
      id: "equipos_criticos",
      title: "Estado de Equipos Críticos",
      description:
        "Reporte detallado de equipos clasificados por nivel de riesgo y estado operativo.",
      icon: BarChart2,
      action: () => handleGenerateReport("equipos_criticos"),
    },
    {
      id: "proyeccion",
      title: "Proyección de Mantenimientos",
      description:
        "Análisis de mantenimientos programados para los próximos meses.",
      icon: FileText,
      action: () => handleGenerateReport("proyeccion"),
    },
    // Se pueden agregar más reportes aquí
  ];

  if (loadingEquipos || loadingMant) {
    return (
      <div className="flex justify-center items-center h-full py-12">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reportes Técnicos</h1>
        <p className="text-muted-foreground mt-2">
          Genera informes detallados para la toma de decisiones.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.id} className="flex flex-col">
              <CardHeader>
                <div className="p-2 w-fit rounded-lg bg-primary/10 mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-6">
                <Button
                  className="w-full"
                  onClick={report.action}
                  disabled={generating}
                >
                  {generating ? (
                    <Spinner className="w-4 h-4 mr-2" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Generar PDF
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
