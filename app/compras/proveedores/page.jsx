"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useProveedores from "@/hooks/useProveedores";
import { Spinner } from "@/components/ui/spinner";

export default function ProveedoresPage() {
  const {
    proveedores,
    loading,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor,
  } = useProveedores();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProveedor, setCurrentProveedor] = useState(null);
  const [formData, setFormData] = useState({
    nombre_proveedor: "",
    contacto: "",
    telefono: "",
    email: "",
    direccion: "",
  });

  const filteredProveedores = proveedores.filter(
    (p) =>
      p.nombre_proveedor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.contacto?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (proveedor = null) => {
    if (proveedor) {
      setIsEditing(true);
      setCurrentProveedor(proveedor);
      setFormData({
        nombre_proveedor: proveedor.nombre_proveedor || "",
        contacto: proveedor.contacto || "",
        telefono: proveedor.telefono || "",
        email: proveedor.email || "",
        direccion: proveedor.direccion || "",
      });
    } else {
      setIsEditing(false);
      setCurrentProveedor(null);
      setFormData({
        nombre_proveedor: "",
        contacto: "",
        telefono: "",
        email: "",
        direccion: "",
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let result;
      if (isEditing) {
        result = await actualizarProveedor(
          currentProveedor.id_proveedor,
          formData
        );
      } else {
        result = await crearProveedor(formData);
      }

      if (result.success) {
        toast({
          title: isEditing ? "Proveedor actualizado" : "Proveedor creado",
          description: "La operación se realizó con éxito.",
        });
        setDialogOpen(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar el proveedor.",
      });
    }
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de eliminar este proveedor?")) {
      const result = await eliminarProveedor(id);
      if (result.success) {
        toast({
          title: "Proveedor eliminado",
          description: "El proveedor ha sido eliminado correctamente.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo eliminar el proveedor.",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Proveedores</h1>
          <p className="text-muted-foreground mt-2">
            Administra la lista de proveedores y contactos.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Proveedor
        </Button>
      </div>

      <div className="flex items-center space-x-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar proveedor..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProveedores.length > 0 ? (
                filteredProveedores.map((proveedor) => (
                  <TableRow key={proveedor.id_proveedor}>
                    <TableCell className="font-medium">
                      {proveedor.nombre_proveedor}
                    </TableCell>
                    <TableCell>{proveedor.contacto || "-"}</TableCell>
                    <TableCell>{proveedor.telefono || "-"}</TableCell>
                    <TableCell>{proveedor.email || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(proveedor)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(proveedor.id_proveedor)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No se encontraron proveedores.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Proveedor" : "Nuevo Proveedor"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Proveedor *</Label>
              <Input
                id="nombre"
                value={formData.nombre_proveedor}
                onChange={(e) =>
                  setFormData({ ...formData, nombre_proveedor: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contacto">Persona de Contacto</Label>
              <Input
                id="contacto"
                value={formData.contacto}
                onChange={(e) =>
                  setFormData({ ...formData, contacto: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) =>
                  setFormData({ ...formData, direccion: e.target.value })
                }
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
