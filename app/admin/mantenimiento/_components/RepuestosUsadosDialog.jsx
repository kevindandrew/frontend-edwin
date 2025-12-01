"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Package, AlertCircle } from "lucide-react";

export default function RepuestosUsadosDialog({
  open,
  onOpenChange,
  mantenimiento,
  repuestos,
}) {
  if (!mantenimiento) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Repuestos Utilizados - Mantenimiento #
            {mantenimiento.id_mantenimiento}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {repuestos && repuestos.length > 0 ? (
            <>
              <div className="text-sm text-muted-foreground">
                Total de repuestos: <strong>{repuestos.length}</strong>
              </div>
              <div className="space-y-3">
                {repuestos.map((r, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border"
                  >
                    <div className="flex-1">
                      <p className="font-medium">
                        {r.repuesto?.nombre || "N/A"}
                      </p>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <span>
                          Stock disponible:{" "}
                          <strong>{r.repuesto?.stock || "N/A"}</strong>
                        </span>
                        {r.repuesto?.proveedor && (
                          <span>
                            Proveedor:{" "}
                            <strong>{r.repuesto.proveedor.nombre}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-base">
                        Cantidad: {r.cantidad_usada}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                No se utilizaron repuestos en este mantenimiento
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
