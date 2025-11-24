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

export default function ClienteFormDialog({
  open,
  onOpenChange,
  cliente,
  onSubmit,
  loading,
}) {
  const [formData, setFormData] = useState({
    nombre_institucion: "",
    nit_ruc: "",
    persona_contacto: "",
    telefono_contacto: "",
    email_contacto: "",
    direccion: "",
  });

  useEffect(() => {
    if (cliente) {
      setFormData({
        nombre_institucion: cliente.nombre_institucion || "",
        nit_ruc: cliente.nit_ruc || "",
        persona_contacto: cliente.persona_contacto || "",
        telefono_contacto: cliente.telefono_contacto || "",
        email_contacto: cliente.email_contacto || "",
        direccion: cliente.direccion || "",
      });
    } else {
      setFormData({
        nombre_institucion: "",
        nit_ruc: "",
        persona_contacto: "",
        telefono_contacto: "",
        email_contacto: "",
        direccion: "",
      });
    }
  }, [cliente, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {cliente ? "Editar Cliente" : "Crear Cliente"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre_institucion">
                  Nombre de Institución *
                </Label>
                <Input
                  id="nombre_institucion"
                  value={formData.nombre_institucion}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nombre_institucion: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nit_ruc">NIT *</Label>
                <Input
                  id="nit_ruc"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={formData.nit_ruc}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setFormData({ ...formData, nit_ruc: value });
                  }}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="persona_contacto">Persona de Contacto</Label>
                <Input
                  id="persona_contacto"
                  value={formData.persona_contacto}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      persona_contacto: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono_contacto">Teléfono de Contacto</Label>
                <Input
                  id="telefono_contacto"
                  value={formData.telefono_contacto}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      telefono_contacto: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email_contacto">Email de Contacto</Label>
              <Input
                id="email_contacto"
                type="email"
                value={formData.email_contacto}
                onChange={(e) =>
                  setFormData({ ...formData, email_contacto: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) =>
                  setFormData({ ...formData, direccion: e.target.value })
                }
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
                <>{cliente ? "Actualizar" : "Crear"}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
