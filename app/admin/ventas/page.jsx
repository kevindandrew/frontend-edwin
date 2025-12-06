"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import useVentas from "@/hooks/useVentas";
import useClientes from "@/hooks/useClientes";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import VentaFormDialog from "./_components/VentaFormDialog";
import DeleteConfirmDialog from "./_components/DeleteConfirmDialog";
import VentaViewDialog from "./_components/VentaViewDialog";

export default function VentasPage() {
  const {
    ventas,
    loading,
    fetchDetallesPorVenta,
    crearVenta,
    actualizarVenta,
    eliminarVenta,
  } = useVentas();

  const { toast } = useToast();
  const { clientes, fetchClienteById } = useClientes();
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [detallesPorVenta, setDetallesPorVenta] = useState({});
  const [clientesPorVenta, setClientesPorVenta] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    cargarDetalles();
  }, [ventas]);

  const cargarDetalles = async () => {
    const promises = ventas.map(async (venta) => {
      const [detalles, cliente] = await Promise.all([
        fetchDetallesPorVenta(venta.id_venta),
        fetchClienteById(venta.id_cliente),
      ]);
      return { id: venta.id_venta, detalles, cliente };
    });

    const resultados = await Promise.all(promises);
    const detallesMap = {};
    const clientesMap = {};

    resultados.forEach(({ id, detalles, cliente }) => {
      detallesMap[id] = detalles;
      clientesMap[id] = cliente;
    });

    setDetallesPorVenta(detallesMap);
    setClientesPorVenta(clientesMap);
  };

  const filteredVentas = ventas
    .filter((v) => {
      const detalles = detallesPorVenta[v.id_venta] || [];
      const cliente = clientesPorVenta[v.id_venta];
      const equipoNombres = detalles
        .map((d) => d.equipo?.nombre_equipo || "")
        .join(" ");
      const clienteNombre = cliente?.nombre_institucion || "";
      return (
        v.estado_venta.toLowerCase().includes(search.toLowerCase()) ||
        equipoNombres.toLowerCase().includes(search.toLowerCase()) ||
        clienteNombre.toLowerCase().includes(search.toLowerCase()) ||
        v.id_venta.toString().includes(search)
      );
    })
    .sort((a, b) => a.id_venta - b.id_venta);

  const handleNueva = () => {
    setVentaSeleccionada(null);
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleVer = (venta) => {
    setVentaSeleccionada({
      ...venta,
      detalles: detallesPorVenta[venta.id_venta] || [],
    });
    setViewDialogOpen(true);
  };

  const handleEditar = (venta) => {
    setVentaSeleccionada({
      ...venta,
      detalles: detallesPorVenta[venta.id_venta] || [],
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleEliminar = (venta) => {
    setVentaSeleccionada(venta);
    setDeleteDialogOpen(true);
  };

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
    return (
      colors[estado] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
    );
  };

  const totalVentas = ventas.reduce(
    (sum, v) => sum + parseFloat(v.monto_total || 0),
    0
  );
  const ventasEntregadas = ventas
    .filter((v) => v.estado_venta === "Entregada")
    .reduce((sum, v) => sum + parseFloat(v.monto_total || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ventas de Equipos Biomédicos</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona las ventas de equipos médicos a clientes
          </p>
        </div>
        <Button className="gap-2" onClick={handleNueva}>
          <Plus className="w-4 h-4" />
          Nueva Venta
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
          <p className="text-sm text-muted-foreground">Total en Ventas</p>
          <p className="text-3xl font-bold mt-2">
            Bs. {totalVentas.toFixed(2)}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Ventas Entregadas</p>
          <p className="text-3xl font-bold mt-2 text-green-600 dark:text-green-400">
            Bs. {ventasEntregadas.toFixed(2)}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Número de Ventas</p>
          <p className="text-3xl font-bold mt-2">{ventas.length}</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Spinner className="w-6 h-6" />
          </div>
        ) : filteredVentas.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No se encontraron ventas
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    N°
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Fecha Venta
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
                {filteredVentas.map((v, index) => {
                  const detalles = detallesPorVenta[v.id_venta] || [];
                  const cliente = clientesPorVenta[v.id_venta];
                  return (
                    <tr
                      key={v.id_venta}
                      className="hover:bg-secondary/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {cliente?.nombre_institucion ||
                          `Cliente #${v.id_cliente}`}
                      </td>
                      <td className="px-6 py-4 text-sm">{v.fecha_venta}</td>
                      <td className="px-6 py-4 text-sm font-medium">
                        Bs. {parseFloat(v.monto_total || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                            v.estado_venta
                          )}`}
                        >
                          {v.estado_venta}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => handleVer(v)}
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => handleEditar(v)}
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 text-destructive"
                            onClick={() => handleEliminar(v)}
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

      <VentaFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        venta={ventaSeleccionada}
        onSubmit={async (payload) => {
          setIsSaving(true);
          try {
            if (ventaSeleccionada) {
              await actualizarVenta(ventaSeleccionada.id_venta, payload);
              toast({
                title: "Éxito",
                description: "Venta actualizada correctamente",
              });
            } else {
              await crearVenta(payload);
              toast({
                title: "Éxito",
                description: "Venta creada correctamente",
              });
            }
            setDialogOpen(false);
          } catch (error) {
            toast({
              title: "Error",
              description: error.message || "Error al guardar la venta",
              variant: "destructive",
            });
          } finally {
            setIsSaving(false);
          }
        }}
        loading={isSaving}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={async () => {
          setIsSaving(true);
          try {
            await eliminarVenta(ventaSeleccionada.id_venta);
            toast({
              title: "Éxito",
              description: "Venta eliminada correctamente",
            });
            setDeleteDialogOpen(false);
          } catch (error) {
            toast({
              title: "Error",
              description: error.message || "Error al eliminar la venta",
              variant: "destructive",
            });
          } finally {
            setIsSaving(false);
          }
        }}
        loading={isSaving}
      />

      <VentaViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        venta={ventaSeleccionada}
        cliente={
          ventaSeleccionada
            ? clientesPorVenta[ventaSeleccionada.id_venta]
            : null
        }
      />
    </div>
  );
}
