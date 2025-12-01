"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Activity, Info } from "lucide-react";
import useEquipos from "@/hooks/useEquipos";
import useCatalogos from "@/hooks/useCatalogos";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

export default function ConsultaPage() {
  const {
    equipos,
    loading,
    searchTerm,
    setSearchTerm,
    filterEstado,
    setFilterEstado,
    filterUbicacion,
    setFilterUbicacion,
  } = useEquipos();
  const catalogos = useCatalogos();

  const [filteredEquipos, setFilteredEquipos] = useState([]);

  useEffect(() => {
    if (equipos) {
      let result = equipos;

      // Filtro local adicional si es necesario (aunque el hook ya filtra por API algunos campos)
      // Aquí aseguramos que el término de búsqueda se aplique en cliente si el hook no lo hace completamente
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(
          (e) =>
            e.nombre_equipo.toLowerCase().includes(term) ||
            e.modelo?.toLowerCase().includes(term) ||
            e.numero_serie?.toLowerCase().includes(term)
        );
      }

      setFilteredEquipos(result);
    }
  }, [equipos, searchTerm]);

  const estadoColors = {
    "En Uso": "default",
    Disponible: "secondary",
    "En Mantenimiento": "warning",
    "Fuera de Servicio": "destructive",
  };

  return (
    <div className="space-y-8">
      {/* Hero / Search Section */}
      <div className="flex flex-col items-center space-y-4 text-center py-10">
        <h1 className="text-4xl font-bold tracking-tight">
          Catálogo de Equipos Biomédicos
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Consulta la disponibilidad, especificaciones y estado de todos los
          equipos registrados en el sistema.
        </p>

        <div className="w-full max-w-3xl flex gap-2 mt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, modelo o serie..."
              className="pl-10 h-12 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center w-full max-w-4xl mt-4">
          <Select value={filterEstado} onValueChange={setFilterEstado}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="Disponible">Disponible</SelectItem>
              <SelectItem value="En Uso">En Uso</SelectItem>
              <SelectItem value="En Mantenimiento">En Mantenimiento</SelectItem>
              <SelectItem value="Fuera de Servicio">
                Fuera de Servicio
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterUbicacion} onValueChange={setFilterUbicacion}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por Ubicación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las ubicaciones</SelectItem>
              {catalogos.ubicaciones.map((ub) => (
                <SelectItem
                  key={ub.id_ubicacion}
                  value={ub.id_ubicacion.toString()}
                >
                  {ub.nombre_ubicacion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner className="w-10 h-10" />
        </div>
      ) : filteredEquipos.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-lg">
          <Info className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">No se encontraron equipos</h3>
          <p className="text-muted-foreground">
            Intenta ajustar los filtros o el término de búsqueda.
          </p>
          <Button
            variant="link"
            onClick={() => {
              setSearchTerm("");
              setFilterEstado("");
              setFilterUbicacion("");
            }}
            className="mt-2"
          >
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEquipos.map((equipo) => (
            <Card
              key={equipo.id_equipo}
              className="hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="aspect-video bg-muted relative overflow-hidden rounded-t-lg">
                {/* Placeholder image logic - could be replaced with real image if available */}
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
                  <Activity className="w-20 h-20" />
                </div>
                <Badge
                  className="absolute top-2 right-2"
                  variant={estadoColors[equipo.estado] || "default"}
                >
                  {equipo.estado}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle
                  className="line-clamp-1"
                  title={equipo.nombre_equipo}
                >
                  {equipo.nombre_equipo}
                </CardTitle>
                <div className="text-sm text-muted-foreground font-mono">
                  {equipo.modelo}
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span className="line-clamp-2">
                    {equipo.ubicacion?.nombre_ubicacion || "Sin ubicación"}
                    {equipo.cliente?.nombre_institucion &&
                      ` - ${equipo.cliente.nombre_institucion}`}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Serie: {equipo.numero_serie}
                </div>
              </CardContent>
              <CardFooter>
                <Link
                  href={`/consulta/equipos/${equipo.id_equipo}`}
                  className="w-full"
                >
                  <Button variant="outline" className="w-full">
                    Ver Detalles
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
