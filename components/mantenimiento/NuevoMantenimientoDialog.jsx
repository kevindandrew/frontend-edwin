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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function NuevoMantenimientoDialog({
  open,
  onOpenChange,
  mantenimiento,
  isEditing,
  equipos,
  tecnicos,
  repuestos,
  onSubmit,
}) {
  const [formData, setFormData] = useState({
    id_equipo: "",
    tipo_mantenimiento: "Preventivo",
    fecha_programada: "",
    fecha_realizacion: "",
    descripcion_trabajo: "",
    costo_total: "",
    id_tecnico: "",
  });

  const [repuestosUsados, setRepuestosUsados] = useState([]);
  const [nuevoRepuesto, setNuevoRepuesto] = useState({
    id_repuesto: "",
    cantidad_usada: "",
  });

  useEffect(() => {
    if (mantenimiento && isEditing) {
      setFormData({
        id_equipo: mantenimiento.id_equipo?.toString() || "",
        tipo_mantenimiento: mantenimiento.tipo_mantenimiento || "Preventivo",
        fecha_programada: mantenimiento.fecha_programada || "",
        fecha_realizacion: mantenimiento.fecha_realizacion || "",
        descripcion_trabajo: mantenimiento.descripcion_trabajo || "",
        costo_total: mantenimiento.costo_total?.toString() || "",
        id_tecnico: mantenimiento.id_tecnico?.toString() || "",
      });
      // Cargar repuestos usados si es edición y mapear correctamente
      if (
        mantenimiento.repuestos_usados &&
        mantenimiento.repuestos_usados.length > 0
      ) {
        const repuestosMapeados = mantenimiento.repuestos_usados.map((r) => ({
          id_repuesto: r.id_repuesto,
          cantidad_usada: r.cantidad_usada,
          nombre: r.repuesto?.nombre || "N/A",
          stock: r.repuesto?.stock || 0,
        }));
        setRepuestosUsados(repuestosMapeados);
      } else {
        setRepuestosUsados([]);
      }
    } else {
      setFormData({
        id_equipo: "",
        tipo_mantenimiento: "Preventivo",
        fecha_programada: "",
        fecha_realizacion: "",
        descripcion_trabajo: "",
        costo_total: "",
        id_tecnico: "",
      });
      setRepuestosUsados([]);
    }
    setNuevoRepuesto({ id_repuesto: "", cantidad_usada: "" });
  }, [mantenimiento, isEditing, open]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAgregarRepuesto = () => {
    if (nuevoRepuesto.id_repuesto && nuevoRepuesto.cantidad_usada) {
      const repuesto = repuestos.find(
        (r) => r.id_repuesto === parseInt(nuevoRepuesto.id_repuesto)
      );

      // Verificar si ya existe
      const existe = repuestosUsados.find(
        (r) => r.id_repuesto === parseInt(nuevoRepuesto.id_repuesto)
      );

      if (!existe && repuesto) {
        setRepuestosUsados([
          ...repuestosUsados,
          {
            id_repuesto: parseInt(nuevoRepuesto.id_repuesto),
            cantidad_usada: parseInt(nuevoRepuesto.cantidad_usada),
            nombre: repuesto.nombre,
            stock: repuesto.stock,
          },
        ]);
        setNuevoRepuesto({ id_repuesto: "", cantidad_usada: "" });
      }
    }
  };

  const handleEliminarRepuesto = (idRepuesto) => {
    setRepuestosUsados(
      repuestosUsados.filter((r) => r.id_repuesto !== idRepuesto)
    );
  };

  const handleSubmit = () => {
    const payload = {
      id_equipo: parseInt(formData.id_equipo),
      tipo_mantenimiento: formData.tipo_mantenimiento,
      fecha_programada: formData.fecha_programada,
      fecha_realizacion: formData.fecha_realizacion || null,
      descripcion_trabajo: formData.descripcion_trabajo,
      costo_total: formData.costo_total,
      id_tecnico: parseInt(formData.id_tecnico),
      repuestos_usados: repuestosUsados.map((r) => ({
        id_repuesto: r.id_repuesto,
        cantidad_usada: r.cantidad_usada,
      })),
    };

    onSubmit(payload);
  };

  const isFormValid = () => {
    return (
      formData.id_equipo &&
      formData.tipo_mantenimiento &&
      formData.fecha_programada &&
      formData.descripcion_trabajo.trim() &&
      formData.costo_total !== "" &&
      formData.id_tecnico
    );
  };

  const obtenerRepuestosDisponibles = () => {
    return repuestos.filter(
      (r) => !repuestosUsados.find((ru) => ru.id_repuesto === r.id_repuesto)
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Mantenimiento" : "Nuevo Mantenimiento"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {/* Equipo */}
          <div className="space-y-2">
            <Label htmlFor="id_equipo">Equipo *</Label>
            <Select
              value={formData.id_equipo}
              onValueChange={(value) => handleChange("id_equipo", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar equipo" />
              </SelectTrigger>
              <SelectContent>
                {equipos.map((equipo) => (
                  <SelectItem
                    key={equipo.id_equipo}
                    value={equipo.id_equipo.toString()}
                  >
                    {equipo.nombre_equipo || equipo.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tipo de Mantenimiento */}
          <div className="space-y-2">
            <Label htmlFor="tipo_mantenimiento">Tipo de Mantenimiento *</Label>
            <Select
              value={formData.tipo_mantenimiento}
              onValueChange={(value) =>
                handleChange("tipo_mantenimiento", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Preventivo">Preventivo</SelectItem>
                <SelectItem value="Correctivo">Correctivo</SelectItem>
                <SelectItem value="Calibración">Calibración</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fecha Programada */}
          <div className="space-y-2">
            <Label htmlFor="fecha_programada">Fecha Programada *</Label>
            <Input
              id="fecha_programada"
              type="date"
              value={formData.fecha_programada}
              onChange={(e) => handleChange("fecha_programada", e.target.value)}
            />
          </div>

          {/* Fecha Realización */}
          <div className="space-y-2">
            <Label htmlFor="fecha_realizacion">Fecha Realización</Label>
            <Input
              id="fecha_realizacion"
              type="date"
              value={formData.fecha_realizacion}
              onChange={(e) =>
                handleChange("fecha_realizacion", e.target.value)
              }
            />
          </div>

          {/* Técnico */}
          <div className="space-y-2">
            <Label htmlFor="id_tecnico">Técnico Responsable *</Label>
            <Select
              value={formData.id_tecnico}
              onValueChange={(value) => handleChange("id_tecnico", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar técnico" />
              </SelectTrigger>
              <SelectContent>
                {tecnicos.map((tecnico) => (
                  <SelectItem
                    key={tecnico.id_usuario}
                    value={tecnico.id_usuario.toString()}
                  >
                    {tecnico.nombre_completo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Costo Total */}
          <div className="space-y-2">
            <Label htmlFor="costo_total">Costo Total (Bs.) *</Label>
            <Input
              id="costo_total"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.costo_total}
              onChange={(e) => handleChange("costo_total", e.target.value)}
            />
          </div>

          {/* Descripción del Trabajo */}
          <div className="col-span-2 space-y-2">
            <Label htmlFor="descripcion_trabajo">
              Descripción del Trabajo *
            </Label>
            <Textarea
              id="descripcion_trabajo"
              rows={3}
              placeholder="Describe el trabajo realizado o a realizar..."
              value={formData.descripcion_trabajo}
              onChange={(e) =>
                handleChange("descripcion_trabajo", e.target.value)
              }
            />
          </div>

          {/* Repuestos Usados */}
          <div className="col-span-2 space-y-4 border-t pt-4">
            <h3 className="font-semibold">Repuestos Utilizados</h3>

            {/* Lista de repuestos agregados */}
            {repuestosUsados.length > 0 && (
              <div className="space-y-2">
                {repuestosUsados.map((repuesto) => (
                  <div
                    key={repuesto.id_repuesto}
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{repuesto.nombre}</span>
                      <Badge variant="outline">
                        Cantidad: {repuesto.cantidad_usada}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Stock disponible: {repuesto.stock}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() =>
                        handleEliminarRepuesto(repuesto.id_repuesto)
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Agregar nuevo repuesto */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Select
                  value={nuevoRepuesto.id_repuesto}
                  onValueChange={(value) =>
                    setNuevoRepuesto((prev) => ({
                      ...prev,
                      id_repuesto: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar repuesto" />
                  </SelectTrigger>
                  <SelectContent>
                    {obtenerRepuestosDisponibles().map((repuesto) => (
                      <SelectItem
                        key={repuesto.id_repuesto}
                        value={repuesto.id_repuesto.toString()}
                      >
                        {repuesto.nombre} (Stock: {repuesto.stock})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-32">
                <Input
                  type="number"
                  placeholder="Cantidad"
                  min="1"
                  value={nuevoRepuesto.cantidad_usada}
                  onChange={(e) =>
                    setNuevoRepuesto((prev) => ({
                      ...prev,
                      cantidad_usada: e.target.value,
                    }))
                  }
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleAgregarRepuesto}
                disabled={
                  !nuevoRepuesto.id_repuesto || !nuevoRepuesto.cantidad_usada
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
