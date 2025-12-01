"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  AlertCircle,
  Calendar as CalendarIcon,
  List,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useMantenimientos from "@/hooks/useMantenimientos";
import useEquipos from "@/hooks/useEquipos";
import useRepuestos from "@/hooks/useRepuestos";
import useTecnicos from "@/hooks/useTecnicos";
import useClientes from "@/hooks/useClientes";
import MantenimientosTable from "./_components/MantenimientosTable";
import MantenimientoCalendar from "./_components/MantenimientoCalendar";
import NuevoMantenimientoDialog from "./_components/NuevoMantenimientoDialog";
import DeleteMantenimientoDialog from "./_components/DeleteMantenimientoDialog";
import MantenimientoViewDialog from "./_components/MantenimientoViewDialog";
import RepuestosUsadosDialog from "./_components/RepuestosUsadosDialog";

export default function MantenimientoPage() {
  const {
    mantenimientos,
    loading,
    crearMantenimiento,
    actualizarMantenimiento,
    eliminarMantenimiento,
    fetchRepuestosPorMantenimiento,
    registrarUsoRepuesto,
    actualizarUsoRepuesto,
    eliminarUsoRepuesto,
  } = useMantenimientos();
  const { equipos, fetchEquipoById } = useEquipos();
  const { repuestos, actualizarStock } = useRepuestos();
  const { tecnicos, fetchTecnicoById } = useTecnicos();
  const { fetchClienteById } = useClientes();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [repuestosDialogOpen, setRepuestosDialogOpen] = useState(false);
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

  const calcularEstado = (m) => {
    if (m.fecha_realizacion) return "Completado";
    const fechaProgramada = new Date(m.fecha_programada);
    const hoy = new Date();
    if (fechaProgramada < hoy) return "Pendiente";
    if (fechaProgramada.toDateString() === hoy.toDateString())
      return "En Progreso";
    return "Programado";
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
    .sort((a, b) => a.id_mantenimiento - b.id_mantenimiento);

  const handleNuevo = () => {
    setMantenimientoSeleccionado(null);
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleEditar = (mantenimiento) => {
    setMantenimientoSeleccionado({
      ...mantenimiento,
      repuestos_usados:
        repuestosPorMantenimiento[mantenimiento.id_mantenimiento] || [],
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleVer = async (mantenimiento) => {
    try {
      const repuestosUsados =
        repuestosPorMantenimiento[mantenimiento.id_mantenimiento] || [];

      // Obtener equipo y técnico completos desde la API
      const equipo = await fetchEquipoById(mantenimiento.id_equipo);
      const tecnico = await fetchTecnicoById(mantenimiento.id_tecnico);

      // Si el equipo tiene id_cliente, obtener información del cliente
      let clienteData = null;
      if (equipo?.id_cliente) {
        clienteData = await fetchClienteById(equipo.id_cliente);
      }

      setMantenimientoSeleccionado({
        ...mantenimiento,
        equipo: {
          ...equipo,
          cliente: clienteData,
        },
        tecnico,
        repuestos_usados: repuestosUsados,
      });
      setViewDialogOpen(true);
    } catch (error) {}
  };

  const handleEliminar = (mantenimiento) => {
    setMantenimientoSeleccionado(mantenimiento);
    setDeleteDialogOpen(true);
  };

  const handleVerRepuestos = (mantenimiento) => {
    setMantenimientoSeleccionado({
      ...mantenimiento,
      repuestos_usados:
        repuestosPorMantenimiento[mantenimiento.id_mantenimiento] || [],
    });
    setRepuestosDialogOpen(true);
  };

  const handleSubmit = async (payload) => {
    try {
      if (isEditing) {
        // Actualizar mantenimiento
        await actualizarMantenimiento(
          mantenimientoSeleccionado.id_mantenimiento,
          payload
        );

        // Manejar repuestos en edición
        const repuestosActuales =
          repuestosPorMantenimiento[
            mantenimientoSeleccionado.id_mantenimiento
          ] || [];
        const repuestosNuevos = payload.repuestos_usados || [];

        // Eliminar repuestos que ya no están
        for (const repuestoActual of repuestosActuales) {
          const existe = repuestosNuevos.find(
            (r) => r.id_repuesto === repuestoActual.id_repuesto
          );
          if (!existe) {
            await eliminarUsoRepuesto(
              mantenimientoSeleccionado.id_mantenimiento,
              repuestoActual.id_repuesto
            );
          }
        }

        // Agregar o actualizar repuestos
        for (const repuesto of repuestosNuevos) {
          const existente = repuestosActuales.find(
            (r) => r.id_repuesto === repuesto.id_repuesto
          );
          if (existente) {
            // Actualizar si la cantidad cambió
            if (existente.cantidad_usada !== repuesto.cantidad_usada) {
              const diferencia =
                repuesto.cantidad_usada - existente.cantidad_usada;
              if (diferencia > 0) {
                // Se usa más cantidad, reducir stock
                await actualizarStock(repuesto.id_repuesto, diferencia);
              }
              await actualizarUsoRepuesto(
                mantenimientoSeleccionado.id_mantenimiento,
                repuesto.id_repuesto,
                repuesto.cantidad_usada
              );
            }
          } else {
            // Registrar nuevo repuesto y reducir stock
            await actualizarStock(
              repuesto.id_repuesto,
              repuesto.cantidad_usada
            );
            await registrarUsoRepuesto({
              id_mantenimiento: mantenimientoSeleccionado.id_mantenimiento,
              id_repuesto: repuesto.id_repuesto,
              cantidad_usada: repuesto.cantidad_usada,
            });
          }
        }
      } else {
        const nuevo = await crearMantenimiento(payload);
        if (payload.repuestos_usados?.length > 0) {
          for (const repuesto of payload.repuestos_usados) {
            // Reducir stock al registrar repuesto
            await actualizarStock(
              repuesto.id_repuesto,
              repuesto.cantidad_usada
            );
            await registrarUsoRepuesto({
              id_mantenimiento: nuevo.id_mantenimiento,
              id_repuesto: repuesto.id_repuesto,
              cantidad_usada: repuesto.cantidad_usada,
            });
          }
        }
      }
      setDialogOpen(false);
      await cargarRepuestosPorMantenimiento();
    } catch (error) {}
  };

  const handleConfirmDelete = async () => {
    try {
      await eliminarMantenimiento(mantenimientoSeleccionado.id_mantenimiento);
      setDeleteDialogOpen(false);
      setMantenimientoSeleccionado(null);
    } catch (error) {
      alert(
        "Error al eliminar el mantenimiento. Por favor, verifica tu conexión e intenta nuevamente."
      );
    }
  };

  const pendientes = mantenimientos.filter(
    (m) => calcularEstado(m) === "Pendiente"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mantenimiento</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona el mantenimiento de equipos biomédicos
          </p>
        </div>
        <Button onClick={handleNuevo} className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Mantenimiento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Registros</p>
          <p className="text-3xl font-bold mt-2">{mantenimientos.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Completados</p>
          <p className="text-3xl font-bold mt-2 text-green-600 dark:text-green-400">
            {
              mantenimientos.filter((m) => calcularEstado(m) === "Completado")
                .length
            }
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">En Progreso</p>
          <p className="text-3xl font-bold mt-2 text-blue-600 dark:text-blue-400">
            {
              mantenimientos.filter((m) => calcularEstado(m) === "En Progreso")
                .length
            }
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Pendientes</p>
          <p className="text-3xl font-bold mt-2 text-red-600 dark:text-red-400">
            {pendientes}
          </p>
        </Card>
      </div>

      {pendientes > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900 dark:text-red-300">
              Mantenimiento Pendiente
            </p>
            <p className="text-sm text-red-800 dark:text-red-200">
              {pendientes}{" "}
              {pendientes === 1 ? "equipo requiere" : "equipos requieren"}{" "}
              mantenimiento urgente
            </p>
          </div>
        </div>
      )}

      <Tabs defaultValue="lista" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="lista" className="gap-2">
            <List className="w-4 h-4" />
            Vista de Lista
          </TabsTrigger>
          <TabsTrigger value="calendario" className="gap-2">
            <CalendarIcon className="w-4 h-4" />
            Calendario
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4 mt-4">
          <Card className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por equipo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </Card>

          <Card className="overflow-hidden">
            <MantenimientosTable
              mantenimientos={filteredMantenimientos}
              loading={loading}
              equipos={equipos}
              repuestosPorMantenimiento={repuestosPorMantenimiento}
              onVer={handleVer}
              onEditar={handleEditar}
              onEliminar={handleEliminar}
              onVerRepuestos={handleVerRepuestos}
            />
          </Card>
        </TabsContent>

        <TabsContent value="calendario" className="mt-4">
          <MantenimientoCalendar
            mantenimientos={mantenimientos}
            onSelectMantenimiento={handleVer}
          />
        </TabsContent>
      </Tabs>

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

      <DeleteMantenimientoDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        mantenimiento={mantenimientoSeleccionado}
        onConfirm={handleConfirmDelete}
      />

      <MantenimientoViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        mantenimiento={mantenimientoSeleccionado}
        equipo={mantenimientoSeleccionado?.equipo}
        tecnico={mantenimientoSeleccionado?.tecnico}
        repuestos={mantenimientoSeleccionado?.repuestos_usados || []}
      />

      <RepuestosUsadosDialog
        open={repuestosDialogOpen}
        onOpenChange={setRepuestosDialogOpen}
        mantenimiento={mantenimientoSeleccionado}
        repuestos={mantenimientoSeleccionado?.repuestos_usados || []}
      />
    </div>
  );
}
