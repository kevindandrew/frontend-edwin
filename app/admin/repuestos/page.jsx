"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import useRepuestos from "@/hooks/useRepuestos";
import useCatalogos from "@/hooks/useCatalogos";
import RepuestosTable from "@/components/repuestos/RepuestosTable";
import NuevoRepuestoDialog from "@/components/repuestos/NuevoRepuestoDialog";
import DeleteRepuestoDialog from "@/components/repuestos/DeleteRepuestoDialog";

export default function RepuestosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [repuestoSeleccionado, setRepuestoSeleccionado] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [repuestosStockBajo, setRepuestosStockBajo] = useState([]);

  const {
    repuestos,
    loading,
    fetchRepuestosStockBajo,
    crearRepuesto,
    actualizarRepuesto,
    eliminarRepuesto,
  } = useRepuestos();

  const { tecnologias, loading: catalogosLoading } = useCatalogos();

  useEffect(() => {
    cargarRepuestosStockBajo();
  }, [repuestos]);

  const cargarRepuestosStockBajo = async () => {
    const stockBajo = await fetchRepuestosStockBajo();
    setRepuestosStockBajo(stockBajo);
  };

  const handleNuevoRepuesto = () => {
    setRepuestoSeleccionado(null);
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleEditarRepuesto = (repuesto) => {
    setRepuestoSeleccionado(repuesto);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleEliminarRepuesto = (repuesto) => {
    setRepuestoSeleccionado(repuesto);
    setDeleteDialogOpen(true);
  };

  const handleSubmitRepuesto = async (repuesto) => {
    try {
      if (isEditing) {
        await actualizarRepuesto(repuestoSeleccionado.id_repuesto, repuesto);
      } else {
        await crearRepuesto(repuesto);
      }
      setDialogOpen(false);
      setRepuestoSeleccionado(null);
    } catch (error) {}
  };

  const handleConfirmDelete = async () => {
    try {
      await eliminarRepuesto(repuestoSeleccionado.id_repuesto);
      setDeleteDialogOpen(false);
      setRepuestoSeleccionado(null);
    } catch (error) {}
  };

  const repuestosFiltrados = repuestos.filter((repuesto) =>
    repuesto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Repuestos</h1>
          <p className="text-muted-foreground">
            Administra el inventario de repuestos
          </p>
        </div>
        <Button onClick={handleNuevoRepuesto}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Repuesto
        </Button>
      </div>

      {/* Alerta de Stock Bajo */}
      {repuestosStockBajo.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Repuestos con Stock Bajo</AlertTitle>
          <AlertDescription>
            Hay {repuestosStockBajo.length} repuesto(s) con stock por debajo del
            mínimo:
            <ul className="list-disc list-inside mt-2">
              {repuestosStockBajo.map((repuesto) => (
                <li key={repuesto.id_repuesto}>
                  <strong>{repuesto.nombre}</strong> - Stock: {repuesto.stock}{" "}
                  (Mínimo: {repuesto.stock_minimo})
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Buscador */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar repuesto por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabla de Repuestos */}
      <RepuestosTable
        repuestos={repuestosFiltrados}
        loading={loading}
        tecnologias={tecnologias}
        onEdit={handleEditarRepuesto}
        onDelete={handleEliminarRepuesto}
      />

      {/* Dialogs */}
      <NuevoRepuestoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        repuesto={repuestoSeleccionado}
        isEditing={isEditing}
        tecnologias={tecnologias}
        onSubmit={handleSubmitRepuesto}
      />

      <DeleteRepuestoDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        repuesto={repuestoSeleccionado}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
