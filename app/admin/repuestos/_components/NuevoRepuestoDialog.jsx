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
import { Plus } from "lucide-react";
import useFetch from "@/hooks/useFetch";

const API_URL = "https://backend-edwin.onrender.com";

export default function NuevoRepuestoDialog({
  open,
  onOpenChange,
  repuesto,
  isEditing,
  tecnologias,
  onSubmit,
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    stock: "",
    stock_minimo: "",
    id_tecnologia: "",
  });

  const [showNewTecnologia, setShowNewTecnologia] = useState(false);
  const [nuevaTecnologia, setNuevaTecnologia] = useState({
    nombre: "",
    descripcion: "",
  });

  const { post } = useFetch("https://backend-edwin.onrender.com");

  useEffect(() => {
    if (repuesto && isEditing) {
      setFormData({
        nombre: repuesto.nombre || "",
        stock: repuesto.stock?.toString() || "",
        stock_minimo: repuesto.stock_minimo?.toString() || "",
        id_tecnologia: repuesto.id_tecnologia?.toString() || "",
      });
    } else {
      setFormData({
        nombre: "",
        stock: "",
        stock_minimo: "",
        id_tecnologia: "",
      });
    }
    setShowNewTecnologia(false);
    setNuevaTecnologia({ nombre: "", descripcion: "" });
  }, [repuesto, isEditing, open]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTecnologiaChange = (value) => {
    if (value === "nuevo") {
      setShowNewTecnologia(true);
      setFormData((prev) => ({ ...prev, id_tecnologia: "" }));
    } else {
      setShowNewTecnologia(false);
      setFormData((prev) => ({ ...prev, id_tecnologia: value }));
    }
  };

  const handleCrearTecnologia = async () => {
    if (!nuevaTecnologia.nombre.trim()) return;

    try {
      const { data, error } = await post("/tipos-tecnologia/", {
        nombre_tecnologia: nuevaTecnologia.nombre,
        descripcion: nuevaTecnologia.descripcion,
      });

      if (data && !error && data.id_tecnologia) {
        setFormData((prev) => ({
          ...prev,
          id_tecnologia: data.id_tecnologia.toString(),
        }));
        setShowNewTecnologia(false);
        setNuevaTecnologia({ nombre: "", descripcion: "" });
        // Recargar catálogos
        window.location.reload();
      }
    } catch (error) {}
  };

  const handleSubmit = () => {
    const payload = {
      nombre: formData.nombre,
      stock: parseInt(formData.stock),
      stock_minimo: parseInt(formData.stock_minimo),
      id_tecnologia: parseInt(formData.id_tecnologia),
    };

    onSubmit(payload);
  };

  const isFormValid = () => {
    return (
      formData.nombre.trim() &&
      formData.stock !== "" &&
      formData.stock_minimo !== "" &&
      formData.id_tecnologia !== ""
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Repuesto" : "Nuevo Repuesto"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre del Repuesto *</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              placeholder="Ej: Filtro de aire HEPA"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stock">Stock Actual *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleChange("stock", e.target.value)}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="stock_minimo">Stock Mínimo *</Label>
              <Input
                id="stock_minimo"
                type="number"
                min="0"
                value={formData.stock_minimo}
                onChange={(e) => handleChange("stock_minimo", e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="id_tecnologia">Tecnología *</Label>
            {!showNewTecnologia ? (
              <Select
                value={formData.id_tecnologia}
                onValueChange={handleTecnologiaChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tecnología" />
                </SelectTrigger>
                <SelectContent>
                  {(tecnologias || []).map((tecnologia) => (
                    <SelectItem
                      key={tecnologia.id_tecnologia}
                      value={tecnologia.id_tecnologia.toString()}
                    >
                      {tecnologia.nombre_tecnologia}
                    </SelectItem>
                  ))}
                  <SelectItem value="nuevo">+ Nueva Tecnología</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="space-y-2 p-4 border rounded-lg">
                <div>
                  <Label htmlFor="nueva_tecnologia">
                    Nombre de la Tecnología
                  </Label>
                  <Input
                    id="nueva_tecnologia"
                    value={nuevaTecnologia.nombre}
                    onChange={(e) =>
                      setNuevaTecnologia((prev) => ({
                        ...prev,
                        nombre: e.target.value,
                      }))
                    }
                    placeholder="Ej: Electrónica"
                  />
                </div>
                <div>
                  <Label htmlFor="descripcion_tecnologia">Descripción</Label>
                  <Input
                    id="descripcion_tecnologia"
                    value={nuevaTecnologia.descripcion}
                    onChange={(e) =>
                      setNuevaTecnologia((prev) => ({
                        ...prev,
                        descripcion: e.target.value,
                      }))
                    }
                    placeholder="Descripción opcional"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleCrearTecnologia}
                    disabled={!nuevaTecnologia.nombre.trim()}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Crear
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowNewTecnologia(false);
                      setNuevaTecnologia({ nombre: "", descripcion: "" });
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!isFormValid()}>
            {isEditing ? "Actualizar" : "Crear"} Repuesto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
