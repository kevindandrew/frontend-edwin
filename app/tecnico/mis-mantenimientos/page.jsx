"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Play, CheckCircle, AlertTriangle } from "lucide-react";
import useMantenimientos from "@/hooks/useMantenimientos";
import Cookies from "js-cookie";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";

export default function MisMantenimientosPage() {
  const {
    mantenimientos,
    loading,
    fetchMantenimientos,
    actualizarMantenimiento,
  } = useMantenimientos();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedMantenimiento, setSelectedMantenimiento] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [formData, setFormData] = useState({
    estado: "",
    observaciones: "",
    diagnostico: "",
    solucion: "",
  });

  useEffect(() => {
    const userStr = Cookies.get("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
      fetchMantenimientos();
    }
  }, []);

  const misMantenimientos = mantenimientos.filter((m) => {
    const isAssigned = m.id_tecnico === user?.id_usuario || !m.id_tecnico; // Fallback for demo
    const matchesSearch =
      m.equipo?.nombre_equipo?.toLowerCase().includes(search.toLowerCase()) ||
      m.tipo_mantenimiento?.toLowerCase().includes(search.toLowerCase());
    return isAssigned && matchesSearch;
  });

  const handleViewDetails = (mantenimiento) => {
    setSelectedMantenimiento(mantenimiento);
    setDetailsOpen(true);
  };

  const handleUpdateStatus = (mantenimiento) => {
    setSelectedMantenimiento(mantenimiento);
    setFormData({
      estado: mantenimiento.estado,
      observaciones: mantenimiento.observaciones || "",
      diagnostico: mantenimiento.diagnostico || "",
      solucion: mantenimiento.solucion || "",
    });
    setUpdateOpen(true);
  };

  const handleSubmitUpdate = async () => {
    try {
      await actualizarMantenimiento(selectedMantenimiento.id_mantenimiento, {
        ...selectedMantenimiento,
        ...formData,
      });
      toast({
        title: "Mantenimiento actualizado",
        description:
          "El estado del mantenimiento ha sido actualizado exitosamente.",
      });
      setUpdateOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el mantenimiento.",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Alta":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "Media":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "Baja":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completado":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "En Proceso":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mis Mantenimientos</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona tus tareas de mantenimiento asignadas
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por equipo o tipo..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : misMantenimientos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No tienes mantenimientos asignados.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha Programada</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {misMantenimientos.map((m) => (
                  <TableRow key={m.id_mantenimiento}>
                    <TableCell className="font-medium">
                      {m.equipo?.nombre_equipo || "N/A"}
                    </TableCell>
                    <TableCell>{m.tipo_mantenimiento}</TableCell>
                    <TableCell>
                      {new Date(m.fecha_programada).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getPriorityColor(m.prioridad)}
                      >
                        {m.prioridad || "Normal"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(m.estado)}
                      >
                        {m.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(m)}
                          title="Ver Detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {m.estado !== "Completado" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUpdateStatus(m)}
                            title="Actualizar Estado"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialogo de Detalles */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalles del Mantenimiento</DialogTitle>
            <DialogDescription>
              Información completa de la tarea asignada
            </DialogDescription>
          </DialogHeader>
          {selectedMantenimiento && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Información del Equipo</h4>
                  <p className="text-sm text-muted-foreground">
                    Nombre: {selectedMantenimiento.equipo?.nombre_equipo}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Marca: {selectedMantenimiento.equipo?.marca}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Modelo: {selectedMantenimiento.equipo?.modelo}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Serie: {selectedMantenimiento.equipo?.numero_serie}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Detalles de la Tarea</h4>
                  <p className="text-sm text-muted-foreground">
                    Tipo: {selectedMantenimiento.tipo_mantenimiento}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Prioridad: {selectedMantenimiento.prioridad}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Estado: {selectedMantenimiento.estado}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Fecha:{" "}
                    {new Date(
                      selectedMantenimiento.fecha_programada
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Descripción del Problema</h4>
                <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-md">
                  {selectedMantenimiento.descripcion_problema ||
                    "Sin descripción"}
                </p>
              </div>
              {selectedMantenimiento.diagnostico && (
                <div>
                  <h4 className="font-semibold mb-2">Diagnóstico</h4>
                  <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-md">
                    {selectedMantenimiento.diagnostico}
                  </p>
                </div>
              )}
              {selectedMantenimiento.solucion && (
                <div>
                  <h4 className="font-semibold mb-2">Solución Aplicada</h4>
                  <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-md">
                    {selectedMantenimiento.solucion}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialogo de Actualización */}
      <Dialog open={updateOpen} onOpenChange={setUpdateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Actualizar Mantenimiento</DialogTitle>
            <DialogDescription>
              Registra el progreso, diagnóstico y solución.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="estado" className="text-sm font-medium">
                Estado
              </label>
              <Select
                value={formData.estado}
                onValueChange={(value) =>
                  setFormData({ ...formData, estado: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="En Proceso">En Proceso</SelectItem>
                  <SelectItem value="Completado">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="diagnostico" className="text-sm font-medium">
                Diagnóstico Técnico
              </label>
              <Textarea
                id="diagnostico"
                placeholder="Describe el diagnóstico del problema..."
                value={formData.diagnostico}
                onChange={(e) =>
                  setFormData({ ...formData, diagnostico: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="solucion" className="text-sm font-medium">
                Solución / Trabajo Realizado
              </label>
              <Textarea
                id="solucion"
                placeholder="Describe el trabajo realizado..."
                value={formData.solucion}
                onChange={(e) =>
                  setFormData({ ...formData, solucion: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="observaciones" className="text-sm font-medium">
                Observaciones Adicionales
              </label>
              <Textarea
                id="observaciones"
                placeholder="Cualquier observación adicional..."
                value={formData.observaciones}
                onChange={(e) =>
                  setFormData({ ...formData, observaciones: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitUpdate}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
