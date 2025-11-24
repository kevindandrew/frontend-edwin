import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export default function DatosTecnicosSection({ formData, handleChange }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-primary">Datos Técnicos</h3>
        <Separator className="mt-2 mb-4" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="voltaje_operacion">Voltaje de Operación</Label>
          <Input
            id="voltaje_operacion"
            value={formData.voltaje_operacion}
            onChange={(e) => handleChange("voltaje_operacion", e.target.value)}
            placeholder="Ej: 220V"
          />
        </div>

        <div>
          <Label htmlFor="potencia">Potencia</Label>
          <Input
            id="potencia"
            value={formData.potencia}
            onChange={(e) => handleChange("potencia", e.target.value)}
            placeholder="Ej: 1500W"
          />
        </div>

        <div>
          <Label htmlFor="frecuencia">Frecuencia</Label>
          <Input
            id="frecuencia"
            value={formData.frecuencia}
            onChange={(e) => handleChange("frecuencia", e.target.value)}
            placeholder="Ej: 50/60Hz"
          />
        </div>

        <div>
          <Label htmlFor="peso">Peso</Label>
          <Input
            id="peso"
            value={formData.peso}
            onChange={(e) => handleChange("peso", e.target.value)}
            placeholder="Ej: 25 kg"
          />
        </div>

        <div>
          <Label htmlFor="dimensiones">Dimensiones</Label>
          <Input
            id="dimensiones"
            value={formData.dimensiones}
            onChange={(e) => handleChange("dimensiones", e.target.value)}
            placeholder="Ej: 50x40x30 cm"
          />
        </div>

        <div>
          <Label htmlFor="vida_util">Vida Útil</Label>
          <Input
            id="vida_util"
            value={formData.vida_util}
            onChange={(e) => handleChange("vida_util", e.target.value)}
            placeholder="Ej: 10 años"
          />
        </div>

        <div className="col-span-3">
          <Label htmlFor="manual_operacion">Manual de Operación</Label>
          <Textarea
            id="manual_operacion"
            value={formData.manual_operacion}
            onChange={(e) => handleChange("manual_operacion", e.target.value)}
            placeholder="Información sobre el manual de operación"
            rows={3}
          />
        </div>

        <div className="col-span-3">
          <Label htmlFor="observaciones">Observaciones</Label>
          <Textarea
            id="observaciones"
            value={formData.observaciones}
            onChange={(e) => handleChange("observaciones", e.target.value)}
            placeholder="Observaciones adicionales sobre el equipo"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
