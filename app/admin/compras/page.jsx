"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import useCompras from "@/hooks/useCompras";
import NuevaCompraDialog from "./_components/NuevaCompraDialog";
import CompraViewDialog from "./_components/CompraViewDialog";
import DeleteCompraDialog from "./_components/DeleteCompraDialog";

export default function ComprasPage() {
  const {
    compras,
    loading,
    crearCompra,
    actualizarCompra,
    eliminarCompra,
    fetchDetallesPorCompra,
    crearDetalleCompra,
    actualizarDetalleCompra,
    eliminarDetalleCompra,
  } = useCompras();
  const [search, setSearch] = useState("");
  const [detallesPorCompra, setDetallesPorCompra] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    cargarDetalles();
  }, [compras]);

  const cargarDetalles = async () => {
    const detallesPromises = compras.map(async (compra) => {
      const detalles = await fetchDetallesPorCompra(compra.id_compra);
      return { id: compra.id_compra, detalles };
    });

    const resultados = await Promise.all(detallesPromises);
    const detallesMap = {};
    resultados.forEach(({ id, detalles }) => {
      detallesMap[id] = detalles;
    });
    setDetallesPorCompra(detallesMap);
  };

  const filteredCompras = compras
    .filter((c) => {
      const detalles = detallesPorCompra[c.id_compra] || [];
      const nombreEquipo =
        detalles[0]?.equipo?.nombre_equipo ||
        detalles[0]?.repuesto?.nombre ||
        "";
      return (
        c.estado_compra.toLowerCase().includes(search.toLowerCase()) ||
        nombreEquipo.toLowerCase().includes(search.toLowerCase())
      );
    })
    .sort((a, b) => a.id_compra - b.id_compra);

  const handleNueva = () => {
    setCompraSeleccionada(null);
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleVer = (compra) => {
    setCompraSeleccionada({
      ...compra,
      detalles: detallesPorCompra[compra.id_compra] || [],
    });
    setViewDialogOpen(true);
  };

  const handleEditar = (compra) => {
    setCompraSeleccionada({
      ...compra,
      detalles: detallesPorCompra[compra.id_compra] || [],
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleEliminar = (compra) => {
    setCompraSeleccionada(compra);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (payload) => {
    try {
      if (isEditing) {
        // Actualizar compra
        await actualizarCompra(compraSeleccionada.id_compra, payload);

        // Manejar detalles en edición
        const detallesActuales =
          detallesPorCompra[compraSeleccionada.id_compra] || [];
        const detallesNuevos = payload.detalles || [];

        // Eliminar detalles que ya no están
        for (const detalleActual of detallesActuales) {
          const existe = detallesNuevos.find((d) => {
            if (detalleActual.id_equipo) {
              return d.id_equipo === detalleActual.id_equipo;
            } else {
              return d.id_repuesto === detalleActual.id_repuesto;
            }
          });
          if (!existe) {
            await eliminarDetalleCompra(detalleActual.id_detalle_compra);
          }
        }

        // Agregar o actualizar detalles
        for (const detalle of detallesNuevos) {
          const existente = detallesActuales.find((d) => {
            if (detalle.id_equipo) {
              return d.id_equipo === detalle.id_equipo;
            } else {
              return d.id_repuesto === detalle.id_repuesto;
            }
          });

          if (existente) {
            // Actualizar si cambió
            await actualizarDetalleCompra(existente.id_detalle_compra, {
              ...detalle,
              id_compra: compraSeleccionada.id_compra,
            });
          } else {
            // Crear nuevo detalle
            await crearDetalleCompra({
              ...detalle,
              id_compra: compraSeleccionada.id_compra,
            });
          }
        }
      } else {
        // Crear compra nueva
        const nuevaCompra = await crearCompra({
          fecha_solicitud: payload.fecha_solicitud,
          fecha_aprobacion: payload.fecha_aprobacion,
          monto_total: payload.monto_total,
          estado_compra: payload.estado_compra,
        });

        // Crear detalles
        if (payload.detalles?.length > 0) {
          for (const detalle of payload.detalles) {
            await crearDetalleCompra({
              ...detalle,
              id_compra: nuevaCompra.id_compra,
            });
          }
        }
      }

      setDialogOpen(false);
      await cargarDetalles();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleConfirmDelete = async (id) => {
    try {
      await eliminarCompra(id);
      setDeleteDialogOpen(false);
      await cargarDetalles();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getEstadoColor = (estado) => {
    const colors = {
      Aprobada:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      Solicitada:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      Pendiente:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      Cancelada: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return (
      colors[estado] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
    );
  };

  const totalCompras = compras.reduce(
    (sum, c) => sum + parseFloat(c.monto_total || 0),
    0
  );
  const comprasAprobadas = compras
    .filter((c) => c.estado_compra === "Aprobada")
    .reduce((sum, c) => sum + parseFloat(c.monto_total || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Compras de Equipos Biomédicos</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona las órdenes de equipos médicos a proveedores especializados
          </p>
        </div>
        <Button className="gap-2" onClick={handleNueva}>
          <Plus className="w-4 h-4" />
          Nueva Compra
        </Button>
      </div>

      <Card className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por estado o equipo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total en Compras</p>
          <p className="text-3xl font-bold mt-2">
            Bs. {totalCompras.toFixed(2)}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Órdenes Completadas</p>
          <p className="text-3xl font-bold mt-2 text-green-600 dark:text-green-400">
            {compras.filter((c) => c.estado_compra === "Completada").length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Órdenes Activas</p>
          <p className="text-3xl font-bold mt-2">{compras.length}</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Spinner className="w-6 h-6" />
          </div>
        ) : filteredCompras.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No se encontraron compras
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Nº
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Fecha Solicitud
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Fecha Aprobación
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Total
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
                {filteredCompras.map((c, index) => {
                  const detalles = detallesPorCompra[c.id_compra] || [];
                  return (
                    <tr
                      key={c.id_compra}
                      className="hover:bg-secondary/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium">
                        {c.id_compra}
                      </td>
                      <td className="px-6 py-4 text-sm">{c.fecha_solicitud}</td>
                      <td className="px-6 py-4 text-sm">
                        {c.fecha_aprobacion || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm">{detalles.length}</td>
                      <td className="px-6 py-4 text-sm font-medium">
                        Bs. {parseFloat(c.monto_total || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                            c.estado_compra
                          )}`}
                        >
                          {c.estado_compra}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => handleVer(c)}
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => handleEditar(c)}
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 text-destructive"
                            onClick={() => handleEliminar(c)}
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
        )}
      </Card>

      {/* Diálogos */}
      <NuevaCompraDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        compra={compraSeleccionada}
        isEditing={isEditing}
        onSubmit={handleSubmit}
      />

      <CompraViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        compra={compraSeleccionada}
        detalles={compraSeleccionada?.detalles || []}
      />

      <DeleteCompraDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        compra={compraSeleccionada}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
