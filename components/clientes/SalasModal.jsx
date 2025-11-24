import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import useUbicaciones from "@/hooks/useUbicaciones";
import { useToast } from "@/hooks/use-toast";
import SearchBar from "./SearchBar";
import UbicacionesTable from "./UbicacionesTable";
import UbicacionFormDialog from "./UbicacionFormDialog";
import DeleteUbicacionDialog from "./DeleteUbicacionDialog";

export default function SalasModal({ open, onOpenChange, cliente }) {
  const { toast } = useToast();
  const {
    ubicaciones,
    loading,
    searchTerm,
    setSearchTerm,
    createUbicacion,
    updateUbicacion,
    deleteUbicacion,
  } = useUbicaciones(cliente?.id_cliente);

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUbicacion, setSelectedUbicacion] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleCreate = () => {
    setSelectedUbicacion(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (ubicacion) => {
    setSelectedUbicacion(ubicacion);
    setFormDialogOpen(true);
  };

  const handleDelete = (ubicacion) => {
    setSelectedUbicacion(ubicacion);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (formData) => {
    setIsSaving(true);
    const ubicacionData = {
      ...formData,
      id_cliente: cliente.id_cliente,
    };

    const response = selectedUbicacion
      ? await updateUbicacion(selectedUbicacion.id_ubicacion, ubicacionData)
      : await createUbicacion(ubicacionData);

    if (response.success) {
      toast({
        title: "Éxito",
        description: `Sala ${
          selectedUbicacion ? "actualizada" : "creada"
        } correctamente`,
      });
      setFormDialogOpen(false);
    } else {
      toast({
        title: "Error",
        description: "No se pudo guardar la sala",
        variant: "destructive",
      });
    }
    setIsSaving(false);
  };

  const handleConfirmDelete = async () => {
    const response = await deleteUbicacion(selectedUbicacion.id_ubicacion);
    if (response.success) {
      toast({
        title: "Éxito",
        description: "Sala eliminada correctamente",
      });
      setDeleteDialogOpen(false);
    } else {
      toast({
        title: "Error",
        description: "No se pudo eliminar la sala",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Salas / Ubicaciones - {cliente?.nombre_institucion}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <SearchBar
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Buscar sala..."
                />
              </div>
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Sala
              </Button>
            </div>

            <UbicacionesTable
              ubicaciones={ubicaciones}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </DialogContent>
      </Dialog>

      <UbicacionFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        ubicacion={selectedUbicacion}
        onSubmit={handleSubmit}
        loading={isSaving}
      />

      <DeleteUbicacionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        ubicacionName={selectedUbicacion?.nombre_ubicacion}
      />
    </>
  );
}
