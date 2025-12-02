"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, FileText, Trash2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCompras from "@/hooks/useCompras";
import useEquipos from "@/hooks/useEquipos";
import useRepuestos from "@/hooks/useRepuestos";

export default function SolicitudesPage() {
  const { toast } = useToast();
  const {
    compras,
    loading: comprasLoading,
    fetchCompras,
    crearCompra,
    crearDetalleCompra,
    fetchDetallesPorCompra,
  } = useCompras();
  const {
    equipos,
    loading: equiposLoading,
    error: equiposError,
  } = useEquipos();
  const {
    repuestos,
    loading: repuestosLoading,
    error: repuestosError,
  } = useRepuestos();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [detallesDialog, setDetallesDialog] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState(null);
  const [compraDetalles, setCompraDetalles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [newItem, setNewItem] = useState({
    tipo: "repuesto",
    id_item: "",
    cantidad: 1,
    precio_estimado: 0,
  });
  const [itemsSolicitud, setItemsSolicitud] = useState([]);

  useEffect(() => {
    fetchCompras();
  }, []);

  const solicitudes = compras.filter(
    (c) => c.estado_compra === "Solicitada" || c.estado_compra === "Pendiente"
  );

  const handleAddItem = () => {
    if (!newItem.id_item) {
      toast({
        title: "Falta información",
        description: "Por favor selecciona un item.",
        variant: "destructive",
      });
      return;
    }
    if (!newItem.cantidad || newItem.cantidad <= 0) {
      toast({
        title: "Cantidad inválida",
        description: "La cantidad debe ser mayor a 0.",
        variant: "destructive",
      });
      return;
    }

    const itemData =
      newItem.tipo === "equipo"
        ? equipos.find((e) => e.id_equipo.toString() === newItem.id_item)
        : repuestos.find((r) => r.id_repuesto.toString() === newItem.id_item);

    if (itemData) {
      setItemsSolicitud([
        ...itemsSolicitud,
        {
          ...newItem,
          nombre:
            newItem.tipo === "equipo"
              ? itemData.nombre_equipo
              : itemData.nombre || itemData.nombre_repuesto,
        },
      ]);
      setNewItem({
        tipo: "repuesto",
        id_item: "",
        cantidad: 1,
        precio_estimado: 0,
      });
    } else {
      toast({
        title: "Error",
        description: "No se encontró el item seleccionado.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveItem = (index) => {
    const newItems = [...itemsSolicitud];
    newItems.splice(index, 1);
    setItemsSolicitud(newItems);
  };

  const handleCreate = async () => {
    if (itemsSolicitud.length === 0) {
      toast({
        title: "Error",
        description: "Debes agregar al menos un item a la solicitud.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Crear la compra (cabecera)
      const montoTotal = itemsSolicitud.reduce(
        (acc, item) => acc + item.cantidad * item.precio_estimado,
        0
      );

      const nuevaCompra = await crearCompra({
        fecha_solicitud: new Date().toISOString().split("T")[0],
        fecha_aprobacion: null,
        monto_total: montoTotal,
        estado_compra: "Solicitada",
      });

      if (!nuevaCompra || !nuevaCompra.id_compra) {
        throw new Error("No se pudo crear la cabecera de la compra");
      }

      // 2. Crear los detalles
      for (const item of itemsSolicitud) {
        await crearDetalleCompra({
          id_compra: nuevaCompra.id_compra,
          id_equipo: item.tipo === "equipo" ? parseInt(item.id_item) : null,
          id_repuesto: item.tipo === "repuesto" ? parseInt(item.id_item) : null,
          cantidad: parseInt(item.cantidad),
          precio_unitario: parseFloat(item.precio_estimado || 0),
        });
      }

      toast({
        title: "Solicitud creada",
        description: "La solicitud ha sido registrada exitosamente.",
      });
      setDialogOpen(false);
      setItemsSolicitud([]);
      fetchCompras(); // Recargar lista
    } catch (error) {
      console.error("Error creando solicitud:", error);
      toast({
        title: "Error",
        description:
          "Ocurrió un error al procesar la solicitud. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerDetalles = async (compra) => {
    setSelectedCompra(compra);
    setCompraDetalles([]); // Limpiar previos
    setDetallesDialog(true);
    const detalles = await fetchDetallesPorCompra(compra.id_compra);
    setCompraDetalles(detalles);
  };

  const getItemsDisponibles = () => {
    if (newItem.tipo === "equipo") {
      return equipos
        ? equipos.map((e) => ({ id: e.id_equipo, nombre: e.nombre_equipo }))
        : [];
    } else {
      return repuestos
        ? repuestos.map((r) => ({
            id: r.id_repuesto,
            nombre: r.nombre || r.nombre_repuesto,
          }))
        : [];
    }
  };

  if (comprasLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Solicitudes de Compra</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona las requisiciones y órdenes de compra.
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Solicitud
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Fecha Solicitud</TableHead>
              <TableHead>Monto Estimado</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {solicitudes.length > 0 ? (
              solicitudes.map((sol) => (
                <TableRow key={sol.id_compra}>
                  <TableCell className="font-medium">
                    #{sol.id_compra}
                  </TableCell>
                  <TableCell>{sol.fecha_solicitud}</TableCell>
                  <TableCell>
                    Bs. {parseFloat(sol.monto_total).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{sol.estado_compra}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVerDetalles(sol)}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <FileText className="w-10 h-10" />
                    <p>No hay solicitudes pendientes.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog Nueva Solicitud */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nueva Solicitud de Compra</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {equiposLoading || repuestosLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : equiposError || repuestosError ? (
              <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-md">
                <p className="font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Error cargando datos
                </p>
                {equiposError && <p>Equipos: {equiposError}</p>}
                {repuestosError && <p>Repuestos: {repuestosError}</p>}
              </div>
            ) : (
              <>
                <div className="flex gap-2 items-end flex-wrap">
                  <div className="w-32">
                    <Label>Tipo</Label>
                    <Select
                      value={newItem.tipo}
                      onValueChange={(v) =>
                        setNewItem({ ...newItem, tipo: v, id_item: "" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="repuesto">Repuesto</SelectItem>
                        <SelectItem value="equipo">Equipo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <Label>Item</Label>
                    <Select
                      value={newItem.id_item}
                      onValueChange={(v) =>
                        setNewItem({ ...newItem, id_item: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        {getItemsDisponibles().length > 0 ? (
                          getItemsDisponibles().map((item) => (
                            <SelectItem
                              key={item.id}
                              value={item.id.toString()}
                            >
                              {item.nombre}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            No hay items ({newItem.tipo})
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Disponibles: {getItemsDisponibles().length} (
                      {newItem.tipo === "equipo"
                        ? `Equipos: ${equipos?.length || 0}`
                        : `Repuestos: ${repuestos?.length || 0}`}
                      )
                    </p>
                  </div>
                  <div className="w-20">
                    <Label>Cant.</Label>
                    <Input
                      type="number"
                      min="1"
                      value={newItem.cantidad}
                      onChange={(e) =>
                        setNewItem({ ...newItem, cantidad: e.target.value })
                      }
                    />
                  </div>
                  <div className="w-24">
                    <Label>Precio Est.</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newItem.precio_estimado}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          precio_estimado: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button
                    onClick={handleAddItem}
                    size="icon"
                    className="mb-[2px]"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Lista de items agregados */}
                <div className="border rounded-md p-2 min-h-[100px] space-y-2 bg-muted/20">
                  {itemsSolicitud.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-24 text-muted-foreground text-sm">
                      <AlertCircle className="w-6 h-6 mb-1 opacity-50" />
                      <p>Agrega items a la solicitud</p>
                    </div>
                  )}
                  {itemsSolicitud.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-background p-2 rounded border shadow-sm"
                    >
                      <span className="text-sm">
                        <span className="font-bold">{item.cantidad}x</span>{" "}
                        {item.nombre}
                        <span className="text-muted-foreground ml-2">
                          (Bs. {item.precio_estimado})
                        </span>
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemoveItem(idx)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end text-sm font-bold">
                  Total Estimado: Bs.{" "}
                  {itemsSolicitud
                    .reduce(
                      (acc, item) => acc + item.cantidad * item.precio_estimado,
                      0
                    )
                    .toFixed(2)}
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isSubmitting || itemsSolicitud.length === 0}
            >
              {isSubmitting ? <Spinner className="mr-2 h-4 w-4" /> : null}
              Registrar Solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Detalles */}
      <Dialog open={detallesDialog} onOpenChange={setDetallesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Detalles de Solicitud #{selectedCompra?.id_compra}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold">Fecha:</span>{" "}
                {selectedCompra?.fecha_solicitud}
              </div>
              <div>
                <span className="font-semibold">Estado:</span>{" "}
                {selectedCompra?.estado_compra}
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Cant.</TableHead>
                  <TableHead className="text-right">Precio Unit.</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {compraDetalles.length > 0 ? (
                  compraDetalles.map((d, index) => (
                    <TableRow key={d.id_detalle_compra || index}>
                      <TableCell>
                        {d.equipo?.nombre_equipo ||
                          d.repuesto?.nombre ||
                          d.repuesto?.nombre_repuesto ||
                          "N/A"}
                      </TableCell>
                      <TableCell>{d.cantidad}</TableCell>
                      <TableCell className="text-right">
                        Bs. {d.precio_unitario}
                      </TableCell>
                      <TableCell className="text-right">
                        Bs. {(d.cantidad * d.precio_unitario).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground"
                    >
                      Cargando detalles...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
