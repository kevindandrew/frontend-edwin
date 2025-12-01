"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
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
import { useToast } from "@/hooks/use-toast";
import useEquipos from "@/hooks/useEquipos";
import useDatosTecnicos from "@/hooks/useDatosTecnicos";
import { Spinner } from "@/components/ui/spinner";
import { Save, FileText } from "lucide-react";

export default function DatosTecnicosPage() {
  const { toast } = useToast();
  const { equipos, loading: loadingEquipos } = useEquipos();
  const [selectedEquipoId, setSelectedEquipoId] = useState("");

  // Hook se inicializa con null, luego actualizamos cuando se selecciona equipo
  const {
    datosTecnicos,
    loading: loadingDatos,
    createDatosTecnicos,
    updateDatosTecnicos,
    refreshDatosTecnicos,
  } = useDatosTecnicos(selectedEquipoId);

  const [formData, setFormData] = useState({
    especificaciones_tecnicas: "",
    manual_operacion_url: "",
    vida_util_estimada_anios: "",
    frecuencia_mantenimiento_dias: "",
  });

  useEffect(() => {
    if (datosTecnicos) {
      setFormData({
        especificaciones_tecnicas:
          typeof datosTecnicos.especificaciones_tecnicas === "object"
            ? JSON.stringify(datosTecnicos.especificaciones_tecnicas, null, 2)
            : datosTecnicos.especificaciones_tecnicas || "",
        manual_operacion_url: datosTecnicos.manual_operacion_url || "",
        vida_util_estimada_anios: datosTecnicos.vida_util_estimada_anios || "",
        frecuencia_mantenimiento_dias:
          datosTecnicos.frecuencia_mantenimiento_dias || "",
      });
    } else {
      setFormData({
        especificaciones_tecnicas: "",
        manual_operacion_url: "",
        vida_util_estimada_anios: "",
        frecuencia_mantenimiento_dias: "",
      });
    }
  }, [datosTecnicos]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEquipoId) return;

    try {
      // Intentar parsear JSON si es posible, sino enviar como string
      let specs = formData.especificaciones_tecnicas;
      try {
        specs = JSON.parse(formData.especificaciones_tecnicas);
      } catch (e) {
        // No es JSON válido, enviar como texto plano o manejar error
        // Para este caso, asumiremos que el backend acepta texto o JSON
      }

      const payload = {
        id_equipo: parseInt(selectedEquipoId),
        especificaciones_tecnicas: specs,
        manual_operacion_url: formData.manual_operacion_url,
        vida_util_estimada_anios: parseInt(formData.vida_util_estimada_anios),
        frecuencia_mantenimiento_dias: parseInt(
          formData.frecuencia_mantenimiento_dias
        ),
      };

      let result;
      if (datosTecnicos && datosTecnicos.id_datos_tecnicos) {
        result = await updateDatosTecnicos(
          datosTecnicos.id_datos_tecnicos,
          payload
        );
      } else {
        result = await createDatosTecnicos(payload);
      }

      if (result.success) {
        toast({
          title: "Datos guardados",
          description: "La información técnica se ha actualizado.",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron guardar los datos.",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Datos Técnicos</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona especificaciones y documentación técnica de los equipos.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Selección de Equipo</CardTitle>
          <CardDescription>
            Elige un equipo para ver o editar sus datos técnicos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Select
                value={selectedEquipoId}
                onValueChange={setSelectedEquipoId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar equipo..." />
                </SelectTrigger>
                <SelectContent>
                  {loadingEquipos ? (
                    <div className="p-2 text-center text-sm text-muted-foreground">
                      Cargando...
                    </div>
                  ) : (
                    equipos.map((equipo) => (
                      <SelectItem
                        key={equipo.id_equipo}
                        value={equipo.id_equipo.toString()}
                      >
                        {equipo.nombre_equipo} - {equipo.modelo} (
                        {equipo.numero_serie})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedEquipoId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Información Técnica
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingDatos ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vida_util">Vida Útil Estimada (Años)</Label>
                    <Input
                      id="vida_util"
                      type="number"
                      value={formData.vida_util_estimada_anios}
                      onChange={(e) =>
                        handleChange("vida_util_estimada_anios", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frecuencia">
                      Frecuencia Mantenimiento (Días)
                    </Label>
                    <Input
                      id="frecuencia"
                      type="number"
                      value={formData.frecuencia_mantenimiento_dias}
                      onChange={(e) =>
                        handleChange(
                          "frecuencia_mantenimiento_dias",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manual">URL del Manual de Operación</Label>
                  <Input
                    id="manual"
                    placeholder="https://..."
                    value={formData.manual_operacion_url}
                    onChange={(e) =>
                      handleChange("manual_operacion_url", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specs">
                    Especificaciones Técnicas (JSON)
                  </Label>
                  <Textarea
                    id="specs"
                    rows={10}
                    className="font-mono text-sm"
                    placeholder='{"voltaje": "220V", "potencia": "500W"}'
                    value={formData.especificaciones_tecnicas}
                    onChange={(e) =>
                      handleChange("especificaciones_tecnicas", e.target.value)
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Ingresa las especificaciones en formato JSON para mejor
                    estructuración.
                  </p>
                </div>

                <Button type="submit" className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
