"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useCatalogos from "@/hooks/useCatalogos";
import useEquipos from "@/hooks/useEquipos";
import useFetch from "@/hooks/useFetch";
import EquiposFilters from "@/app/admin/inventario/_components/EquiposFilters";
import EquiposTable from "@/app/admin/inventario/_components/EquiposTable";
import NuevoEquipoFormDialog from "@/app/admin/inventario/_components/NuevoEquipoFormDialog";
import EquipoViewDialog from "@/app/admin/inventario/_components/EquipoViewDialog";

export default function GestorEquiposPage() {
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
  } = useEquipos();

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
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
          description: "El equipo se ha registrado correctamente.",
        });
      }
      setFormDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un error al guardar el equipo.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Equipos</h1>
          <p className="text-muted-foreground mt-2">
            Administra el inventario de equipos biomédicos.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
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
        loading={loadingEquipos}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={() => {}} // Disable delete for now or implement if needed
      />

      <NuevoEquipoFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        equipo={selectedEquipo}
        catalogos={catalogos}
        onSubmit={handleFormSubmit}
        isEditing={isEditing}
        onCatalogoUpdate={catalogos.updateCatalogo}
      />

      <EquipoViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        equipo={selectedEquipo}
      />
    </div>
  );
}
