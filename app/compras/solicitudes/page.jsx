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
import { Badge } from "@/components/ui/badge";
import { Plus, Search, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function SolicitudesPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [solicitudes, setSolicitudes] = useState([]); // Mock data for now
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    descripcion: "",
    cantidad: "",
    prioridad: "Media",
    justificacion: "",
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    // Aquí iría la lógica para crear la solicitud en el backend
    // Por ahora simulamos la creación
    const nuevaSolicitud = {
      id: Math.floor(Math.random() * 1000),
      fecha: new Date().toLocaleDateString(),
      ...formData,
      estado: "Pendiente",
    };
    setSolicitudes([nuevaSolicitud, ...solicitudes]);
    setDialogOpen(false);
    toast({
      title: "Solicitud creada",
      description: "La solicitud de compra ha sido registrada.",
    });
    setFormData({
      descripcion: "",
      cantidad: "",
      prioridad: "Media",
      justificacion: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Solicitudes de Compra</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona las requisiciones y órdenes de compra.
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Solicitud
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {solicitudes.length > 0 ? (
              solicitudes.map((sol) => (
                <TableRow key={sol.id}>
                  <TableCell className="font-medium">#{sol.id}</TableCell>
                  <TableCell>{sol.descripcion}</TableCell>
                  <TableCell>{sol.fecha}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{sol.prioridad}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{sol.estado}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <FileText className="w-10 h-10" />
                    <p>No hay solicitudes registradas.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Solicitud de Compra</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción del Item *</Label>
              <Input
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cantidad">Cantidad *</Label>
                <Input
                  id="cantidad"
                  type="number"
                  value={formData.cantidad}
                  onChange={(e) =>
                    setFormData({ ...formData, cantidad: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prioridad">Prioridad</Label>
                <select
                  id="prioridad"
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.prioridad}
                  onChange={(e) =>
                    setFormData({ ...formData, prioridad: e.target.value })
                  }
                >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="justificacion">Justificación / Notas</Label>
              <Textarea
                id="justificacion"
                value={formData.justificacion}
                onChange={(e) =>
                  setFormData({ ...formData, justificacion: e.target.value })
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
              <Button type="submit">Crear Solicitud</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
