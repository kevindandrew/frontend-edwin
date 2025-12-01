"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Shield,
  FileText,
  Activity,
  Factory,
  Cpu,
} from "lucide-react";
import useEquipos from "@/hooks/useEquipos";
import useDatosTecnicos from "@/hooks/useDatosTecnicos";
import useCatalogos from "@/hooks/useCatalogos";
import { Spinner } from "@/components/ui/spinner";

export default function EquipoDetallePage() {
  const params = useParams();
  const router = useRouter();
  const { fetchEquipoById } = useEquipos();
  const { datosTecnicos, refreshDatosTecnicos } = useDatosTecnicos(params.id);
  const catalogos = useCatalogos();

  const [equipo, setEquipo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchEquipoById(params.id);
        if (data) {
          // Enriquecer con nombres de catálogos si es necesario
          // (Aunque fetchEquipoById ya debería traer algunos datos enriquecidos o IDs)
          setEquipo(data);
        }
      } catch (error) {
        console.error("Error loading equipo:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadData();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (!equipo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">Equipo no encontrado</h2>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
      </div>
    );
  }

  const estadoColors = {
    "En Uso": "default",
    Disponible: "secondary",
    "En Mantenimiento": "warning",
    "Fuera de Servicio": "destructive",
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al catálogo
      </Button>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-1/3 aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground/20">
          <Activity className="w-32 h-32" />
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant={estadoColors[equipo.estado] || "default"}>
                {equipo.estado}
              </Badge>
              <span className="text-sm text-muted-foreground font-mono">
                ID: {equipo.id_equipo}
              </span>
            </div>
            <h1 className="text-3xl font-bold">{equipo.nombre_equipo}</h1>
            <p className="text-xl text-muted-foreground">{equipo.modelo}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Ubicación</p>
                  <p className="text-sm text-muted-foreground">
                    {equipo.ubicacion?.nombre_ubicacion || "No especificada"}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Factory className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Fabricante</p>
                  <p className="text-sm text-muted-foreground">
                    {equipo.fabricante?.nombre_fabricante || "No especificado"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Details Tabs */}
      <Tabs defaultValue="detalles" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="detalles">Detalles Generales</TabsTrigger>
          <TabsTrigger value="tecnico">Datos Técnicos</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="detalles" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Equipo</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Número de Serie
                </label>
                <p className="font-mono">{equipo.numero_serie}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Fecha de Adquisición
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <p>{equipo.fecha_adquisicion || "No registrada"}</p>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Garantía
                </label>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <p>{equipo.garantia || "Sin información"}</p>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Proveedor
                </label>
                <p>{equipo.proveedor || "No registrado"}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Categoría
                </label>
                <p>{equipo.categoria?.nombre_categoria || "-"}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Tecnología
                </label>
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-muted-foreground" />
                  <p>{equipo.tecnologia?.nombre_tecnologia || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tecnico" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Especificaciones Técnicas</CardTitle>
              <CardDescription>
                Detalles técnicos y documentación operativa.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {datosTecnicos ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">
                        Vida Útil Estimada
                      </label>
                      <p>
                        {datosTecnicos.vida_util_estimada_anios
                          ? `${datosTecnicos.vida_util_estimada_anios} años`
                          : "No especificada"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">
                        Frecuencia de Mantenimiento
                      </label>
                      <p>
                        {datosTecnicos.frecuencia_mantenimiento_dias
                          ? `Cada ${datosTecnicos.frecuencia_mantenimiento_dias} días`
                          : "No especificada"}
                      </p>
                    </div>
                  </div>

                  {datosTecnicos.manual_operacion_url && (
                    <div className="p-4 bg-secondary/50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">Manual de Operación</p>
                          <p className="text-xs text-muted-foreground">
                            Documentación digital disponible
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(
                            datosTecnicos.manual_operacion_url,
                            "_blank"
                          )
                        }
                      >
                        Ver Manual
                      </Button>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Especificaciones Detalladas
                    </label>
                    <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      {typeof datosTecnicos.especificaciones_tecnicas ===
                      "object" ? (
                        <pre>
                          {JSON.stringify(
                            datosTecnicos.especificaciones_tecnicas,
                            null,
                            2
                          )}
                        </pre>
                      ) : (
                        <p>
                          {datosTecnicos.especificaciones_tecnicas ||
                            "Sin especificaciones detalladas."}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No hay datos técnicos registrados para este equipo.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historial" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Mantenimientos</CardTitle>
              <CardDescription>
                Registro de intervenciones realizadas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>
                  Esta funcionalidad estará disponible próximamente para el
                  perfil de consulta.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
