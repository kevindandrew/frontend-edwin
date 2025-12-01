import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function DatosEquipoSection({
  formData,
  handleChange,
  estados,
  catalogos,
  getCatalogoItems,
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-primary">
          Datos del Equipo Médico
        </h3>
        <Separator className="mt-2" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="nombre_equipo">Nombre del Equipo *</Label>
          <Input
            id="nombre_equipo"
            value={formData.nombre_equipo}
            onChange={(e) => handleChange("nombre_equipo", e.target.value)}
            placeholder="Ej: Monitor Cardíaco"
          />
        </div>

        <div>
          <Label htmlFor="modelo">Modelo</Label>
          <Input
            id="modelo"
            value={formData.modelo}
            onChange={(e) => handleChange("modelo", e.target.value)}
            placeholder="Ej: MC-3000"
          />
        </div>

        <div>
          <Label htmlFor="numero_serie">Número de Serie</Label>
          <Input
            id="numero_serie"
            value={formData.numero_serie}
            onChange={(e) => handleChange("numero_serie", e.target.value)}
            placeholder="Ej: SN-2024-001"
          />
        </div>

        <div>
          <Label htmlFor="fecha_adquisicion">Fecha de Adquisición</Label>
          <Input
            id="fecha_adquisicion"
            type="date"
            value={formData.fecha_adquisicion}
            onChange={(e) => handleChange("fecha_adquisicion", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="garantia">Garantía</Label>
          <Input
            id="garantia"
            value={formData.garantia}
            onChange={(e) => handleChange("garantia", e.target.value)}
            placeholder="Ej: 2 años"
          />
        </div>

        <div>
          <Label htmlFor="proveedor">Proveedor</Label>
          <Input
            id="proveedor"
            value={formData.proveedor}
            onChange={(e) => handleChange("proveedor", e.target.value)}
            placeholder="Ej: Proveedor Médico S.A."
          />
        </div>

        <div>
          <Label htmlFor="id_tecnologia">Tipo de Tecnología</Label>
          <Select
            value={formData.id_tecnologia}
            onValueChange={(value) => handleChange("id_tecnologia", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tecnología" />
            </SelectTrigger>
            <SelectContent>
              {getCatalogoItems(catalogos, "tecnologia").map((item) => (
                <SelectItem
                  key={item.id_tecnologia}
                  value={item.id_tecnologia.toString()}
                >
                  {item.nombre_tecnologia}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="estado">Estado *</Label>
          <Select
            value={formData.estado}
            onValueChange={(value) => handleChange("estado", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {estados.map((estado) => (
                <SelectItem key={estado} value={estado}>
                  {estado}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
