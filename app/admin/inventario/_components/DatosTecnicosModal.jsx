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
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Plus, Trash2 } from "lucide-react";

export default function DatosTecnicosModal({
  open,
  onOpenChange,
  equipo,
  datosTecnicos,
  loading,
  onSave,
}) {
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    if (datosTecnicos && datosTecnicos.length > 0) {
      setFormData(datosTecnicos);
    } else {
      // Inicializar con un campo vacío
      setFormData([{ parametro: "", valor: "", unidad: "" }]);
    }
  }, [datosTecnicos]);

  const handleAddField = () => {
    setFormData([...formData, { parametro: "", valor: "", unidad: "" }]);
  };

  const handleRemoveField = (index) => {
    const newData = formData.filter((_, i) => i !== index);
    setFormData(newData);
  };

  const handleFieldChange = (index, field, value) => {
    const newData = [...formData];
    newData[index] = { ...newData[index], [field]: value };
    setFormData(newData);
  };

  const handleSubmit = () => {
    // Filtrar campos vacíos
    const validData = formData.filter(
      (item) => item.parametro.trim() !== "" && item.valor.trim() !== ""
    );

    if (validData.length === 0) {
      alert("Debe agregar al menos un dato técnico válido");
      return;
    }

    onSave(validData);
  };

  if (!equipo) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Datos Técnicos - {equipo.nombre_equipo} ({equipo.numero_serie})
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-4">
            {formData.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-3 items-start border p-3 rounded-md"
              >
                <div className="col-span-4">
                  <Label htmlFor={`parametro-${index}`}>Parámetro</Label>
                  <Input
                    id={`parametro-${index}`}
                    value={item.parametro}
                    onChange={(e) =>
                      handleFieldChange(index, "parametro", e.target.value)
                    }
                    placeholder="Ej: Voltaje"
                  />
                </div>
                <div className="col-span-3">
                  <Label htmlFor={`valor-${index}`}>Valor</Label>
                  <Input
                    id={`valor-${index}`}
                    value={item.valor}
                    onChange={(e) =>
                      handleFieldChange(index, "valor", e.target.value)
                    }
                    placeholder="Ej: 220"
                  />
                </div>
                <div className="col-span-3">
                  <Label htmlFor={`unidad-${index}`}>Unidad</Label>
                  <Input
                    id={`unidad-${index}`}
                    value={item.unidad}
                    onChange={(e) =>
                      handleFieldChange(index, "unidad", e.target.value)
                    }
                    placeholder="Ej: V"
                  />
                </div>
                <div className="col-span-2 flex items-end">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveField(index)}
                    disabled={formData.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={handleAddField}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Campo
            </Button>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            Guardar Datos Técnicos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
