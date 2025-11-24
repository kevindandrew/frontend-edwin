import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";

const OPERACIONES = {
  INSERT: {
    label: "Crear",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  UPDATE: {
    label: "Actualizar",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  DELETE: {
    label: "Eliminar",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
};

export default function AuditoriaTable({ auditorias, onVerDetalle }) {
  if (!auditorias?.length) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        No se encontraron registros
      </Card>
    );
  }

  return (
    <Card>
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">#</TableHead>
              <TableHead>Fecha y Hora</TableHead>
              <TableHead>Tabla</TableHead>
              <TableHead>Operación</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>ID Registro</TableHead>
              <TableHead>IP Origen</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditorias.map((auditoria) => (
              <TableRow key={auditoria.id_auditoria}>
                <TableCell className="font-medium">
                  {auditoria.id_auditoria}
                </TableCell>
                <TableCell>
                  {new Date(auditoria.fecha_operacion).toLocaleString("es-ES")}
                </TableCell>
                <TableCell className="font-medium">{auditoria.tabla}</TableCell>
                <TableCell>
                  <Badge className={OPERACIONES[auditoria.operacion]?.color}>
                    {OPERACIONES[auditoria.operacion]?.label ||
                      auditoria.operacion}
                  </Badge>
                </TableCell>
                <TableCell>{auditoria.id_usuario}</TableCell>
                <TableCell>{auditoria.id_registro}</TableCell>
                <TableCell className="text-muted-foreground">
                  {auditoria.ip_origen}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onVerDetalle(auditoria)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
