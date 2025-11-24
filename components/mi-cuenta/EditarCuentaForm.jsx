import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Save } from "lucide-react";
import CambiarPasswordSection from "./CambiarPasswordSection";

export default function EditarCuentaForm({
  formData,
  setFormData,
  passwordData,
  setPasswordData,
  onSubmit,
  onCancel,
  isSaving,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nombre_completo">Nombre Completo</Label>
          <Input
            id="nombre_completo"
            value={formData.nombre_completo}
            onChange={(e) =>
              setFormData({
                ...formData,
                nombre_completo: e.target.value,
              })
            }
            required
          />
        </div>
      </div>

      <Separator />

      <CambiarPasswordSection
        passwordData={passwordData}
        setPasswordData={setPasswordData}
      />

      <Separator />

      <div className="flex gap-2">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <Spinner className="w-4 h-4 mr-2" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </>
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
