"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import useClientes from "@/hooks/useClientes";
import ClientesTable from "./_components/ClientesTable";
import ClienteFormDialog from "./_components/ClienteFormDialog";
import DeleteConfirmDialog from "./_components/DeleteConfirmDialog";
import ClienteViewDialog from "./_components/ClienteViewDialog";
import SalasModal from "./_components/SalasModal";
import SearchBar from "./_components/SearchBar";

export default function ClientesPage() {
  const { toast } = useToast();
  const {
    clientes,
    loading,
    createCliente,
    updateCliente,
    deleteCliente,
    searchTerm,
    setSearchTerm,
  } = useClientes();
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [salasModalOpen, setSalasModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleCreate = () => {
    setSelectedCliente(null);
    setFormDialogOpen(true);
  };

  const handleView = (cliente) => {
    setSelectedCliente(cliente);
    setViewDialogOpen(true);
  };

  const handleEdit = (cliente) => {
    setSelectedCliente(cliente);
    setFormDialogOpen(true);
  };

  const handleDelete = (cliente) => {
    setSelectedCliente(cliente);
    setDeleteDialogOpen(true);
  };

  const handleViewSalas = (cliente) => {
    setSelectedCliente(cliente);
    setSalasModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    setIsSaving(true);
    const response = selectedCliente
      ? await updateCliente(selectedCliente.id_cliente, formData)
      : await createCliente(formData);

    if (response.success) {
      toast({
        title: "Éxito",
        description: `Cliente ${
          selectedCliente ? "actualizado" : "creado"
        } correctamente`,
      });
      setFormDialogOpen(false);
    } else {
      toast({
        title: "Error",
        description: "No se pudo guardar el cliente",
        variant: "destructive",
      });
    }
    setIsSaving(false);
  };

  const handleConfirmDelete = async () => {
    const response = await deleteCliente(selectedCliente.id_cliente);
    if (response.success) {
      toast({
        title: "Éxito",
        description: "Cliente eliminado correctamente",
      });
      setDeleteDialogOpen(false);
    } else {
      toast({
        title: "Error",
        description: "No se pudo eliminar el cliente",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Clientes</h1>
        <p className="text-muted-foreground">
          Administra los clientes y sus áreas
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-sm">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por institución, NIT o contacto..."
          />
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Crear Cliente
        </Button>
      </div>

      <ClientesTable
        clientes={clientes}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewSalas={handleViewSalas}
      />

      <ClienteFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        cliente={selectedCliente}
        onSubmit={handleSubmit}
        loading={isSaving}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        clienteName={selectedCliente?.nombre_institucion}
      />

      <ClienteViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        cliente={selectedCliente}
      />

      <SalasModal
        open={salasModalOpen}
        onOpenChange={setSalasModalOpen}
        cliente={selectedCliente}
      />
    </div>
  );
}
