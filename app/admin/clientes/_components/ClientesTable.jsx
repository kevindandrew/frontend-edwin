import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, MapPin } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function ClientesTable({
  clientes,
  loading,
  onView,
  onEdit,
  onDelete,
  onViewSalas,
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner className="w-6 h-6" />
      </div>
    );
  }

  if (clientes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No se encontraron clientes
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">#</TableHead>
            <TableHead>Institución</TableHead>
            <TableHead>NIT</TableHead>
            <TableHead>Persona Contacto</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead className="text-center">Salas</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.map((cliente, index) => (
            <TableRow key={cliente.id_cliente}>
              <TableCell className="text-muted-foreground font-medium">
                {cliente.id_cliente}
              </TableCell>
              <TableCell className="font-medium">
                {cliente.nombre_institucion}
              </TableCell>
              <TableCell>{cliente.nit_ruc}</TableCell>
              <TableCell>{cliente.persona_contacto || "-"}</TableCell>
              <TableCell>{cliente.telefono_contacto || "-"}</TableCell>
              <TableCell className="max-w-xs truncate">
                {cliente.direccion || "-"}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewSalas(cliente)}
                >
                  Ver Salas
                </Button>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(cliente)}
                    title="Ver detalles"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(cliente)}
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(cliente)}
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
