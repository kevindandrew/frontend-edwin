"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileDown, Package, Box, Calendar, DollarSign } from "lucide-react";
import { generarPDFCompra } from "./generarPDFCompra";

export default function CompraViewDialog({
  open,
  onOpenChange,
  compra,
  detalles,
}) {
  const handleDescargarPDF = () => {
    generarPDFCompra(compra, detalles);
  };

  const getEstadoBadge = (estado) => {
    const variants = {
      Completada: "default",
      Aprobada: "default",
      Solicitada: "secondary",
      Cancelada: "destructive",
    };
    return variants[estado] || "outline";
  };

  if (!compra) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Detalle de Compra #{compra.id_compra}</DialogTitle>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleDescargarPDF}
            >
              <FileDown className="w-4 h-4" />
              Descargar PDF
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información General */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/30 rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Fecha Solicitud
              </div>
              <p className="font-medium">{compra.fecha_solicitud}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Fecha Aprobación
              </div>
              <p className="font-medium">{compra.fecha_aprobacion || "-"}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                Monto Total
              </div>
              <p className="font-medium text-lg">
                Bs. {parseFloat(compra.monto_total || 0).toFixed(2)}
              </p>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Estado</div>
              <Badge variant={getEstadoBadge(compra.estado_compra)}>
                {compra.estado_compra}
              </Badge>
            </div>
          </div>

          {/* Detalles de Items */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Items de Compra
            </h3>
            <div className="space-y-2">
              {detalles && detalles.length > 0 ? (
                detalles.map((detalle, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:bg-secondary/20 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          {detalle.id_equipo ? (
                            <Box className="w-4 h-4 text-blue-500" />
                          ) : (
                            <Package className="w-4 h-4 text-green-500" />
                          )}
                          <span className="font-medium">
                            {detalle.equipo?.nombre_equipo ||
                              detalle.repuesto?.nombre ||
                              "N/A"}
                          </span>
                          <Badge
                            variant={detalle.id_equipo ? "default" : "outline"}
                          >
                            {detalle.id_equipo ? "Equipo" : "Repuesto"}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {detalle.id_equipo && detalle.equipo && (
                            <>
                              <p>Modelo: {detalle.equipo.modelo || "N/A"}</p>
                              <p>
                                Fabricante:{" "}
                                {detalle.equipo.fabricante?.nombre || "N/A"}
                              </p>
                            </>
                          )}
                          {detalle.id_repuesto && detalle.repuesto && (
                            <p>Código: {detalle.repuesto.codigo || "N/A"}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-sm text-muted-foreground">
                          Cantidad: {detalle.cantidad}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Precio Unit.: Bs.{" "}
                          {parseFloat(detalle.precio_unitario || 0).toFixed(2)}
                        </div>
                        <div className="font-semibold text-lg">
                          Bs.{" "}
                          {(
                            detalle.cantidad *
                            parseFloat(detalle.precio_unitario || 0)
                          ).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No hay detalles disponibles
                </div>
              )}
            </div>
          </div>

          {/* Resumen */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total de la Compra:</span>
              <span className="text-2xl">
                Bs. {parseFloat(compra.monto_total || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
