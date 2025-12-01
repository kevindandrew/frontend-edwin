import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function UbicacionSection({
  formData,
  handleChange,
  handleClienteChange,
  clientes,
  ubicacionesDisponibles,
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-primary">Ubicación</h3>
        <Separator className="mt-2" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="id_cliente">Institución *</Label>
          <Select
            value={formData.id_cliente}
            onValueChange={handleClienteChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar institución" />
            </SelectTrigger>
            <SelectContent>
              {clientes.map((cliente) => (
                <SelectItem
                  key={cliente.id_cliente}
                  value={cliente.id_cliente.toString()}
                >
                  {cliente.nombre_institucion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="id_ubicacion">Sala *</Label>
          <Select
            value={formData.id_ubicacion}
            onValueChange={(value) => handleChange("id_ubicacion", value)}
            disabled={!formData.id_cliente}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  formData.id_cliente
                    ? "Seleccionar sala"
                    : "Primero seleccione institución"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {ubicacionesDisponibles.map((ubicacion) => (
                <SelectItem
                  key={ubicacion.id_ubicacion}
                  value={ubicacion.id_ubicacion.toString()}
                >
                  {ubicacion.nombre_ubicacion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
