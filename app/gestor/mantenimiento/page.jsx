"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useMantenimientos from "@/hooks/useMantenimientos";
import useEquipos from "@/hooks/useEquipos";
import useRepuestos from "@/hooks/useRepuestos";
import useTecnicos from "@/hooks/useTecnicos";
import MantenimientosTable from "@/app/admin/mantenimiento/_components/MantenimientosTable";
import NuevoMantenimientoDialog from "@/app/admin/mantenimiento/_components/NuevoMantenimientoDialog";
import MantenimientoViewDialog from "@/app/admin/mantenimiento/_components/MantenimientoViewDialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function GestorMantenimientoPage() {
  const { toast } = useToast();
  const {
    mantenimientos,
    loading,
    crearMantenimiento,
    actualizarMantenimiento,
    fetchRepuestosPorMantenimiento,
  } = useMantenimientos();
  const { equipos } = useEquipos();
  const { repuestos } = useRepuestos();
  const { tecnicos } = useTecnicos();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [mantenimientoSeleccionado, setMantenimientoSeleccionado] =
    useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [repuestosPorMantenimiento, setRepuestosPorMantenimiento] = useState(
    {}
  );

  useEffect(() => {
    cargarRepuestosPorMantenimiento();
  }, [mantenimientos]);

  const cargarRepuestosPorMantenimiento = async () => {
    const repuestosMap = {};
    for (const mant of mantenimientos) {
      const repuestosUsados = await fetchRepuestosPorMantenimiento(
        mant.id_mantenimiento
      );
      repuestosMap[mant.id_mantenimiento] = repuestosUsados;
    }
    setRepuestosPorMantenimiento(repuestosMap);
  };

  const obtenerNombreEquipo = (idEquipo) => {
    const equipo = equipos.find((e) => e.id_equipo === idEquipo);
    return equipo?.nombre_equipo || equipo?.nombre || "N/A";
  };

  const filteredMantenimientos = mantenimientos
    .filter((m) =>
      obtenerNombreEquipo(m.id_equipo)
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort(
      (a, b) => new Date(b.fecha_programada) - new Date(a.fecha_programada)
    );

  const handleNuevo = () => {
    setMantenimientoSeleccionado(null);
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleEditar = (mantenimiento) => {
    const repuestosUsados =
      repuestosPorMantenimiento[mantenimiento.id_mantenimiento] || [];
    setMantenimientoSeleccionado({
      ...mantenimiento,
      repuestos_usados: repuestosUsados,
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleVer = (mantenimiento) => {
    const repuestosUsados =
      repuestosPorMantenimiento[mantenimiento.id_mantenimiento] || [];
    setMantenimientoSeleccionado({
      ...mantenimiento,
      repuestos_usados: repuestosUsados,
    });
    setViewDialogOpen(true);
  };

  const handleSubmit = async (payload) => {
    try {
      if (isEditing) {
        await actualizarMantenimiento(
          mantenimientoSeleccionado.id_mantenimiento,
          payload
        );
        toast({
          title: "Mantenimiento actualizado",
          description: "Los cambios se han guardado correctamente.",
        });
      } else {
        await crearMantenimiento(payload);
        toast({
          title: "Mantenimiento programado",
          description: "La tarea ha sido asignada correctamente.",
        });
      }
      setDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un error al procesar la solicitud.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Mantenimientos</h1>
          <p className="text-muted-foreground mt-2">
            Programa y asigna tareas de mantenimiento.
          </p>
        </div>
        <Button onClick={handleNuevo}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Tarea
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por equipo..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <MantenimientosTable
        mantenimientos={filteredMantenimientos}
        loading={loading}
        equipos={equipos}
        tecnicos={tecnicos}
        repuestosPorMantenimiento={repuestosPorMantenimiento}
        onEdit={handleEditar}
        onDelete={() => {}} // Disable delete for now
        onView={handleVer}
        onRepuestos={() => {}} // Repuestos managed in edit dialog
      />

      <NuevoMantenimientoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mantenimiento={mantenimientoSeleccionado}
        isEditing={isEditing}
        equipos={equipos}
        tecnicos={tecnicos}
        repuestos={repuestos}
        onSubmit={handleSubmit}
      />

      <MantenimientoViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        mantenimiento={mantenimientoSeleccionado}
        equipos={equipos}
        tecnicos={tecnicos}
      />
    </div>
  );
}
