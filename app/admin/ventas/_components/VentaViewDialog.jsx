import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function VentaViewDialog({
  open,
  onOpenChange,
  venta,
  cliente,
}) {
  if (!venta) return null;

  const detalles = venta.detalles || [];

  const getEstadoColor = (estado) => {
    const colors = {
      Entregada:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      "En Proceso":
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      Pendiente:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      Cancelada: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return colors[estado] || "bg-gray-100 text-gray-700";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalles de Venta #{venta.id_venta}</span>
            <Badge className={getEstadoColor(venta.estado_venta)}>
              {venta.estado_venta}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                Cliente
              </h4>
              <p className="text-base font-medium">
                {cliente?.nombre_institucion || `Cliente #${venta.id_cliente}`}
              </p>
              {cliente && (
                <div className="text-sm text-muted-foreground mt-1">
                  <p>NIT: {cliente.nit}</p>
                  <p>{cliente.direccion}</p>
                </div>
              )}
            </div>
            <div className="text-right">
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                Fecha de Venta
              </h4>
              <p className="text-base">{venta.fecha_venta}</p>
              <h4 className="font-semibold text-sm text-muted-foreground mt-4 mb-1">
                Total
              </h4>
              <p className="text-2xl font-bold">
                Bs. {parseFloat(venta.monto_total || 0).toFixed(2)}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-3">Items de la Venta</h4>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              {detalles.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay items registrados en esta venta.
                </p>
              ) : (
                <div className="space-y-4">
                  {detalles.map((detalle, index) => (
                    <div
                      key={detalle.id_detalle_venta || index}
                      className="flex justify-between items-start pb-4 last:pb-0 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">
                          {detalle.equipo?.nombre_equipo ||
                            "Equipo desconocido"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Cantidad: {detalle.cantidad}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          Bs. {parseFloat(detalle.subtotal || 0).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Unitario: Bs.{" "}
                          {parseFloat(detalle.precio_unitario || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
