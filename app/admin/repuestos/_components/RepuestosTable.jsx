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
import { Pencil, Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function RepuestosTable({
  repuestos,
  loading,
  tecnologias,
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

  if (repuestos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No se encontraron repuestos
      </div>
    );
  }

  const obtenerNombreTecnologia = (idTecnologia) => {
    const tecnologia = tecnologias?.find(
      (t) => t.id_tecnologia === idTecnologia
    );
    return tecnologia?.nombre_tecnologia || "-";
  };

  const getStockBadgeVariant = (stock, stockMinimo) => {
    if (stock === 0) return "destructive";
    if (stock < stockMinimo) return "warning";
    return "default";
  };

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Nro</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead className="text-center">Stock Mínimo</TableHead>
            <TableHead>Tecnología</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {repuestos.map((repuesto) => (
            <TableRow key={repuesto.id_repuesto}>
              <TableCell className="text-muted-foreground font-medium">
                {repuesto.id_repuesto}
              </TableCell>
              <TableCell className="font-medium">{repuesto.nombre}</TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={getStockBadgeVariant(
                    repuesto.stock,
                    repuesto.stock_minimo
                  )}
                >
                  {repuesto.stock}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                {repuesto.stock_minimo}
              </TableCell>
              <TableCell>
                {obtenerNombreTecnologia(repuesto.id_tecnologia)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(repuesto)}
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(repuesto)}
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
