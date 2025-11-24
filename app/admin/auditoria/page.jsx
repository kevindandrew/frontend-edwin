"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import useAuditoria from "@/hooks/useAuditoria";
import useTecnicos from "@/hooks/useTecnicos";
import AuditoriaFilters from "@/components/auditoria/AuditoriaFilters";
import AuditoriaTable from "@/components/auditoria/AuditoriaTable";
import AuditoriaDialog from "@/components/auditoria/AuditoriaDialog";

export default function AuditoriaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTabla, setFiltroTabla] = useState(undefined);
  const [filtroOperacion, setFiltroOperacion] = useState(undefined);
  const [filtroUsuario, setFiltroUsuario] = useState(undefined);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [auditoriaSeleccionada, setAuditoriaSeleccionada] = useState(null);

  const {
    auditorias,
    loading,
    error,
    fetchAuditorias,
    fetchAuditoriasPorTabla,
    fetchAuditoriasPorOperacion,
    fetchAuditoriasPorUsuario,
    fetchAuditoriasPorFecha,
  } = useAuditoria();

  const { tecnicos } = useTecnicos();

  const handleLimpiarFiltros = () => {
    setFiltroTabla(undefined);
    setFiltroOperacion(undefined);
    setFiltroUsuario(undefined);
    setFechaInicio("");
    setFechaFin("");
    setSearchTerm("");
  };

  const handleAplicarFiltros = async () => {
    if (filtroTabla) {
      await fetchAuditoriasPorTabla(filtroTabla);
    } else if (filtroOperacion) {
      await fetchAuditoriasPorOperacion(filtroOperacion);
    } else if (filtroUsuario) {
      await fetchAuditoriasPorUsuario(filtroUsuario);
    } else if (fechaInicio || fechaFin) {
      await fetchAuditoriasPorFecha(fechaInicio, fechaFin);
    } else {
      await fetchAuditorias();
    }
  };

  const filteredAuditorias = auditorias.filter((a) =>
    searchTerm
      ? a.tabla?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.operacion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.id_usuario?.toString().includes(searchTerm)
      : true
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Auditoría del Sistema</h1>
        <p className="text-muted-foreground mt-2">
          Registro de todas las operaciones realizadas en el sistema
        </p>
      </div>

      <AuditoriaFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filtroTabla={filtroTabla}
        setFiltroTabla={setFiltroTabla}
        filtroOperacion={filtroOperacion}
        setFiltroOperacion={setFiltroOperacion}
        filtroUsuario={filtroUsuario}
        setFiltroUsuario={setFiltroUsuario}
        fechaInicio={fechaInicio}
        setFechaInicio={setFechaInicio}
        fechaFin={fechaFin}
        setFechaFin={setFechaFin}
        tecnicos={tecnicos}
        onAplicar={handleAplicarFiltros}
        onLimpiar={handleLimpiarFiltros}
      />

      {error && (
        <Alert variant="destructive">
          <p>Error al cargar auditorías: {error}</p>
        </Alert>
      )}

      {!loading && auditorias.length === 0 && !error && (
        <Alert>
          <p>
            Aplica los filtros y haz clic en "Aplicar" para buscar registros de
            auditoría.
          </p>
        </Alert>
      )}

      <AuditoriaTable
        auditorias={filteredAuditorias}
        onVerDetalle={(auditoria) => {
          setAuditoriaSeleccionada(auditoria);
          setDetalleOpen(true);
        }}
      />

      <AuditoriaDialog
        open={detalleOpen}
        onClose={() => setDetalleOpen(false)}
        auditoria={auditoriaSeleccionada}
      />
    </div>
  );
}
