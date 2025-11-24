import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export default function InformacionAdicionalSection({
  formData,
  handleChange,
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-primary">
          Información Adicional
        </h3>
        <Separator className="mt-2 mb-4" />
      </div>

      <div>
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          value={formData.descripcion}
          onChange={(e) => handleChange("descripcion", e.target.value)}
          placeholder="Descripción del equipo..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="observaciones">Observaciones</Label>
        <Textarea
          id="observaciones"
          value={formData.observaciones}
          onChange={(e) => handleChange("observaciones", e.target.value)}
          placeholder="Observaciones adicionales..."
          rows={3}
        />
      </div>
    </div>
  );
}
