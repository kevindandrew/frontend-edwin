"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileDown,
  Package,
  Calendar,
  DollarSign,
  User,
  Wrench,
  ExternalLink,
} from "lucide-react";
import { generarPDFMantenimiento } from "./generarPDFMantenimiento";

export default function MantenimientoViewDialog({
  open,
  onOpenChange,
  mantenimiento,
  equipo,
  tecnico,
  repuestos,
}) {
  const router = useRouter();
  const handleDescargarPDF = () => {
    generarPDFMantenimiento(mantenimiento, equipo, tecnico, repuestos);
  };

  const calcularEstado = () => {
    if (!mantenimiento) return "N/A";
    if (mantenimiento.fecha_realizacion) return "Completado";
    const fechaProgramada = new Date(mantenimiento.fecha_programada);
    const hoy = new Date();
    if (fechaProgramada < hoy) return "Pendiente";
    if (fechaProgramada.toDateString() === hoy.toDateString())
      return "En Progreso";
    return "Programado";
  };

  const getEstadoBadge = (estado) => {
    const variants = {
      Completado: "default",
      Pendiente: "destructive",
      "En Progreso": "secondary",
      Programado: "outline",
    };
    return variants[estado] || "outline";
  };

  if (!mantenimiento) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">
              Mantenimiento #{mantenimiento.id_mantenimiento}
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDescargarPDF}
              className="gap-2"
            >
              <FileDown className="h-4 w-4" />
              Descargar PDF
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información General */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Tipo de Mantenimiento
              </p>
              <p className="font-medium">{mantenimiento.tipo_mantenimiento}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Estado</p>
              <Badge variant={getEstadoBadge(calcularEstado())}>
                {calcularEstado()}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fecha Programada
              </p>
              <p className="font-medium">{mantenimiento.fecha_programada}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fecha Realización
              </p>
              <p className="font-medium">
                {mantenimiento.fecha_realizacion || "Pendiente"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Costo Total
              </p>
              <p className="font-medium text-lg">
                Bs. {parseFloat(mantenimiento.costo_total || 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Equipo */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Equipo Intervenido</h3>
            <div className="grid grid-cols-2 gap-4 bg-secondary/50 p-4 rounded-lg">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Nombre</p>
                <button
                  onClick={() => {
                    if (equipo?.id_equipo) {
                      router.push(`/admin/inventario?id=${equipo.id_equipo}`);
                      onOpenChange(false);
                    }
                  }}
                  className="font-medium text-primary hover:underline flex items-center gap-1"
                >
                  {equipo?.nombre_equipo || "N/A"}
                  {equipo?.id_equipo && <ExternalLink className="h-3 w-3" />}
                </button>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Serie</p>
                <p className="font-medium">{equipo?.numero_serie || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Modelo</p>
                <p className="font-medium">{equipo?.modelo || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Fabricante</p>
                <p className="font-medium">
                  {equipo?.fabricante?.nombre || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Ubicación (Institución - Área)
                </p>
                <p className="font-medium">
                  {equipo?.cliente?.nombre_institucion && equipo?.ubicacion
                    ? `${equipo.cliente.nombre_institucion} - ${
                        equipo.ubicacion.nombre_ubicacion ||
                        equipo.ubicacion.nombre ||
                        "N/A"
                      }`
                    : equipo?.cliente?.nombre_institucion || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Técnico */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Técnico Responsable
            </h3>
            <div className="bg-secondary/50 p-4 rounded-lg">
              <p className="font-medium">{tecnico?.nombre_completo || "N/A"}</p>
            </div>
          </div>

          {/* Descripción */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Descripción del Trabajo</h3>
            <p className="text-sm text-muted-foreground bg-secondary/50 p-4 rounded-lg">
              {mantenimiento.descripcion_trabajo || "Sin descripción"}
            </p>
          </div>

          {/* Repuestos */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Repuestos Utilizados ({repuestos?.length || 0})
            </h3>
            {repuestos && repuestos.length > 0 ? (
              <div className="space-y-2">
                {repuestos.map((r, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">
                        {r.repuesto?.nombre || "N/A"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Stock disponible: {r.repuesto?.stock || "N/A"}
                      </p>
                    </div>
                    <Badge variant="outline">
                      Cantidad: {r.cantidad_usada}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground bg-secondary/50 p-4 rounded-lg">
                No se utilizaron repuestos en este mantenimiento
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
