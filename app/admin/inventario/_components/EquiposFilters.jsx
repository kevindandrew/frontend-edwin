import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EquiposFilters({
  searchTerm,
  setSearchTerm,
  filterEstado,
  setFilterEstado,
  filterUbicacion,
  setFilterUbicacion,
  catalogos,
  onClearFilters,
}) {
  const estados = [
    "En Uso",
    "Disponible",
    "En Mantenimiento",
    "Fuera de Servicio",
  ];

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder="Buscar por equipo, modelo o serie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-sm flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Estado
          </Label>
          <Select value={filterEstado} onValueChange={setFilterEstado}>
            <SelectTrigger>
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {estados.map((estado) => (
                <SelectItem key={estado} value={estado}>
                  {estado}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Ubicación
          </Label>
          <Select value={filterUbicacion} onValueChange={setFilterUbicacion}>
            <SelectTrigger>
              <SelectValue placeholder="Todas las ubicaciones" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {catalogos.ubicaciones?.map((ubicacion) => (
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

        <div className="flex items-end">
          <Button variant="outline" onClick={onClearFilters} className="w-full">
            Limpiar Filtros
          </Button>
        </div>
      </div>
    </div>
  );
}
