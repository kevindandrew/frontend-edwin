"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useUsuarios } from "@/hooks/useUsuarios";
import { SearchBar } from "@/components/usuarios/SearchBar";
import { UsuariosTable } from "@/components/usuarios/UsuariosTable";
import { UsuarioFormDialog } from "@/components/usuarios/UsuarioFormDialog";
import { DeleteConfirmDialog } from "@/components/usuarios/DeleteConfirmDialog";
import { useToast } from "@/hooks/use-toast";

export default function UsuariosPage() {
  const {
    usuarios,
    roles,
    loading,
    searchTerm,
    setSearchTerm,
    createUsuario,
    updateUsuario,
    deleteUsuario,
  } = useUsuarios();

  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);

  const handleCreate = () => {
    setSelectedUsuario(null);
    setDialogOpen(true);
  };

  const handleEdit = (usuario) => {
    setSelectedUsuario(usuario);
    setDialogOpen(true);
  };

  const handleDelete = (usuario) => {
    setSelectedUsuario(usuario);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (data) => {
    const result = selectedUsuario
      ? await updateUsuario(selectedUsuario.id_usuario, data)
      : await createUsuario(data);

    if (result.success) {
      toast({
        title: "Éxito",
        description: `Usuario ${
          selectedUsuario ? "actualizado" : "creado"
        } correctamente`,
      });
      setDialogOpen(false);
    } else {
      toast({
        title: "Error",
        description: "No se pudo guardar el usuario",
        variant: "destructive",
      });
    }
  };

  const handleConfirmDelete = async () => {
    const result = await deleteUsuario(selectedUsuario.id_usuario);
    if (result.success) {
      toast({
        title: "Éxito",
        description: "Usuario eliminado correctamente",
      });
      setDeleteDialogOpen(false);
    } else {
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Usuarios</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona los usuarios del sistema
        </p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar usuario..."
          />
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Usuario
          </Button>
        </div>

        <UsuariosTable
          usuarios={usuarios}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </Card>

      <UsuarioFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        usuario={selectedUsuario}
        roles={roles}
        loading={loading}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        usuario={selectedUsuario}
      />
    </div>
  );
}
