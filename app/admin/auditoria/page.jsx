"use client";

import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import useAuditoria from "@/hooks/useAuditoria";
import useTecnicos from "@/hooks/useTecnicos";
import { useUsuarios } from "@/hooks/useUsuarios";
import AuditoriaFilters from "./_components/AuditoriaFilters";
import AuditoriaTable from "./_components/AuditoriaTable";
import AuditoriaDialog from "./_components/AuditoriaDialog";
import { generarPDFAuditoria } from "@/app/admin/reportes/_components/generarPDFReportes";

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
  const { usuarios } = useUsuarios();

  useEffect(() => {
    fetchAuditorias();
  }, []);

  const handleLimpiarFiltros = () => {
    setFiltroTabla(undefined);
    setFiltroOperacion(undefined);
    setFiltroUsuario(undefined);
    setFechaInicio("");
    setFechaFin("");
    setSearchTerm("");
    fetchAuditorias();
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

  const handleExportarPDF = () => {
    generarPDFAuditoria(filteredAuditorias, usuarios);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Auditoría del Sistema</h1>
          <p className="text-muted-foreground mt-2">
            Registro de todas las operaciones realizadas en el sistema
          </p>
        </div>
        <Button onClick={handleExportarPDF} className="gap-2">
          <Download className="w-4 h-4" />
          Exportar PDF
        </Button>
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
          <p>No se encontraron registros de auditoría.</p>
        </Alert>
      )}

      <AuditoriaTable
        auditorias={filteredAuditorias}
        usuarios={usuarios}
        onVerDetalle={(auditoria) => {
          setAuditoriaSeleccionada(auditoria);
          setDetalleOpen(true);
        }}
      />

      <AuditoriaDialog
        open={detalleOpen}
        onClose={() => setDetalleOpen(false)}
        auditoria={auditoriaSeleccionada}
        usuarios={usuarios}
      />
    </div>
  );
}
