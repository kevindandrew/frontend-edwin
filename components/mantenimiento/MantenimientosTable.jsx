"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Package } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function MantenimientosTable({
  mantenimientos,
  loading,
  equipos,
  repuestosPorMantenimiento,
  onVer,
  onEditar,
  onEliminar,
  onVerRepuestos,
}) {
  const obtenerNombreEquipo = (idEquipo) => {
    const equipo = equipos.find((e) => e.id_equipo === idEquipo);
    return equipo?.nombre_equipo || equipo?.nombre || "N/A";
  };

  const calcularEstado = (mantenimiento) => {
    if (mantenimiento.fecha_realizacion) return "Completado";
    const fechaProgramada = new Date(mantenimiento.fecha_programada);
    const hoy = new Date();
    if (fechaProgramada < hoy) return "Pendiente";
    if (fechaProgramada.toDateString() === hoy.toDateString())
      return "En Progreso";
    return "Programado";
  };

  const getEstadoColor = (estado) => {
    const colors = {
      Completado:
        "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
      Pendiente: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
      "En Progreso":
        "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
      Programado:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
    };
    return colors[estado] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner className="w-6 h-6" />
      </div>
    );
  }

  if (mantenimientos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No se encontraron mantenimientos
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-secondary/50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold">Nº</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Equipo
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Tipo</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Fecha Programada
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Fecha Realización
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Costo</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Repuestos
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {mantenimientos.map((m) => {
            const estado = calcularEstado(m);
            const repuestosUsados =
              repuestosPorMantenimiento[m.id_mantenimiento] || [];

            return (
              <tr
                key={m.id_mantenimiento}
                className="hover:bg-secondary/50 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium">
                  {m.id_mantenimiento}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  {obtenerNombreEquipo(m.id_equipo)}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {m.tipo_mantenimiento}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {m.fecha_programada}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {m.fecha_realizacion || "-"}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  Bs. {parseFloat(m.costo_total || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm">
                  {repuestosUsados.length > 0 ? (
                    <button
                      onClick={() => onVerRepuestos(m)}
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <Badge variant="outline" className="gap-1">
                        <Package className="w-3 h-3" />
                        {repuestosUsados.length}
                      </Badge>
                    </button>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                      estado
                    )}`}
                  >
                    {estado}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => onVer(m)}
                      title="Ver PDF"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => onEditar(m)}
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-destructive"
                      onClick={() => onEliminar(m)}
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
