"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function DeleteCompraDialog({
  open,
  onOpenChange,
  compra,
  onConfirm,
}) {
  const handleDelete = () => {
    if (compra) {
      onConfirm(compra.id_compra);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            Eliminar Compra
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar esta compra? Esta acción no se
            puede deshacer.
          </DialogDescription>
        </DialogHeader>
        {compra && (
          <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">ID Compra:</span>
              <span className="font-medium">#{compra.id_compra}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Estado:</span>
              <span className="font-medium">{compra.estado_compra}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Monto:</span>
              <span className="font-medium">
                Bs. {parseFloat(compra.monto_total || 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
