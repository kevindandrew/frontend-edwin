import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

export default function UbicacionFormDialog({
  open,
  onOpenChange,
  ubicacion,
  onSubmit,
  loading,
}) {
  const [formData, setFormData] = useState({
    nombre_ubicacion: "",
  });

  useEffect(() => {
    if (ubicacion) {
      setFormData({
        nombre_ubicacion: ubicacion.nombre_ubicacion || "",
      });
    } else {
      setFormData({
        nombre_ubicacion: "",
      });
    }
  }, [ubicacion, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{ubicacion ? "Editar Sala" : "Crear Sala"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre_ubicacion">Nombre de Sala *</Label>
              <Input
                id="nombre_ubicacion"
                placeholder="Ej: Quirófano 1, Sala de UCI, etc."
                value={formData.nombre_ubicacion}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nombre_ubicacion: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Guardando...
                </>
              ) : (
                <>{ubicacion ? "Actualizar" : "Crear"}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
