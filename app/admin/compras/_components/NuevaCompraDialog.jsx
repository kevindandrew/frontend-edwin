"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import useEquipos from "@/hooks/useEquipos";
import useRepuestos from "@/hooks/useRepuestos";

export default function NuevaCompraDialog({
  open,
  onOpenChange,
  compra,
  isEditing,
  onSubmit,
}) {
  const { equipos } = useEquipos();
  const { repuestos } = useRepuestos();

  const [formData, setFormData] = useState({
    fecha_solicitud: "",
    fecha_aprobacion: "",
    monto_total: "",
    estado_compra: "Solicitada",
  });

  const [detalles, setDetalles] = useState([]);
  const [nuevoDetalle, setNuevoDetalle] = useState({
    tipo: "equipo",
    id_item: "",
    cantidad: "",
    precio_unitario: "",
  });

  useEffect(() => {
    if (compra && isEditing) {
      setFormData({
        fecha_solicitud: compra.fecha_solicitud || "",
        fecha_aprobacion: compra.fecha_aprobacion || "",
        monto_total: compra.monto_total?.toString() || "",
        estado_compra: compra.estado_compra || "Solicitada",
      });
      if (compra.detalles && compra.detalles.length > 0) {
        const detallesMapeados = compra.detalles.map((d) => ({
          tipo: d.id_equipo ? "equipo" : "repuesto",
          id_item: d.id_equipo || d.id_repuesto,
          cantidad: d.cantidad,
          precio_unitario: d.precio_unitario,
          nombre: d.equipo?.nombre_equipo || d.repuesto?.nombre || "N/A",
        }));
        setDetalles(detallesMapeados);
      } else {
        setDetalles([]);
      }
    } else {
      setFormData({
        fecha_solicitud: new Date().toISOString().split("T")[0],
        fecha_aprobacion: "",
        monto_total: "",
        estado_compra: "Solicitada",
      });
      setDetalles([]);
    }
    setNuevoDetalle({
      tipo: "equipo",
      id_item: "",
      cantidad: "",
      precio_unitario: "",
    });
  }, [compra, isEditing, open]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAgregarDetalle = () => {
    if (
      nuevoDetalle.id_item &&
      nuevoDetalle.cantidad &&
      nuevoDetalle.precio_unitario
    ) {
      const item =
        nuevoDetalle.tipo === "equipo"
          ? equipos.find((e) => e.id_equipo === parseInt(nuevoDetalle.id_item))
          : repuestos.find(
              (r) => r.id_repuesto === parseInt(nuevoDetalle.id_item)
            );

      const existe = detalles.find(
        (d) => d.id_item === parseInt(nuevoDetalle.id_item)
      );

      if (!existe && item) {
        setDetalles([
          ...detalles,
          {
            tipo: nuevoDetalle.tipo,
            id_item: parseInt(nuevoDetalle.id_item),
            cantidad: parseInt(nuevoDetalle.cantidad),
            precio_unitario: parseFloat(nuevoDetalle.precio_unitario),
            nombre:
              nuevoDetalle.tipo === "equipo" ? item.nombre_equipo : item.nombre,
          },
        ]);
        setNuevoDetalle({
          tipo: "equipo",
          id_item: "",
          cantidad: "",
          precio_unitario: "",
        });
      }
    }
  };

  const handleEliminarDetalle = (idItem) => {
    setDetalles(detalles.filter((d) => d.id_item !== idItem));
  };

  const calcularTotal = () => {
    return detalles.reduce((sum, d) => sum + d.cantidad * d.precio_unitario, 0);
  };

  const handleSubmit = () => {
    const payload = {
      fecha_solicitud: formData.fecha_solicitud,
      fecha_aprobacion: formData.fecha_aprobacion || null,
      monto_total: calcularTotal(),
      estado_compra: formData.estado_compra,
      detalles: detalles.map((d) => ({
        id_equipo: d.tipo === "equipo" ? d.id_item : null,
        id_repuesto: d.tipo === "repuesto" ? d.id_item : null,
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario,
      })),
    };

    onSubmit(payload);
  };

  const isFormValid = () => {
    return (
      formData.fecha_solicitud && formData.estado_compra && detalles.length > 0
    );
  };

  const obtenerItemsDisponibles = () => {
    const items =
      nuevoDetalle.tipo === "equipo"
        ? equipos.map((e) => ({
            id: e.id_equipo,
            nombre: e.nombre_equipo || e.nombre,
          }))
        : repuestos.map((r) => ({ id: r.id_repuesto, nombre: r.nombre }));

    return items.filter((item) => !detalles.find((d) => d.id_item === item.id));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Compra" : "Nueva Compra"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {/* Fecha Solicitud */}
          <div className="space-y-2">
            <Label htmlFor="fecha_solicitud">Fecha Solicitud *</Label>
            <Input
              id="fecha_solicitud"
              type="date"
              value={formData.fecha_solicitud}
              onChange={(e) => handleChange("fecha_solicitud", e.target.value)}
            />
          </div>

          {/* Fecha Aprobación */}
          <div className="space-y-2">
            <Label htmlFor="fecha_aprobacion">Fecha Aprobación</Label>
            <Input
              id="fecha_aprobacion"
              type="date"
              value={formData.fecha_aprobacion}
              onChange={(e) => handleChange("fecha_aprobacion", e.target.value)}
            />
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <Label htmlFor="estado_compra">Estado *</Label>
            <Select
              value={formData.estado_compra}
              onValueChange={(value) => handleChange("estado_compra", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Solicitada">Solicitada</SelectItem>
                <SelectItem value="Aprobada">Aprobada</SelectItem>
                <SelectItem value="Completada">Completada</SelectItem>
                <SelectItem value="Cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Total Calculado */}
          <div className="space-y-2">
            <Label>Monto Total (Bs.)</Label>
            <Input
              type="text"
              value={`Bs. ${calcularTotal().toFixed(2)}`}
              disabled
              className="bg-secondary"
            />
          </div>

          {/* Detalles de Compra */}
          <div className="col-span-2 space-y-4 border-t pt-4">
            <h3 className="font-semibold">Items de Compra</h3>

            {/* Lista de detalles agregados */}
            {detalles.length > 0 && (
              <div className="space-y-2">
                {detalles.map((detalle) => (
                  <div
                    key={detalle.id_item}
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          detalle.tipo === "equipo" ? "default" : "outline"
                        }
                      >
                        {detalle.tipo === "equipo" ? "Equipo" : "Repuesto"}
                      </Badge>
                      <span className="font-medium">{detalle.nombre}</span>
                      <Badge variant="outline">
                        Cantidad: {detalle.cantidad}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Bs. {detalle.precio_unitario} c/u
                      </span>
                      <span className="text-sm font-semibold">
                        Total: Bs.{" "}
                        {(detalle.cantidad * detalle.precio_unitario).toFixed(
                          2
                        )}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleEliminarDetalle(detalle.id_item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Agregar nuevo detalle */}
            <div className="flex gap-2">
              <div className="w-32">
                <Select
                  value={nuevoDetalle.tipo}
                  onValueChange={(value) =>
                    setNuevoDetalle((prev) => ({
                      ...prev,
                      tipo: value,
                      id_item: "",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equipo">Equipo</SelectItem>
                    <SelectItem value="repuesto">Repuesto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select
                  value={nuevoDetalle.id_item}
                  onValueChange={(value) =>
                    setNuevoDetalle((prev) => ({
                      ...prev,
                      id_item: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar item" />
                  </SelectTrigger>
                  <SelectContent>
                    {obtenerItemsDisponibles().map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-24">
                <Input
                  type="number"
                  placeholder="Cant."
                  min="1"
                  value={nuevoDetalle.cantidad}
                  onChange={(e) =>
                    setNuevoDetalle((prev) => ({
                      ...prev,
                      cantidad: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="w-32">
                <Input
                  type="number"
                  placeholder="Precio"
                  step="0.01"
                  min="0"
                  value={nuevoDetalle.precio_unitario}
                  onChange={(e) =>
                    setNuevoDetalle((prev) => ({
                      ...prev,
                      precio_unitario: e.target.value,
                    }))
                  }
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleAgregarDetalle}
                disabled={
                  !nuevoDetalle.id_item ||
                  !nuevoDetalle.cantidad ||
                  !nuevoDetalle.precio_unitario
                }
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!isFormValid()}>
            {isEditing ? "Actualizar" : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
