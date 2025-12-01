"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Eye, MapPin, Building } from "lucide-react";
import useEquipos from "@/hooks/useEquipos";
import { Spinner } from "@/components/ui/spinner";

export default function EquiposTecnicoPage() {
  const { equipos, loading } = useEquipos();
  const [search, setSearch] = useState("");
  const [selectedEquipo, setSelectedEquipo] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filteredEquipos = equipos.filter(
    (e) =>
      e.nombre_equipo.toLowerCase().includes(search.toLowerCase()) ||
      e.numero_serie?.toLowerCase().includes(search.toLowerCase()) ||
      e.marca?.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewDetails = (equipo) => {
    setSelectedEquipo(equipo);
    setDetailsOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Operativo":
        return "bg-green-100 text-green-800";
      case "En Mantenimiento":
        return "bg-blue-100 text-blue-800";
      case "Fuera de Servicio":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Consulta de Equipos</h1>
        <p className="text-muted-foreground mt-2">
          Información técnica y ubicación de equipos biomédicos
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, serie o marca..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : filteredEquipos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron equipos.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipo</TableHead>
                  <TableHead>Marca / Modelo</TableHead>
                  <TableHead>Serie</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipos.map((e) => (
                  <TableRow key={e.id_equipo}>
                    <TableCell className="font-medium">
                      {e.nombre_equipo}
                    </TableCell>
                    <TableCell>
                      {e.marca} / {e.modelo}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {e.numero_serie}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span className="flex items-center gap-1">
                          <Building className="w-3 h-3 text-muted-foreground" />
                          {e.cliente?.nombre_institucion || "N/A"}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {e.ubicacion?.nombre_ubicacion || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(e.estado)}
                      >
                        {e.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(e)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ficha Técnica del Equipo</DialogTitle>
          </DialogHeader>
          {selectedEquipo && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                    Identificación
                  </h4>
                  <div className="space-y-1">
                    <p>
                      <span className="font-medium">Nombre:</span>{" "}
                      {selectedEquipo.nombre_equipo}
                    </p>
                    <p>
                      <span className="font-medium">Marca:</span>{" "}
                      {selectedEquipo.marca}
                    </p>
                    <p>
                      <span className="font-medium">Modelo:</span>{" "}
                      {selectedEquipo.modelo}
                    </p>
                    <p>
                      <span className="font-medium">Serie:</span>{" "}
                      {selectedEquipo.numero_serie}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                    Ubicación y Estado
                  </h4>
                  <div className="space-y-1">
                    <p>
                      <span className="font-medium">Cliente:</span>{" "}
                      {selectedEquipo.cliente?.nombre_institucion}
                    </p>
                    <p>
                      <span className="font-medium">Área:</span>{" "}
                      {selectedEquipo.ubicacion?.nombre_ubicacion}
                    </p>
                    <p>
                      <span className="font-medium">Estado:</span>{" "}
                      <Badge
                        variant="secondary"
                        className={getStatusColor(selectedEquipo.estado)}
                      >
                        {selectedEquipo.estado}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                  Datos Técnicos
                </h4>
                <div className="bg-secondary/50 p-4 rounded-md space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Fecha de Instalación:</span>{" "}
                    {selectedEquipo.fecha_instalacion
                      ? new Date(
                          selectedEquipo.fecha_instalacion
                        ).toLocaleDateString()
                      : "No registrada"}
                  </p>
                  <p>
                    <span className="font-medium">Garantía:</span>{" "}
                    {selectedEquipo.garantia_expira
                      ? `Expira el ${new Date(
                          selectedEquipo.garantia_expira
                        ).toLocaleDateString()}`
                      : "No registrada"}
                  </p>
                  {/* Aquí se podrían agregar más campos técnicos si existieran en el modelo */}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
