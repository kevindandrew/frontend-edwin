import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";
import SearchInput from "@/components/shared/SearchInput";
import FilterSelect from "@/components/shared/FilterSelect";

const TABLAS = [
  { value: "EQUIPO_BIOMEDICO", label: "Equipos Biomédicos" },
  { value: "MANTENIMIENTO", label: "Mantenimientos" },
  { value: "VENTA", label: "Ventas" },
  { value: "COMPRA", label: "Compras" },
  { value: "REPUESTO", label: "Repuestos" },
  { value: "CLIENTE", label: "Clientes" },
  { value: "USUARIO", label: "Usuarios" },
];

const OPERACIONES = [
  { value: "INSERT", label: "Crear" },
  { value: "UPDATE", label: "Actualizar" },
  { value: "DELETE", label: "Eliminar" },
];

export default function AuditoriaFilters({
  searchTerm,
  setSearchTerm,
  filtroTabla,
  setFiltroTabla,
  filtroOperacion,
  setFiltroOperacion,
  filtroUsuario,
  setFiltroUsuario,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
  tecnicos,
  onAplicar,
  onLimpiar,
}) {
  const usuariosOptions =
    tecnicos?.map((usuario) => ({
      value: usuario.id_usuario.toString(),
      label: usuario.nombre_completo,
    })) || [];

  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div>
          <Label>Buscar</Label>
          <SearchInput value={searchTerm} onChange={setSearchTerm} />
        </div>

        <div>
          <Label>Tabla</Label>
          <FilterSelect
            value={filtroTabla}
            onChange={setFiltroTabla}
            placeholder="Todas"
            options={TABLAS}
          />
        </div>

        <div>
          <Label>Operación</Label>
          <FilterSelect
            value={filtroOperacion}
            onChange={setFiltroOperacion}
            placeholder="Todas"
            options={OPERACIONES}
          />
        </div>

        <div>
          <Label>Usuario</Label>
          <FilterSelect
            value={filtroUsuario}
            onChange={setFiltroUsuario}
            placeholder="Todos"
            options={usuariosOptions}
          />
        </div>

        <div>
          <Label>Fecha Inicio</Label>
          <Input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>

        <div>
          <Label>Fecha Fin</Label>
          <Input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button onClick={onAplicar} className="flex-1">
          Aplicar Filtros
        </Button>
        <Button onClick={onLimpiar} variant="outline">
          <RefreshCw className="w-4 h-4" />
          Limpiar
        </Button>
      </div>
    </Card>
  );
}
