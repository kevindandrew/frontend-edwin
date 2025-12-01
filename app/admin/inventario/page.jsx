"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useCatalogos from "@/hooks/useCatalogos";
import useEquipos from "@/hooks/useEquipos";
import useFetch from "@/hooks/useFetch";
import EquiposFilters from "./_components/EquiposFilters";
import EquiposTable from "./_components/EquiposTable";
import NuevoEquipoFormDialog from "./_components/NuevoEquipoFormDialog";
import EquipoViewDialog from "./_components/EquipoViewDialog";
import DeleteEquipoDialog from "./_components/DeleteEquipoDialog";

export default function InventarioPage() {
  const { toast } = useToast();
  const catalogos = useCatalogos();
  const { get } = useFetch("https://backend-edwin.onrender.com");
  const {
    equipos,
    loading: loadingEquipos,
    searchTerm,
    setSearchTerm,
    filterEstado,
    setFilterEstado,
    filterUbicacion,
    setFilterUbicacion,
    createEquipo,
    updateEquipo,
    deleteEquipo,
  } = useEquipos();

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEquipo, setSelectedEquipo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterEstado("");
    setFilterUbicacion("");
  };

  const handleCreate = () => {
    setSelectedEquipo(null);
    setIsEditing(false);
    setFormDialogOpen(true);
  };

  const handleEdit = (equipo) => {
    setSelectedEquipo(equipo);
    setIsEditing(true);
    setFormDialogOpen(true);
  };

  const handleView = async (equipo) => {
    try {
      let datosTecnicos = null;
      const { data: dtData } = await get(
        `/datos-tecnicos/equipo/${equipo.id_equipo}/`
      );
      if (dtData) {
        datosTecnicos = Array.isArray(dtData) ? dtData[0] : dtData;
      }

      let fabricanteCompleto = null;
      if (equipo.id_fabricante) {
        const fabricanteDetalle = await catalogos.fetchFabricanteById(
          equipo.id_fabricante
        );
        if (fabricanteDetalle) fabricanteCompleto = fabricanteDetalle;
      }

      setSelectedEquipo({
        ...equipo,
        datos_tecnicos: datosTecnicos,
        fabricante: fabricanteCompleto || equipo.fabricante,
      });
      setViewDialogOpen(true);
    } catch (error) {
      setSelectedEquipo(equipo);
      setViewDialogOpen(true);
    }
  };

  const handleDeleteClick = (equipo) => {
    setSelectedEquipo(equipo);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (isEditing) {
        await updateEquipo(selectedEquipo.id_equipo, formData);
        toast({
          title: "Equipo actualizado",
          description: "El equipo se ha actualizado correctamente.",
        });
      } else {
        await createEquipo(formData);
        toast({
          title: "Equipo creado",
          description: "El equipo se ha creado correctamente.",
        });
      }
      setFormDialogOpen(false);
      setSelectedEquipo(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo guardar el equipo.",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteEquipo(selectedEquipo.id_equipo);
      toast({
        title: "Equipo eliminado",
        description: "El equipo se ha eliminado correctamente.",
      });
      setDeleteDialogOpen(false);
      setSelectedEquipo(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo eliminar el equipo.",
      });
    }
  };

  const handleCatalogoUpdate = async (tipo, id, payload) => {
    try {
      let result;

      // Si payload es null, es una eliminación
      if (payload === null) {
        switch (tipo) {
          case "categoria":
            await catalogos.deleteCategoria(id);
            break;
          case "riesgo":
            await catalogos.deleteRiesgo(id);
            break;
          case "fabricante":
            await catalogos.deleteFabricante(id);
            break;
          case "tecnologia":
            await catalogos.deleteTecnologia(id);
            break;
        }
        toast({
          title: "Eliminado correctamente",
          description: `El registro ha sido eliminado.`,
        });
      } else if (id) {
        // Es una actualización
        switch (tipo) {
          case "categoria":
            result = await catalogos.updateCategoria(id, payload);
            break;
          case "riesgo":
            result = await catalogos.updateRiesgo(id, payload);
            break;
          case "fabricante":
            result = await catalogos.updateFabricante(id, payload);
            break;
          case "tecnologia":
            result = await catalogos.updateTecnologia(id, payload);
            break;
        }
        toast({
          title: "Actualizado correctamente",
          description: `El registro ha sido actualizado.`,
        });
      } else {
        // Es una creación
        switch (tipo) {
          case "categoria":
            result = await catalogos.createCategoria(payload);
            break;
          case "riesgo":
            result = await catalogos.createRiesgo(payload);
            break;
          case "fabricante":
            result = await catalogos.createFabricante(payload);
            break;
          case "tecnologia":
            result = await catalogos.createTecnologia(payload);
            break;
        }
        toast({
          title: "Creado correctamente",
          description: `El registro ha sido creado.`,
        });
      }

      return result;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo realizar la operación.",
      });
      throw error;
    }
  };

  if (catalogos.loading || loadingEquipos) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventario de Equipos</h1>
          <p className="text-muted-foreground">Gestión de equipos biomédicos</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Equipo
        </Button>
      </div>

      <EquiposFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterEstado={filterEstado}
        setFilterEstado={setFilterEstado}
        filterUbicacion={filterUbicacion}
        setFilterUbicacion={setFilterUbicacion}
        catalogos={catalogos}
        onClearFilters={handleClearFilters}
      />

      <EquiposTable
        equipos={equipos}
        catalogos={catalogos}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <NuevoEquipoFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        equipo={selectedEquipo}
        catalogos={catalogos}
        onSubmit={handleFormSubmit}
        isEditing={isEditing}
        onCatalogoUpdate={handleCatalogoUpdate}
      />

      <EquipoViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        equipo={selectedEquipo}
        catalogos={catalogos}
      />

      <DeleteEquipoDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        equipoName={selectedEquipo?.nombre_equipo}
      />
    </div>
  );
}
