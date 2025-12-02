"use client";

import { useState } from "react";
import useCatalogos from "@/hooks/useCatalogos";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Search, Building2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AdminFabricantesPage() {
  const {
    fabricantes,
    loading,
    createFabricante,
    updateFabricante,
    deleteFabricante,
  } = useCatalogos();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentFabricante, setCurrentFabricante] = useState(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    nombre_fabricante: "",
    pais_origen: "",
    contacto: "",
    telefono: "",
    correo: "",
    sitio_web: "",
  });

  const filteredFabricantes = fabricantes.filter((fab) =>
    fab.nombre_fabricante.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (fabricante = null) => {
    if (fabricante) {
      setCurrentFabricante(fabricante);
      setFormData({
        nombre_fabricante: fabricante.nombre_fabricante,
        pais_origen: fabricante.pais_origen || "",
        contacto: fabricante.contacto || "",
        telefono: fabricante.telefono || "",
        correo: fabricante.correo || "",
        sitio_web: fabricante.sitio_web || "",
      });
    } else {
      setCurrentFabricante(null);
      setFormData({
        nombre_fabricante: "",
        pais_origen: "",
        contacto: "",
        telefono: "",
        correo: "",
        sitio_web: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentFabricante) {
        await updateFabricante(currentFabricante.id_fabricante, formData);
        toast({
          title: "Éxito",
          description: "Fabricante actualizado correctamente",
        });
      } else {
        await createFabricante(formData);
        toast({
          title: "Éxito",
          description: "Fabricante creado correctamente",
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de eliminar este fabricante?")) {
      try {
        await deleteFabricante(id);
        toast({
          title: "Éxito",
          description: "Fabricante eliminado correctamente",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
          <Building2 className="w-8 h-8" />
          Gestión de Fabricantes (Admin)
        </h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Fabricante
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Fabricantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar fabricante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>País</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Cargando...
                    </TableCell>
                  </TableRow>
                ) : filteredFabricantes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No se encontraron fabricantes
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFabricantes.map((fab) => (
                    <TableRow key={fab.id_fabricante}>
                      <TableCell className="font-medium">
                        {fab.nombre_fabricante}
                      </TableCell>
                      <TableCell>{fab.pais_origen || "-"}</TableCell>
                      <TableCell>{fab.contacto || "-"}</TableCell>
                      <TableCell>{fab.telefono || "-"}</TableCell>
                      <TableCell>{fab.correo || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(fab)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(fab.id_fabricante)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentFabricante ? "Editar Fabricante" : "Nuevo Fabricante"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre del Fabricante</Label>
              <Input
                id="nombre"
                value={formData.nombre_fabricante}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nombre_fabricante: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pais">País de Origen</Label>
              <Input
                id="pais"
                value={formData.pais_origen}
                onChange={(e) =>
                  setFormData({ ...formData, pais_origen: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="contacto">Persona de Contacto</Label>
                <Input
                  id="contacto"
                  value={formData.contacto}
                  onChange={(e) =>
                    setFormData({ ...formData, contacto: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.correo}
                onChange={(e) =>
                  setFormData({ ...formData, correo: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="web">Sitio Web</Label>
              <Input
                id="web"
                value={formData.sitio_web}
                onChange={(e) =>
                  setFormData({ ...formData, sitio_web: e.target.value })
                }
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
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
