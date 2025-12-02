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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Search, Building2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function FabricantesPage() {
  const { fabricantes, loading } = useCatalogos();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentFabricante, setCurrentFabricante] = useState(null);

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

  const handleOpenDialog = (fabricante) => {
    setCurrentFabricante(fabricante);
    setFormData({
      nombre_fabricante: fabricante.nombre_fabricante,
      pais_origen: fabricante.pais_origen || "",
      contacto: fabricante.contacto || "",
      telefono: fabricante.telefono || "",
      correo: fabricante.correo || "",
      sitio_web: fabricante.sitio_web || "",
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
          <Building2 className="w-8 h-8" />
          Fabricantes
        </h1>
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(fab)}
                        >
                          <Search className="w-4 h-4 mr-2" />
                          Ver Detalles
                        </Button>
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
            <DialogTitle>Detalles del Fabricante</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre del Fabricante</Label>
              <Input
                id="nombre"
                value={formData.nombre_fabricante}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pais">País de Origen</Label>
              <Input
                id="pais"
                value={formData.pais_origen}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="contacto">Persona de Contacto</Label>
                <Input
                  id="contacto"
                  value={formData.contacto}
                  readOnly
                  className="bg-muted"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                value={formData.correo}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="web">Sitio Web</Label>
              <Input
                id="web"
                value={formData.sitio_web}
                readOnly
                className="bg-muted"
              />
            </div>
            <DialogFooter>
              <Button onClick={() => setIsDialogOpen(false)}>Cerrar</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
