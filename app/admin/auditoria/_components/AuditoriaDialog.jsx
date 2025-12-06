import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

const obtenerCambios = (datosAnteriores, datosNuevos) => {
  if (!datosAnteriores || !datosNuevos) return [];

  const cambios = [];
  const todasLasClaves = new Set([
    ...Object.keys(datosAnteriores),
    ...Object.keys(datosNuevos),
  ]);

  todasLasClaves.forEach((clave) => {
    const valorAnterior = datosAnteriores[clave];
    const valorNuevo = datosNuevos[clave];

    if (JSON.stringify(valorAnterior) !== JSON.stringify(valorNuevo)) {
      cambios.push({
        campo: clave,
        anterior: valorAnterior ?? "N/A",
        nuevo: valorNuevo ?? "N/A",
      });
    }
  });

  return cambios;
};

export default function AuditoriaDialog({
  open,
  onClose,
  auditoria,
  usuarios,
}) {
  if (!auditoria) return null;

  const cambios =
    auditoria.operacion === "UPDATE"
      ? obtenerCambios(auditoria.datos_anteriores, auditoria.datos_nuevos)
      : [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles de Auditoría</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Información General</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">ID:</span>{" "}
                <span className="font-medium">{auditoria.id_auditoria}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Fecha:</span>{" "}
                <span className="font-medium">
                  {new Date(auditoria.fecha_operacion).toLocaleString("es-ES")}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Usuario:</span>{" "}
                <span className="font-medium">
                  {auditoria.usuario?.nombre_completo ||
                    (usuarios &&
                      usuarios.find(
                        (u) => u.id_usuario === auditoria.id_usuario
                      )?.nombre_completo) ||
                    (auditoria.id_usuario ? auditoria.id_usuario : "Sistema")}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Tabla:</span>{" "}
                <span className="font-medium">{auditoria.tabla}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Operación:</span>{" "}
                <Badge className={OPERACIONES[auditoria.operacion]?.color}>
                  {OPERACIONES[auditoria.operacion]?.label ||
                    auditoria.operacion}
                </Badge>
              </div>
            </div>
          </Card>

          {auditoria.operacion === "UPDATE" && cambios.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Cambios Realizados</h3>
              <div className="space-y-2">
                {cambios.map((cambio, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-3 gap-2 p-2 bg-muted/50 rounded text-sm"
                  >
                    <div className="font-medium">{cambio.campo}</div>
                    <div className="text-red-600 dark:text-red-400">
                      {String(cambio.anterior)}
                    </div>
                    <div className="text-green-600 dark:text-green-400">
                      {String(cambio.nuevo)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {(auditoria.operacion === "INSERT" ||
            auditoria.operacion === "DELETE") && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3">
                {auditoria.operacion === "INSERT"
                  ? "Datos Creados"
                  : "Datos Eliminados"}
              </h3>
              <div className="bg-muted p-3 rounded-md">
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(
                    auditoria.operacion === "INSERT"
                      ? auditoria.datos_nuevos
                      : auditoria.datos_anteriores,
                    null,
                    2
                  )}
                </pre>
              </div>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
