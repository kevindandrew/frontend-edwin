import { Card } from "@/components/ui/card";

export const ActividadReciente = ({
  actividades,
  loading,
  formatearFecha,
  getOperacionTexto,
}) => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Actividad Reciente</h2>
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : actividades.length > 0 ? (
          actividades.map((item) => (
            <div
              key={item.id_auditoria}
              className="flex items-center justify-between pb-3 border-b last:border-0"
            >
              <div>
                <p className="font-medium text-foreground">
                  {getOperacionTexto(item.operacion)} en {item.tabla}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.usuario?.nombre_completo || "Usuario desconocido"}
                  {item.datos_nuevos?.mensaje &&
                    ` - ${item.datos_nuevos.mensaje}`}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatearFecha(item.fecha_operacion)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No hay actividad reciente
          </p>
        )}
      </div>
    </Card>
  );
};
