import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const estadoColors = {
  "En Uso": "default",
  Disponible: "secondary",
  "En Mantenimiento": "warning",
  "Fuera de Servicio": "destructive",
};

export default function EquiposTable({
  equipos,
  loading,
  onView,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner className="w-6 h-6" />
      </div>
    );
  }

  if (equipos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No se encontraron equipos
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">#</TableHead>
            <TableHead>Equipo</TableHead>
            <TableHead>Modelo</TableHead>
            <TableHead>Serie</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Institución/Sala</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {equipos.map((equipo) => (
            <TableRow key={equipo.id_equipo}>
              <TableCell className="text-muted-foreground font-medium">
                {equipo.id_equipo}
              </TableCell>
              <TableCell className="font-medium">
                {equipo.nombre_equipo}
              </TableCell>
              <TableCell>{equipo.modelo || "-"}</TableCell>
              <TableCell className="font-mono text-sm">
                {equipo.numero_serie}
              </TableCell>
              <TableCell>
                <Badge variant={estadoColors[equipo.estado] || "default"}>
                  {equipo.estado}
                </Badge>
              </TableCell>
              <TableCell>
                {equipo.cliente?.nombre_institucion &&
                equipo.ubicacion?.nombre_ubicacion
                  ? `${equipo.cliente.nombre_institucion} - ${equipo.ubicacion.nombre_ubicacion}`
                  : equipo.ubicacion?.nombre_ubicacion || "-"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(equipo)}
                    title="Ver detalles"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(equipo)}
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(equipo)}
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
